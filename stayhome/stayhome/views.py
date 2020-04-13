from rest_framework import mixins, viewsets, serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'last_login', 'first_name', 'last_name', 'email']


class UserViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
