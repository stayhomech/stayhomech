from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


from pubsite.views import HomeView, HomeLocationView, ContentView, AboutView, AddView, SetLanguageView


urlpatterns = [

    path('admin/', admin.site.urls),

    path('i18n/', include('django.conf.urls.i18n')),

    # Explicit lang views for search engines
    path('en/', SetLanguageView.as_view(lang_code="en")),
    path('fr/', SetLanguageView.as_view(lang_code="fr")),
    path('de/', SetLanguageView.as_view(lang_code="de")),
    path('it/', SetLanguageView.as_view(lang_code="it")),

    path('', HomeView.as_view(), name='home'),
    path('location/', HomeLocationView.as_view(), name='location'),
    path('about/', AboutView.as_view(), name='about'),
    path('add/', AddView.as_view(), name='add'),
    path('add/success/', TemplateView.as_view(template_name="success.html"), name='add_success'),
    path('<int:npa>/<str:name>/', ContentView.as_view(), name='content'),

]

urlpatterns += staticfiles_urlpatterns()
