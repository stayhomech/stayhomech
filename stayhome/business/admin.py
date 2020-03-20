from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import Business, Category, Request


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'main_category')
    ordering = ('name',)
    filter_horizontal = ('other_categories', 'delivers_to')

@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('name',)
    mptt_level_indent = 20

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    pass
