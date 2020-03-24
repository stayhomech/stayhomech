from rest_framework import viewsets

from .models import Request, Business
from .serializers import RequestSerializer, BusinessSerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    filter_fields = ['uuid', 'source_uuid', 'checksum']


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    filter_fields = ['id', 'location__npa', 'location__name']
