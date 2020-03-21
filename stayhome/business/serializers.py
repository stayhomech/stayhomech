from rest_framework import serializers

from .models import Request


class RequestSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Request
        fields = '__all__'
