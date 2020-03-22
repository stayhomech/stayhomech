from rest_framework import serializers

from .models import Request


class RequestSerializer(serializers.ModelSerializer):

    uuid = serializers.ReadOnlyField()
    handled = serializers.ReadOnlyField()
    deleted = serializers.ReadOnlyField()
    creation = serializers.ReadOnlyField()
    update = serializers.ReadOnlyField()

    source = serializers.HiddenField(
        default=2
    )

    class Meta:
        model = Request
        fields = ['uuid', 'handled', 'deleted', 'creation', 'update', 'ttl', 'source', 
        'source_uuid', 'name', 'description', 'location', 'website', 'phone', 'email', 
        'category', 'delivery', 'contact']
