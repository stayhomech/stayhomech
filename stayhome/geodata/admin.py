from django.contrib import admin

from .models import DatasetModel, Municipality, NPA, Canton, District


@admin.register(DatasetModel)
class DatasetAddmin(admin.ModelAdmin):
    pass

@admin.register(Canton)
class CantonAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    ordering = ('name',)

@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name', 'canton')
    ordering = ('name',)

@admin.register(Municipality)
class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ('name', 'canton')
    ordering = ('name', 'canton')

@admin.register(NPA)
class NPAAdmin(admin.ModelAdmin):
    list_display = ('onrp_id', 'npa', 'name')
    ordering = ('onrp_id', 'npa', 'name')
    search_fields = ('npa', 'name')
