from django.contrib import admin
from django.urls import re_path, reverse
from django.http import HttpResponseRedirect
from django.utils.translation import gettext_lazy as _
from django.template.response import TemplateResponse

from mptt.admin import MPTTModelAdmin

from .models import Business, Category, Request, BusinessHistoryEvent, RequestHistoryEvent


class StatusFilter(admin.SimpleListFilter):
    
    title = _('status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return model_admin.model.events.STATUS_CHOICES

    def queryset(self, request, queryset):
        if self.value() is None:
            return queryset.all()
        else:
            return queryset.filter(status=self.value())


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    
    list_display = ('name', 'location', 'main_category', 'get_creation', 'get_status_text')
    ordering = ('name',)
    filter_horizontal = ('other_categories', 'delivers_to', 'delivers_to_canton', 'delivers_to_municipality', 'delivers_to_district')
    search_fields = ('name', 'location__npa', 'location__name')
    list_filter = (StatusFilter,)


@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):

    list_display = ('name', 'name_en', 'name_fr', 'name_de', 'name_it')
    mptt_level_indent = 20


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    
    list_display = ('name', 'location', 'source', 'lang', 'get_creation', 'get_status_text')
    list_filter = ('source', 'lang', StatusFilter)
    search_fields = ('name',)
