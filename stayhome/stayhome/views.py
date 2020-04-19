import json

from django.contrib.auth.models import User
from django.views.generic import View
from django.views.decorators.http import require_POST
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse

from rest_framework.authtoken.models import Token
from rest_framework import mixins, viewsets, serializers


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


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(require_POST, name='dispatch')
class ApiCustomAuth(View):

    def post(self, request, *args, **kwargs):

        try:
            data = json.loads(request.body)
            username = data['username']
            password = data['password']
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise PermissionDenied()

        if not user.check_password(password):
            raise PermissionDenied()

        token, created = Token.objects.get_or_create(user=user)

        return JsonResponse({
            'token': token.key
        })


class CheckView(View):

    def get(self, request, *args, **kwargs):
        return JsonResponse({
            'status': 'OK'
        })
