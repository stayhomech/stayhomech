from rest_framework import serializers

from .models import NPA, Municipality, District, Canton


class NPASerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = NPA
        fields = '__all__'

class MunicipalitySerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Municipality
        fields = '__all__'

class DistrictSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = District
        fields = '__all__'

class CantonSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Canton
        fields = '__all__'
