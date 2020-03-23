from django.urls import path, include
from django.contrib.auth import views as auth_views

from .views import RequestsListView, RequestsProcessView, RequestsProcessNextView, RequestsProcessDropView


# URLs
urlpatterns = [

    # Main page
    path('', RequestsListView.as_view(), name='index'),

    # Requests processing
    path('convert/<uuid:pk>/', RequestsProcessView.as_view(), name='convert'),
    path('convert/<uuid:pk>/drop/', RequestsProcessDropView.as_view(), name='drop'),
    path('convert/next/', RequestsProcessNextView.as_view(), name='next'),

    # Registration
    path('logout/', auth_views.LogoutView.as_view(template_name="registration/logout.html"), name='logout'),

]
