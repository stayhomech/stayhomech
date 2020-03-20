"""
WSGI config for stayhome project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Running environment
RUNNING_ENV = os.environ.get("RUNNING_ENV", default='dev')
if RUNNING_ENV == 'prod':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stayhome.settings.prod')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stayhome.settings.dev')

application = get_wsgi_application()
