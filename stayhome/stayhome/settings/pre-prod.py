import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *


# Application
DEBUG = 0
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = ['preview.stayhome.ch', 'web']


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('MYSQL_APP_DB'),
        'USER': os.environ.get('MYSQL_APP_USER'),
        'PASSWORD': os.environ.get('MYSQL_APP_PASSWORD'),
        'HOST': 'db',
        'PORT': '3306',
        'CHARSET': 'utf8mb4'
    }
}


# Sentry configuration
sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN'),
    integrations=[DjangoIntegration()],

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)


# Cache
""" CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': 'memcached:11211',
    }
} """
