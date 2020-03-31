from django.urls import re_path, path, include
from django.contrib.auth import views as auth_views

from .views import RequestsListView, RequestsProcessView, RequestsProcessNextView, RequestsProcessDropView, RequestsUserListView, CategoriesTransListView, AjaxLookupView


# URLs
urlpatterns = [

    # Main page
    path('',                        RequestsListView.as_view(), name='index'),
    path('convert/<uuid:pk>/',      RequestsProcessView.as_view(), name='convert'),
    path('convert/<uuid:pk>/drop/', RequestsProcessDropView.as_view(), name='drop'),
    path('convert/next/',           RequestsProcessNextView.as_view(), name='next'),

    # Reserved requests
    path('reserved/',                        RequestsUserListView.as_view(prefix='reserved.'),    name='reserved.index'),
    path('reserved/convert/<uuid:pk>/',      RequestsProcessView.as_view(prefix='reserved.'),     name='reserved.convert'),
    path('reserved/convert/<uuid:pk>/drop/', RequestsProcessDropView.as_view(prefix='reserved.'), name='reserved.drop'),
    path('reserved/convert/next/',           RequestsProcessNextView.as_view(prefix='reserved.'), name='reserved.next'),

    # Categories translations
    path('categories/', CategoriesTransListView.as_view(), name='categories.list'),

    # Registration
    path('logout/', auth_views.LogoutView.as_view(template_name="registration/logout.html"), name='logout'),

    # Ajax lookup for forms
    path('lookup/<str:model>/', AjaxLookupView.as_view(), name='lookup'),

]
