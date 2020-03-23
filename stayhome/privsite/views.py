from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import ListView, DetailView, RedirectView
from django.utils.translation import gettext_lazy as _
from django.utils.encoding import force_str
from django.shortcuts import redirect
from django.urls import reverse

from business.models import Request
from .forms.business_add import BusinessAddForm


@method_decorator(login_required, name='dispatch')
class RequestsListView(ListView):

    template_name = "requests_list.html"
    queryset = Request.objects.filter(handled=False).order_by('creation')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = _('Pending requests')
        context['description'] = _('The following requets are available to process.')
        return context


@method_decorator(login_required, name='dispatch')
class RequestsProcessView(DetailView):

    template_name = "requests_convert.html"
    queryset = Request.objects.all()

    def get_context_data(self, **kwargs):
        context = super(RequestsProcessView, self).get_context_data(**kwargs)
        context['title'] = _('Convert request to business')
        context['form'] = BusinessAddForm
        return context

    def post(self, request, *args, **kwargs):
        form = BusinessAddForm(request.POST, request.FILES)
        if form.is_valid():
            
            self.object = self.get_object()
            form.save()
            self.object.handled = True
            self.object.save()
            
            return redirect(request.POST.get('next'))

        else:
            self.object = self.get_object()
            context = super(RequestsProcessView, self).get_context_data(**kwargs)
            context['form'] = form
            return self.render_to_response(context=context)

@method_decorator(login_required, name='dispatch')
class RequestsProcessNextView(RedirectView):
    
    def get_redirect_url(self, *args, **kwargs):
        qs = Request.objects.filter(handled=False).order_by('creation')
        if len(qs) > 0:
            return reverse('mgmt:convert', kwargs={'pk': qs[0].pk})
        else:
            return reverse('mgmt:index')