from rest_framework import viewsets

from .models import Request
from .serializers import RequestSerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    filterset_fields = ['uuid', 'source_uuid']
