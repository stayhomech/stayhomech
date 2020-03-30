from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework import routers

from business.views import RequestViewSet, BusinessViewSet, CategoryViewSet
from geodata.views import NPAViewSet, MunicipalityViewSet, DistrictViewSet, CantonViewSet
from pubsite.views import HomeView, HomeLocationView, ContentView, AboutView, AddView, SetLanguageView


# API router
router = routers.DefaultRouter()
router.register(r'requests', RequestViewSet)
router.register(r'services', BusinessViewSet)
router.register(r'categories', CategoryViewSet)


# URLs
urlpatterns = [

    # Django admin
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),

    # API
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # Main site
    path('', HomeView.as_view(), name='home'),
    path('location/', HomeLocationView.as_view(), name='location'),
    path('about/', AboutView.as_view(), name='about'),
    path('add/', AddView.as_view(), name='add'),
    path('add/success/', TemplateView.as_view(template_name="success.html"), name='add_success'),
    path('<int:npa>/<path:name>/', ContentView.as_view(), name='content'),

    # Authentication
    path('accounts/', include('django.contrib.auth.urls')),

    # Explicit lang views for search engines
    path('en/', SetLanguageView.as_view(lang_code="en")),
    path('fr/', SetLanguageView.as_view(lang_code="fr")),
    path('de/', SetLanguageView.as_view(lang_code="de")),
    path('it/', SetLanguageView.as_view(lang_code="it")),

    # Management site
    path('contribute/', include(('privsite.urls', 'privsite'), namespace='mgmt'))

]

urlpatterns += staticfiles_urlpatterns()











