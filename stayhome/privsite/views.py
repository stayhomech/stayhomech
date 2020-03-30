from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import ListView, DetailView, RedirectView, View
from django.utils.translation import gettext_lazy as _
from django.utils.encoding import force_str
from django.shortcuts import redirect, get_object_or_404
from django.urls import reverse
from django.forms import modelform_factory
from django.http import JsonResponse, Http404
from django.db.models import Q

from business.models import Request, Category
from .forms.business_add import BusinessAddForm
from geodata.models import NPA, Municipality, District, Canton


def add_navigation_context(context, user):

        pending_requests = Request.objects.filter(status=Request.events.NEW).count()
        context['pending_requests'] = pending_requests

        pending_user_requests = Request.objects.filter(status=Request.events.RESERVED, owner=user).count()
        context['pending_user_requests'] = pending_user_requests

        return context


@method_decorator(login_required, name='dispatch')
class RequestsListView(ListView):

    template_name = "requests_list.html"
    prefix = ''
    paginate_by = 10

    def get_queryset(self):

        objects = Request.objects.filter(status=Request.events.NEW)

        lang = self.request.GET.get('lang')
        if lang is not None and lang != '':
            objects = objects.filter(lang=lang)

        return objects.order_by('creation')

    def get_context_data(self, **kwargs):

        context = super(RequestsListView, self).get_context_data(**kwargs)
        context = add_navigation_context(context, self.request.user.id)

        context['title'] = _('Pending requests')

        if self.get_queryset().count() > 0:
            context['description'] = _('%d requets are available to process.' %  self.get_queryset().count())
        else:
            context['description'] = _('No pending request.')

        context['prefix'] = self.prefix

        context['lang'] = self.request.GET.get('lang')

        return context


@method_decorator(login_required, name='dispatch')
class RequestsUserListView(RequestsListView):

    def get_queryset(self):

        return Request.objects.filter(status=Request.events.RESERVED, owner=self.request.user.id).order_by('creation')

    def get_context_data(self, **kwargs):

        context = super(RequestsUserListView, self).get_context_data(**kwargs)

        context['title'] = _('Your requests')

        if self.get_queryset().count() > 0:
            context['description'] = _('%d requets are available to process.' % self.get_queryset().count())
        else:
            context['description'] = _('No pending request.')

        context['prefix'] = self.prefix

        return context


@method_decorator(login_required, name='dispatch')
class RequestsProcessView(DetailView):

    template_name = "requests_convert.html"
    prefix=''

    def get_queryset(self):
        return Request.objects.filter(pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs):

        context = super(RequestsProcessView, self).get_context_data(**kwargs)
        context = add_navigation_context(context, self.request.user.id)

        context['title'] = _('Convert request to business')

        context['form'] = BusinessAddForm

        context['next'] = reverse('mgmt:' + self.prefix + 'next')
        context['return'] = reverse('mgmt:' + self.prefix + 'index')
        context['prefix'] = self.prefix

        return context

    def get(self, request, *args, **kwargs):

        r = self.get_object()
        r.set_status(Request.events.RESERVED, user=self.request.user)

        return super(RequestsProcessView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        form = BusinessAddForm(request.POST, request.FILES)
        if form.is_valid():
            
            self.object = self.get_object()
            business = form.save()
            business.set_status(business.events.VALID, user=self.request.user)
            self.object.set_status(Request.events.HANDLED, user=self.request.user)
            
            return redirect(request.POST.get('next'))

        else:
            self.object = self.get_object()
            context = self.get_context_data()
            context['form'] = form
            return self.render_to_response(context=context)


@method_decorator(login_required, name='dispatch')
class RequestsProcessNextView(RedirectView):
    
    prefix=''

    def get_redirect_url(self, *args, **kwargs):
        qs = Request.objects.filter(status=Request.events.NEW).order_by('creation')
        if len(qs) > 0:
            return reverse('mgmt:' + self.prefix + 'convert', kwargs={'pk': qs[0].pk})
        else:
            return reverse('mgmt:' + self.prefix + 'index')


@method_decorator(login_required, name='dispatch')
class RequestsProcessDropView(RedirectView):
    
    prefix=''

    def get_redirect_url(self, *args, **kwargs):
        req = get_object_or_404(Request, pk=kwargs['pk'])
        req.set_status(Request.events.DELETED, user=self.request.user)
        return reverse('mgmt:' + self.prefix + 'index')


@method_decorator(login_required, name='dispatch')
class CategoriesTransListView(ListView):

    paginate_by = 10
    model=Category
    template_name='categories_list.html'

    def get_context_data(self, **kwargs):

        context = super(CategoriesTransListView, self).get_context_data(**kwargs)
        context = add_navigation_context(context, self.request.user.id)

        context['title'] = _('Categories translations')

        if self.get_queryset().count() > 0:
            context['description'] = _('%d categories exist.' % self.model.objects.all().count())
        else:
            context['description'] = _('No category defined.')

        return context

    def post(self, request, *args, **kwargs):

        form = modelform_factory(Category, fields=('name_en', 'name_fr', 'name_de', 'name_it'))(request.POST, instance=Category.objects.get(pk=request.POST.get('pk')))

        if form.is_valid():

            form.save()
            self.object_list = self.get_queryset()
            context = self.get_context_data(**kwargs)
            context['errors'] = False
            context['success'] = 'Category successfully updated.'
            return self.render_to_response(context=context)

        else:

            self.object_list = self.get_queryset()
            context = self.get_context_data(**kwargs)
            context['errors'] = form.errors
            context['success'] = False
            return self.render_to_response(context=context)


@method_decorator(login_required, name='dispatch')
class AjaxLookupView(View):

    def get(self, request, *args, **kwargs):

        query = request.GET.get('q')
        if query == '':
            raise Http404("Nothing to search.")

        data = []

        model = kwargs['model']
        if model == 'npa':
            
            data = NPA.objects.rewrite(False).filter(
                Q(npa__startswith=query)
                |
                Q(name__icontains=query)
            ).order_by('npa', 'name')

        elif model == 'municipality':

            data = Municipality.objects.rewrite(False).filter(name__icontains=query).order_by('name')

        elif model == 'district':

            data = District.objects.rewrite(False).filter(name__icontains=query).order_by('name')

        elif model == 'canton':

            data = Canton.objects.rewrite(False).filter(
                Q(name__icontains=query)
                |
                Q(code__icontains=query)
            ).order_by('name')

        elif model == 'category':

            data = Category.objects.rewrite(False).filter(parent__isnull=False, name__icontains=query).order_by('parent__name', 'name')

        else:
            raise Http404("Request model does not exist.")

        out = []
        for obj in data:
            if model == 'category':
                out.append({
                    'id': obj.pk,
                    'text': obj.get_path()
                })
            else:
                out.append({
                    'id': obj.pk,
                    'text': str(obj)
                })

        response = {
            'results': out
        }

        return JsonResponse(response)
