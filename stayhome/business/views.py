from rest_framework import viewsets

from .models import Request, Business, Category
from .serializers import RequestSerializer, BusinessSerializer, CategorySerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    filter_fields = ['uuid', 'source_uuid', 'checksum']


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.filter(status=Business.events.VALID)
    serializer_class = BusinessSerializer
    filter_fields = ['id', 'location__npa']


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_fields = ['id', 'name', 'name_en', 'name_fr', 'name_de', 'name_it', 'parent']
