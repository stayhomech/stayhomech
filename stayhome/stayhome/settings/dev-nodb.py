from .base import *


# Application
DEBUG = True
SECRET_KEY = 'welfnqlkjfrvnalrkvfejqaelfkjqaeweff234243'
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']


# Use sqlite database
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.mysql',
        'NAME': 'stayhome',
        'USER': 'stayhome',
        'PASSWORD': 'stayhome',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'CHARSET': 'utf8mb4'
    }
}


# Missing ENV
RECAPTCHA_PRIVATE_KEY = ''
RECAPTCHA_PUBLIC_KEY = ''
