from .base import *


# Application
DEBUG = 1
SECRET_KEY = 'welfnqlkjfrvnalrkvfejqaelfkjqaeweff234243'
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']


# Use sqlite database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, '..', 'db.sqlite')
    }
}


# Missing ENV
RECAPTCHA_PRIVATE_KEY = ''
RECAPTCHA_PUBLIC_KEY = ''
