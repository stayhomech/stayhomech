from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from .models import NPA, Municipality, District, Canton
from .serializers import NPASerializer, MunicipalitySerializer, DistrictSerializer, CantonSerializer


class NPAViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = NPA.objects.all()
    serializer_class = NPASerializer
    filterset_fields = ['id', 'name', 'npa']

    @action(detail=False, methods=['get'])
    def search(self, request):

        s = request.query_params['search']

        try:

            # Search NPA number
            npas = NPA.objects.filter(npa__startswith=int(s)).order_by('npa')

        except ValueError:

            # Search city name
            npas = NPA.objects.rewrite(False).filter(name__icontains=s).order_by('name')

        return Response(NPASerializer(npas, many=True).data)

    @action(detail=False, methods=['get'])
    def search_all(self, request):

        s = request.query_params['search']

        try:

            # Search NPA number
            npas = NPA.objects.rewrite(False).filter(npa__startswith=int(s)).order_by('npa')

        except ValueError:

            # Search city name
            npas = NPA.objects.rewrite(False).rewrite(False).filter(name__icontains=s).order_by('name')

        ms = Municipality.objects.rewrite(False).filter(name__icontains=s).order_by('name')
        ds = District.objects.rewrite(False).filter(name__icontains=s).order_by('name')
        cs = Canton.objects.rewrite(False).filter(name__icontains=s).order_by('name')

        return Response({
            'ns': NPASerializer(npas, many=True).data,
            'ms': MunicipalitySerializer(ms, many=True).data,
            'ds': DistrictSerializer(ds, many=True).data,
            'cs': CantonSerializer(cs, many=True).data,
        })

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
