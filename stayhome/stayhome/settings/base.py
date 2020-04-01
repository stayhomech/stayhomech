import os

from django.utils.translation import gettext_lazy as _
from datadog import initialize


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Running environment
RUNNING_ENV = os.environ.get("RUNNING_ENV", default='dev-nodb')


# Application definition
INSTALLED_APPS = [

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'modeltranslation',
    'mptt',
    'phonenumber_field',
    'captcha',
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',
    'ddtrace.contrib.django',
    'corsheaders',
    'compressor',

    'geodata',
    'business',
    'pubsite',
    'privsite',
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'stayhome.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'stayhome.wsgi.application'


# Recaptcha
RECAPTCHA_PUBLIC_KEY = os.environ.get('RECAPTCHA_PUBLIC_KEY')
RECAPTCHA_PRIVATE_KEY = os.environ.get('RECAPTCHA_PRIVATE_KEY')
RECAPTCHA_DOMAIN = 'www.google.com'


# Google Analytics
GOOGLE_UA = os.environ.get('GOOGLE_UA')


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Zurich'

USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ('en', _('English')),
    ('de', _('German')),
    ('fr', _('French')),
    ('it', _('Italian')),
]
LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locales'),
]

MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'
MODELTRANSLATION_FALLBACK_LANGUAGES = ('en', 'de', 'fr', 'it')


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder'
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

WHITENOISE_ROOT = os.path.join(BASE_DIR, 'rootfiles')


# Pre-processing of Sass files
COMPRESS_PRECOMPILERS = (
    ('text/x-scss', 'django_libsass.SassCompiler'),
)
LIBSASS_SOURCE_COMMENTS = False
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True


# REST framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'stayhome.utils.rest.StayHomeAccessPermission',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'
    ]
}


# SYNC user
SYNC_USER = os.environ.get('SYNC_USER')


# Datadog
env = 'running-env:' + str(RUNNING_ENV)
options = {
    'api_key': os.environ.get('DD_WEB_API_KEY'),
    'app_key': os.environ.get('DD_WEB_APP_KEY'),
    'host_name': 'stayhome_web',
    'statsd_host': 'datadog',
    'statsd_port': 8125,
    'statsd_constant_tags': (env,),
    'statsd_namespace': 'stayhome'
}
initialize(**options)


# CORS headers
CORS_ORIGIN_WHITELIST = [
    'https://stayhome.ch',
    'https://www.stayhome.ch',
    'https://stay-home.squarespace.com'
]


# SMTP
EMAIL_HOST = 'aspmx.l.google.com'
EMAIL_PORT = 25
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
