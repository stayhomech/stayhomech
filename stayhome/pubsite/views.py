import uuid
import json
import random
from urllib.parse import quote

from django.views.generic import TemplateView, View, FormView
from django.http import JsonResponse, Http404, HttpResponseRedirect
from django.db.models import Q
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
from django.contrib.gis.db.models.functions import Distance
from datadog import statsd

from geodata.models import NPA
from geodata.serializers import NPASerializer, MunicipalitySerializer, DistrictSerializer, CantonSerializer
from business.models import Business, Category
from business.forms import BusinessAddForm
from business.serializers import BusinessReactSerializer, BusinessReactLazySerializer, CategoryReactSerializer
from .forms import ContactForm


@method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(cache_page(60 * 60), name='dispatch')
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


@method_decorator(cache_page(60 * 60), name='dispatch')
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


@method_decorator(cache_page(60 * 30), name='dispatch')
class ReactContentView(View):

    def get(self, request, *args, **kwargs):

        # NPA
        try:
            npa = NPA.objects.rewrite(False).get(npa__exact=kwargs['npa'], name__exact=kwargs['name'])
        except NPA.DoesNotExist as e:
            raise e
            raise Http404(_("NPA does not exist"))
        
        # Prepare cached data
        cd = {}

        # NPA
        cd['npa'] = NPASerializer(npa).data

        # Municipality
        municipality = npa.municipality
        cd['municipality'] = MunicipalitySerializer(municipality).data

        # District
        district = municipality.district_id
        cd['district'] = DistrictSerializer(district).data

        # Canton
        canton = district.canton
        cd['canton'] = CantonSerializer(canton).data

        # All NPAs in municipality
        npas = municipality.npa_set.all()

        # Fetch businesses from DB
        bpks = Business.objects.filter(status=Business.events.VALID).filter(
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
            distance=Distance('location__geo_center', npa.geo_center)
        ).order_by('distance', 'name').values_list('pk', 'distance')

        # Business array
        businesses = []
        for bpk in bpks:
            cache_key = 'business_details_' + str(bpk[0])
            business = cache.get(cache_key)
            if business is None:
                business = Business.objects.get(pk=bpk[0])
                cache.set(cache_key, business, 3600 * (1 + random.uniform(0, 1)))
            business.distance = bpk[1]
            businesses.append(business)

        # Serialize businesses
        cd['businesses'] = BusinessReactLazySerializer(businesses, many=True).data

        # Categories
        categories = Category.objects.filter(
            Q(as_main_category__in=businesses)
            |
            Q(as_other_category__in=businesses)
        ).distinct().order_by('parent__tree_id', 'tree_id')
        cd['categories'] = CategoryReactSerializer(categories, many=True).data

        # Parent categories
        parents = []
        for category in categories:
            if category.parent is not None and category.parent.pk not in parents:
                parents.append(category.parent.pk)
        parents = Category.objects.filter(pk__in=parents).distinct().order_by('tree_id')
        cd['parent_categories'] = CategoryReactSerializer(parents, many=True).data

        # Return content
        return JsonResponse(cd)


@method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(cache_page(60 * 30), name='dispatch')
class ContentView(TemplateView):

    template_name = "content_react.html"

    def get_context_data(self, **kwargs):

        # Return
        context = super().get_context_data(**kwargs)
        context['running_env'] = settings.RUNNING_ENV
        context['lang'] = translation.get_language()
        context['locize'] = settings.LOCIZE_API_KEY
        context['content_uuid'] = str(kwargs['npa']) + '/' + quote(kwargs['name'])
        return context


@method_decorator(cache_page(60 * 60), name='dispatch')
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
