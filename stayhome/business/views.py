import random

from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.http import JsonResponse
from django.core.cache import cache

from .models import Request, Business, Category
from .serializers import RequestSerializer, BusinessSerializer, CategorySerializer, BusinessReactSerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    filter_fields = ['uuid', 'source_uuid', 'checksum']


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.filter(status=Business.events.VALID)
    serializer_class = BusinessSerializer
    filter_fields = ['id', 'location__npa']


class ReactBusinessContentView(View):

    def get(self, request, pk, *args, **kwargs):

        cache_key = 'business_details_' + str(pk)
        business = cache.get(cache_key)
        if business is None:
            business = get_object_or_404(Business, pk=pk)
            cache.set(cache_key, business, 3600 * (1 + random.uniform(0, 1)))

        # We have to fake the distance to reuse the serializer
        business.distance = 0.0

        return JsonResponse(BusinessReactSerializer(business).data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_fields = ['id']
