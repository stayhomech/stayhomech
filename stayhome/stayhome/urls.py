from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework import routers

from business.views import RequestViewSet
from geodata.views import NPAViewSet, MunicipalityViewSet, DistrictViewSet, CantonViewSet
from pubsite.views import HomeView, HomeLocationView, ContentView, AboutView, AddView, SetLanguageView


# API router
router = routers.DefaultRouter()
router.register(r'requests', RequestViewSet)
#router.register(r'npas', NPAViewSet)
#router.register(r'municipalities', MunicipalityViewSet)
#router.register(r'districts', DistrictViewSet)
#router.register(r'cantons', CantonViewSet)


# URLs
urlpatterns = [

    # Django admin
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),

    # API
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # Explicit lang views for search engines
    path('en/', SetLanguageView.as_view(lang_code="en")),
    path('fr/', SetLanguageView.as_view(lang_code="fr")),
    path('de/', SetLanguageView.as_view(lang_code="de")),
    path('it/', SetLanguageView.as_view(lang_code="it")),

    # Main site
    path('', HomeView.as_view(), name='home'),
    path('location/', HomeLocationView.as_view(), name='location'),
    path('about/', AboutView.as_view(), name='about'),
    path('add/', AddView.as_view(), name='add'),
    path('add/success/', TemplateView.as_view(template_name="success.html"), name='add_success'),
    path('<int:npa>/<path:name>/', ContentView.as_view(), name='content'),

]

urlpatterns += staticfiles_urlpatterns()











