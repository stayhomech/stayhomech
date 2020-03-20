from django import template
from django.conf import settings

register = template.Library()

@register.simple_tag
def google_ua():
    return settings.GOOGLE_UA
