import json

from django.shortcuts import render
from django.views.generic import TemplateView, View, FormView
from django.http import JsonResponse, Http404, HttpResponseRedirect
from django.db.models import Q, Case, When, Value, PositiveSmallIntegerField
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.translation import gettext_lazy as _
from django.utils import translation
from django.conf import settings
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.translation import get_language
from django.views.decorators.clickjacking import xframe_options_exempt
from django.core.mail import send_mail
from datadog import statsd

from geodata.models import NPA
from business.models import Business, Request, Category
from business.forms import BusinessAddForm
from .forms import ContactForm


@method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(cache_page(60 * 5), name='dispatch')
class HomeView(TemplateView):

    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['count'] = Business.objects.filter(status=Business.events.VALID).count()
        return context

    def get(self, request, *args, **kwargs):

        # Stats
        statsd.increment('landing.count', tags=[
            'lang:' + get_language()
        ])

        return super(HomeView, self).get(self, request, *args, **kwargs)


@method_decorator(xframe_options_exempt, name='dispatch')
class EmbededView(TemplateView):

    template_name = "embed.html"


@method_decorator(cache_page(60 * 5), name='dispatch')
class HomeLocationView(View):

    def get(self, request, *args, **kwargs):

        query = self.request.GET.get('q')

        npas = None

        # Convert
        try:

            # Search NPA number
            npas = NPA.objects.filter(npa__startswith=int(query)).order_by('npa')

        except ValueError:

            # Search city name
            npas = NPA.objects.rewrite(False).filter(name__icontains=query).order_by('name')

        # Response
        if npas is not None and npas.count() > 0:
            out = []
            for npa in npas:
                out.append("%d %s" % (npa.npa, npa.name))
            return JsonResponse(out, safe=False)

        # Default empty response
        return JsonResponse([], safe=False)


@method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(cache_page(60 * 5), name='dispatch')
class ContentView(TemplateView):

    template_name = "content.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        try:
            npa = NPA.objects.rewrite(False).get(npa__exact=kwargs['npa'], name__exact=kwargs['name'])
        except NPA.DoesNotExist as e:
            raise e
            raise Http404(_("NPA does not exist"))
        
        municipality = npa.municipality
        context['municipality'] = municipality

        district = municipality.district_id
        context['district'] = district

        canton = district.canton
        context['canton'] = canton

        npas = municipality.npa_set.all()

        context['npa'] = npa

        # Stats
        statsd.increment('search', tags=[
            'n_pk:' + str(npa.pk),
            'n_code:' + str(npa.npa),
            'n_name:' + str(npa.name_en).replace(' ', '_'),
            'm_pk:' + str(municipality.pk),
            'm_name:' + str(municipality.name_en).replace(' ', '_'),
            'd_pk:' + str(district.pk),
            'd_name:' + str(district.name_en).replace(' ', '_'),
            'c_pk:' + str(canton.pk),
            'c_code:' + str(canton.code).replace(' ', '_')
        ])

        context['businesses'] = Business.objects.filter(status=Business.events.VALID).filter(
            Q(location=npa)
            |
            Q(delivers_to__in=[npa])
            |
            Q(delivers_to_municipality__in=[municipality])
            |
            Q(delivers_to_district__in=[district])
            |
            Q(delivers_to_canton__in=[canton])
            |
            Q(delivers_to_ch=True)
        ).distinct().annotate(
            radius=Case(
                When(location=npa, then=Value(0)),
                When(location__in=npas, then=Value(1)),
                When(delivers_to__in=[npa], then=Value(2)),
                When(delivers_to_municipality__in=[municipality], then=Value(3)),
                When(delivers_to_district__in=[district], then=Value(4)),
                When(delivers_to_canton__in=[canton], then=Value(5)),
                When(delivers_to_ch=True, then=Value(6)),
                default=Value(7),
                output_field=PositiveSmallIntegerField()
            ),
        ).order_by('radius', 'name')

        # Stats
        statsd.gauge('results', context['businesses'].count(), tags=[
            'n_pk:' + str(npa.pk),
            'n_code:' + str(npa.npa),
            'n_name:' + str(npa.name_en).replace(' ', '_')
        ])

        # Categories
        context['categories'] = Category.objects.filter(
            Q(as_main_category__in=context['businesses'])
            |
            Q(as_other_category__in=context['businesses'])
        ).distinct().order_by('parent__tree_id', 'tree_id')

        # Structured categories
        context['sc'] = {}
        for category in context['categories']:
            parent = category.parent
            if parent is not None:
                if parent.pk not in context['sc']:
                    context['sc'][parent.pk] = {
                        'obj': parent,
                        'children': {}
                    }
                context['sc'][parent.pk]['children'][category.pk] = category

        # Return
        return context


class AboutView(TemplateView):

    template_name = "about.html"

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context['form'] = ContactForm()

        return context

    def post(self, request, *args, **kwargs):

        form = ContactForm(request.POST)

        if form.is_valid():
        
            send_mail(
                'New message from website',
                request.POST.get('message'),
                request.POST.get('name') + '<' + request.POST.get('email') + '>',
                ['info@stayhome.ch'],
                fail_silently=True,
            )

            context = self.get_context_data()
            context['success'] = _('Your message has been sent.')
            return self.render_to_response(context=context)

        else:

            context = self.get_context_data()
            context['form'] = form
            return self.render_to_response(context=context)


class AddView(FormView):
    
    template_name = "add.html"
    form_class = BusinessAddForm
    success_url = '/add/success/'

    def form_valid(self, form):
        form.save_request()
        return super().form_valid(form)

class SetLanguageView(View):

    # Default language
    lang_code = 'en'

    def get(self, request, *args, **kwargs):

        translation.activate(self.lang_code)
        response = HttpResponseRedirect(redirect_to='/')
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, self.lang_code)

        return response
