from rest_framework import viewsets
from rest_framework import permissions

from .models import Request
from .serializers import RequestSerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]
