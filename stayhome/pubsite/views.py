import json

from django.shortcuts import render
from django.views.generic import TemplateView, View, FormView
from django.http import JsonResponse
from django.db.models import Q
from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.translation import gettext_lazy as _


from geodata.models import NPA
from business.models import Business, Request
from business.forms import AddForm


@method_decorator(ensure_csrf_cookie, name='dispatch')
class HomeView(TemplateView):

    template_name = "home.html"


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

class ContentView(TemplateView):
    template_name = "content.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        try:
            npa = NPA.objects.rewrite(False).get(npa__exact=kwargs['npa'], name__exact=kwargs['name'])
        except NPA.DoesNotExist as e:
            raise e
            raise Http404(_("NPA does not exist"))
        
        context['npa'] = npa
        context['businesses'] = Business.objects.filter(
            Q(location=npa)
            |
            Q(delivers_to__in=[npa])
        ).distinct().order_by('name')
        return context

class AboutView(TemplateView):
    template_name = "about.html"

class AddView(FormView):
    
    template_name = "add.html"
    form_class = AddForm
    success_url = '/add/success/'

    def form_valid(self, form):
        form.save_request()
        return super().form_valid(form)
