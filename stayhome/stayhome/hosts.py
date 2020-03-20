from django.conf import settings
from django_hosts import patterns, host


host_patterns = patterns('',
    host(r'api', 'stayhome.urls.api', name='api'),
    host(r'www', settings.ROOT_URLCONF, name='www'),
)
