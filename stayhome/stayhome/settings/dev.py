from .base import *


# Application
DEBUG = 1
SECRET_KEY = 'welfnqlkjfrvnalrkvfejqaelfkjqaeweff234243'
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]', '192.168.1.162', 'api.localhost', 'web']


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('MYSQL_APP_DB'),
        'USER': os.environ.get('MYSQL_APP_USER'),
        'PASSWORD': os.environ.get('MYSQL_APP_PASSWORD'),
        'HOST': 'db',
        'PORT': '3306',
        'CHARSET': 'utf-8'
    }
}


# Missing ENV
RECAPTCHA_PRIVATE_KEY = ''
RECAPTCHA_PUBLIC_KEY = ''
