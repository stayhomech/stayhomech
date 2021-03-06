from .base import *


# Application
DEBUG = 1
SECRET_KEY = 'welfnqlkjfrvnalrkvfejqaelfkjqaeweff234243'
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]', 'web', 'stayhome.ch', 'www.stayhome.ch', 'preview.stayhome.ch']


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.mysql',
        'NAME': os.environ.get('MYSQL_APP_DB'),
        'USER': os.environ.get('MYSQL_APP_USER'),
        'PASSWORD': os.environ.get('MYSQL_APP_PASSWORD'),
        'HOST': 'db',
        'PORT': '3306',
        'CHARSET': 'utf8mb4'
    }
}


# Missing ENV
RECAPTCHA_PRIVATE_KEY = ''
RECAPTCHA_PUBLIC_KEY = ''
