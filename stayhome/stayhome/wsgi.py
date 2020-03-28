"""
WSGI config for stayhome project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application


# Utility variable to detect environment to use
def set_environment():

    # Choosing environment
    RUNNING_ENV = os.environ.get("RUNNING_ENV", default='dev-nodb')
    if RUNNING_ENV == 'prod':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stayhome.settings.prod')
    elif RUNNING_ENV == 'pre-prod':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stayhome.settings.pre-prod')
    elif RUNNING_ENV == 'dev':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stayhome.settings.dev')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stayhome.settings.dev-nodb')


# Set environment
set_environment()


# Running environment
application = get_wsgi_application()
