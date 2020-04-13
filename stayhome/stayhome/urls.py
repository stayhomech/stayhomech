from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.i18n import i18n_patterns

from rest_framework import routers
from rest_framework.authtoken import views

from business.views import RequestViewSet, BusinessViewSet, CategoryViewSet, ReactBusinessContentView
from pubsite.views import HomeView, HomeLocationView, ContentView, AboutView, AddView, SetLanguageView, EmbededView, ReactContentView
from geodata.views import NPAViewSet, MunicipalityViewSet, DistrictViewSet, CantonViewSet
from .views import UserViewSet, ApiCustomAuth


# API router
router = routers.DefaultRouter()
router.register(r'requests', RequestViewSet)
router.register(r'services', BusinessViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'npas', NPAViewSet)
router.register(r'municipalities', MunicipalityViewSet)
router.register(r'districts', DistrictViewSet)
router.register(r'cantons', CantonViewSet)
router.register(r'user', UserViewSet)


# URLs
urlpatterns = [

    # Django admin
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),

    # API
    path('api/', include(router.urls)),
    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    #path('api-token-auth/', csrf_exempt(views.obtain_auth_token)),
    path('api-token-auth/', ApiCustomAuth.as_view()),

    # Main site
    path('location/', HomeLocationView.as_view(), name='location'),

    # React content
    path('content/<str:lang>/<int:npa>/<path:name>/', ReactContentView.as_view(), name='react_content'),
    path('business/<str:lang>/<int:pk>/', ReactBusinessContentView.as_view(), name='react_business'),

    # Authentication
    #path('accounts/', include('django.contrib.auth.urls')),

    # Management site
    path('contribute/', include(('privsite.urls', 'privsite'), namespace='mgmt')),

]

# Localized URLs
urlpatterns += i18n_patterns(
    path('', HomeView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('add/', AddView.as_view(), name='add'),
    path('add/success/', TemplateView.as_view(template_name="success.html"), name='add_success'),
    path('<int:npa>/<path:name>/', ContentView.as_view(), name='content'),
)

# Static URLs
urlpatterns += staticfiles_urlpatterns()











