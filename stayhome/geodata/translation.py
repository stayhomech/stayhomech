from modeltranslation.translator import register, TranslationOptions

from .models import Municipality, NPA, Canton, District


@register(Canton)
class CantonTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(District)
class DistrictTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Municipality)
class MunicipalityTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(NPA)
class NPATranslationOptions(TranslationOptions):
    fields = ('name',)
