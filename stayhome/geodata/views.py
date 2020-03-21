from rest_framework import viewsets
from rest_framework import permissions

from .models import NPA, Municipality, District, Canton
from .serializers import NPASerializer, MunicipalitySerializer, DistrictSerializer, CantonSerializer


class NPAViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NPA.objects.all()
    serializer_class = NPASerializer
    permission_classes = [permissions.IsAuthenticated]

class MunicipalityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Municipality.objects.all()
    serializer_class = MunicipalitySerializer
    permission_classes = [permissions.IsAuthenticated]

class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.IsAuthenticated]

class CantonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Canton.objects.all()
    serializer_class = CantonSerializer
    permission_classes = [permissions.IsAuthenticated]
