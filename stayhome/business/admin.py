from django.contrib import admin
from django.urls import re_path, reverse
from django.http import HttpResponseRedirect
from django.utils.translation import gettext_lazy as _
from django.template.response import TemplateResponse

from mptt.admin import MPTTModelAdmin

from .models import Business, Category, Request


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'main_category')
    ordering = ('name',)
    filter_horizontal = ('other_categories', 'delivers_to', 'delivers_to_canton', 'delivers_to_municipality', 'delivers_to_district')

    def add_view(self, request, form_url='', extra_context=None):

        self.add_form_template = None

        return super(BusinessAdmin, self).add_view(
            request, form_url, extra_context=extra_context,
        )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            re_path(
                r'^build/(?P<request_uuid>.*)/$',
                self.admin_site.admin_view(self.build_business),
                name='build-business'
            )
        ]
        return custom_urls + urls

    def build_business(self, request, request_uuid, form_url='', extra_context=None):

        extra_context = extra_context or {}

        extra_context['request_uuid'] = request_uuid
        extra_context['request_obj'] = Request.objects.get(uuid=request_uuid)

        self.add_form_template = 'admin/business/business/build_form.html'

        return super(BusinessAdmin, self).add_view(
            request, form_url, extra_context=extra_context,
        )


@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('name',)
    mptt_level_indent = 20

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    
    list_display = ('creation', 'name', 'location', 'source', 'handled', 'deleted')
    ordering = ('-creation',)
    list_filter = ('source', 'handled', 'deleted')
    search_fields = ('name', 'location__npa', 'location__name')
