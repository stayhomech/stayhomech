from rest_framework import serializers

from .models import Request, Business, Category


class RequestSerializer(serializers.ModelSerializer):

    uuid = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField()

    source = serializers.HiddenField(
        default=2
    )

    class Meta:
        model = Request
        fields = ['uuid', 'ttl', 'source', 'source_uuid', 'lang', 'name', 'description', 'address',
        'location', 'contact', 'website', 'phone', 'email', 'category', 'delivery', 'checksum', 'status']


class BusinessSerializer(serializers.ModelSerializer):

    location_npa = serializers.IntegerField(source="location.npa", read_only=True)
    location_name = serializers.CharField(source="location.name", read_only=True)
    location_address = serializers.CharField(source="address", read_only=True)

    class Meta:
        model = Business
        fields = ['id', 'location_npa', 'location_name', 'location_address', 'name', 'description', 'main_category', 
        'other_categories', 'website', 'phone', 'email']


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'name_en', 'name_fr', 'name_de', 'name_it', 'parent']
