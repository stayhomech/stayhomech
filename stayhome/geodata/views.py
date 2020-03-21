from rest_framework import viewsets

from .models import NPA, Municipality, District, Canton
from .serializers import NPASerializer, MunicipalitySerializer, DistrictSerializer, CantonSerializer


class NPAViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NPA.objects.all()
    serializer_class = NPASerializer
    filterset_fields = ['id', 'name', 'npa']

class MunicipalityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Municipality.objects.all()
    serializer_class = MunicipalitySerializer
    filterset_fields = ['id', 'name']

class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    filterset_fields = ['id', 'name']

class CantonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Canton.objects.all()
    serializer_class = CantonSerializer
    filterset_fields = ['id', 'name', 'code']
