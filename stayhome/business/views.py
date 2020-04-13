import random

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django_filters import rest_framework as filters
from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.http import JsonResponse
from django.core.cache import cache
from django.db.models import Q

from geodata.models import NPA, Municipality, District, Canton
from .models import Request, Business, Category
from .serializers import RequestSerializer, BusinessSerializer, CategorySerializer, BusinessReactSerializer
from .forms import BusinessConvertForm


class RequestFilterSet(filters.FilterSet):

    status = filters.ChoiceFilter(choices=Request.events.STATUS_CHOICES)
    source_uuid__startswith = filters.CharFilter(field_name='source_uuid', lookup_expr='startswith')
    
    class Meta:
        model = Request
        fields = ['uuid', 'source_uuid', 'checksum', 'lang', 'status', 'source']


class RequestViewSet(viewsets.ModelViewSet):

    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    filterset_class = RequestFilterSet 

    @action(detail=False, methods=['get'])
    def stats(self, request):
        return Response({
            'total': Request.objects.count(),
            'new': Request.objects.filter(status=Request.events.NEW).count(),
            'updated': Request.objects.filter(status=Request.events.UPDATED).count(),
            'drafts': Request.objects.filter(status=Request.events.RESERVED, owner=request.user.id).count(),
        })

    @action(detail=True, methods=['post'])
    def set_status(self, request, pk=None):

        r = get_object_or_404(Request, pk=pk)

        old_status = r.get_status()
        new_status = request.data['status']
        reason = request.data['reason']

        r.set_status_with_reason(new_status, reason, request.user)

        return Response({
            'old': old_status,
            'new': new_status
        })

    @action(detail=True, methods=['get'])
    def find_similar(self, request, pk=None):

        request = get_object_or_404(Request, pk=pk)
        
        businesses = Business.objects.filter(
            Q(name=request.name)
        )

        requests = Request.objects.filter(
            Q(name=request.name)
        ).exclude(pk=request.pk)

        return Response({
            'requests': RequestSerializer(requests, many=True).data,
            'businesses': BusinessSerializer(businesses, many=True).data
        })


class BusinessFilterSet(filters.FilterSet):

    status = filters.ChoiceFilter(choices=Business.events.STATUS_CHOICES)
    
    class Meta:
        model = Business
        fields = ['id', 'status', 'location__npa']


class BusinessViewSet(viewsets.ModelViewSet):

    queryset = Business.objects.filter(status=Business.events.VALID)
    serializer_class = BusinessSerializer
    filterset_class = BusinessFilterSet

    @action(detail=False, methods=['post'])
    def convert(self, request):

        try:

            data = request.data

            data['delivers_to'] = []
            data['delivers_to_municipality'] = []
            data['delivers_to_district'] = []
            data['delivers_to_canton'] = []

            for delivery in request.data['deliversTo']:
                if delivery['type'] == 'n':
                    data['delivers_to'].append(delivery['id'])
                if delivery['type'] == 'm':
                    data['delivers_to_municipality'].append(delivery['id'])
                if delivery['type'] == 'd':
                    data['delivers_to_district'].append(delivery['id'])
                if delivery['type'] == 'c':
                    data['delivers_to_canton'].append(delivery['id'])           

            b = BusinessConvertForm(data)

            if b.is_valid():
                business = b.save()
                business.parent_request.set_status(Request.events.HANDLED, user=request.user)
                business.set_status(Business.events.VALID, user=request.user)
                return Response({
                    'success': True,
                    'result': BusinessSerializer(business).data
                })
            else:
                return Response({
                    'success': False,
                    'result': b.errors,
                    'values': data
                })
        
        except Exception as e:
            return Response({
                'success': False,
                'result': str(e)
            })


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


class CategoryFilterSet(filters.FilterSet):

    name__icontains = filters.CharFilter(field_name='name', lookup_expr='icontains')
    
    class Meta:
        model = Category
        fields = ['id', 'name']


class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filterset_class = CategoryFilterSet
