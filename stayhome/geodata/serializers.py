from rest_framework import serializers

from .models import NPA, Municipality, District, Canton


class NPASerializer(serializers.ModelSerializer):

    class Meta:
        model = NPA
        fields = ['id', 'npa', 'name', 'lang', 'geo_e', 'geo_n']

class MunicipalitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Municipality
        fields = ['id', 'name']

class DistrictSerializer(serializers.ModelSerializer):

    class Meta:
        model = District
        fields = ['id', 'name']

class CantonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Canton
        fields = ['id', 'code', 'name']
