from rest_framework import serializers

from .models import Request, Business, Category, HistoryEvent
from geodata.serializers import NPASerializer, MunicipalitySerializer, DistrictSerializer, CantonSerializer
from geodata.models import NPA, Municipality, District, Canton


class RequestSerializer(serializers.ModelSerializer):

    uuid = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField()
    owner = serializers.ReadOnlyField()

    source = serializers.HiddenField(
        default=2
    )

    class Meta:
        model = Request
        fields = ['uuid', 'ttl', 'source', 'source_uuid', 'lang', 'name', 'description', 'address',
        'location', 'contact', 'website', 'phone', 'email', 'category', 'delivery', 'checksum', 'status', 'owner']

    def create(self, validated_data):

        req = Request.objects.create(**validated_data)
        req.set_status(Request.events.NEW, user=self.context['request'].user)
        return req

    def update(self, instance, validated_data):
        
        if instance.checksum == validated_data['checksum']:

            # Keepalive
            instance.add_event(HistoryEvent.KEEPALIVE, user=self.context['request'].user)

        else:

            # Update
            instance.set_status(Request.events.UPDATED, user=self.context['request'].user)

        return super(RequestSerializer, self).update(instance, validated_data)


class BusinessSerializer(serializers.ModelSerializer):

    location_npa = serializers.IntegerField(source="location.npa", read_only=True)
    location_name = serializers.CharField(source="location.name", read_only=True)
    location_address = serializers.CharField(source="address", read_only=True)

    class Meta:
        model = Business
        fields = ['id', 'location_npa', 'location_name', 'location_address', 'name', 'description', 'main_category', 
        'other_categories', 'website', 'phone', 'email']


class DistanceField(serializers.Field):

    def to_representation(self, value):
        ret = {
            'angle': value.distance,
            'km': value.distance * 111.139
        }
        return ret


class BusinessReactSerializer(serializers.ModelSerializer):

    location_npa = serializers.IntegerField(source="location.npa", read_only=True)
    location_name = serializers.CharField(source="location.name", read_only=True)
    distance = DistanceField(source='*')

    delivers_to = serializers.SerializerMethodField()
    delivers_to_municipality = serializers.SerializerMethodField()
    delivers_to_district = serializers.SerializerMethodField()
    delivers_to_canton = serializers.SerializerMethodField()

    def get_delivers_to(self, obj):
        return NPASerializer(obj.delivers_to, many=True).data

    def get_delivers_to_municipality(self, obj):
        return MunicipalitySerializer(obj.delivers_to_municipality, many=True).data

    def get_delivers_to_district(self, obj):
        return DistrictSerializer(obj.delivers_to_district, many=True).data

    def get_delivers_to_canton(self, obj):
        return CantonSerializer(obj.delivers_to_canton, many=True).data
    
    class Meta:
        model = Business
        fields = '__all__'


class BusinessReactLazySerializer(serializers.ModelSerializer):

    location_npa = serializers.IntegerField(source="location.npa", read_only=True)
    location_name = serializers.CharField(source="location.name", read_only=True)
    distance = DistanceField(source='*')
    description = serializers.SerializerMethodField()

    def get_description(self, obj):
        if len(obj.description) > 300:
            return obj.description[:300] + "..."
        else:
            return obj.description

    class Meta:
        model = Business
        fields = ['id', 'name', 'description', 'main_category', 'other_categories', 'location_npa', 'location_name', 'distance', 'website', 'phone']


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'name_en', 'name_fr', 'name_de', 'name_it', 'parent']


class CategoryReactSerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent']
