from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import ListView, DetailView, RedirectView
from django.utils.translation import gettext_lazy as _
from django.utils.encoding import force_str
from django.shortcuts import redirect, get_object_or_404
from django.urls import reverse
from django.forms import modelform_factory

from business.models import Request, Category
from .forms.business_add import BusinessAddForm


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
    queryset = Request.objects.all()
    prefix=''

    def get_context_data(self, **kwargs):

        r = self.get_object()
        r.set_status(Request.events.RESERVED, user=self.request.user)

        context = super(RequestsProcessView, self).get_context_data(**kwargs)
        context = add_navigation_context(context, self.request.user.id)

        context['title'] = _('Convert request to business')

        context['form'] = BusinessAddForm

        context['next'] = reverse('mgmt:' + self.prefix + 'next')
        context['return'] = reverse('mgmt:' + self.prefix + 'index')
        context['prefix'] = self.prefix

        return context

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
            context = super(RequestsProcessView, self).get_context_data(**kwargs)
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
