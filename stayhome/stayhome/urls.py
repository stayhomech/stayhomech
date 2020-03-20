"""stayhome URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


from pubsite.views import HomeView, HomeLocationView, ContentView, AboutView, AddView


urlpatterns = [

    path('admin/', admin.site.urls),

    path('i18n/', include('django.conf.urls.i18n')),

    path('', HomeView.as_view(), name='home'),
    path('location/', HomeLocationView.as_view(), name='location'),
    path('about/', AboutView.as_view(), name='about'),
    path('add/', AddView.as_view(), name='add'),
    path('add/success/', TemplateView.as_view(template_name="success.html"), name='add_success'),
    path('<int:npa>/<str:name>/', ContentView.as_view(), name='content'),

]

urlpatterns += staticfiles_urlpatterns()