from django.urls import include, path
from rest_framework import routers

from business.views import RequestViewSet
from geodata.views import NPAViewSet, MunicipalityViewSet, DistrictViewSet, CantonViewSet


router = routers.DefaultRouter()
router.register(r'requests', RequestViewSet)
#router.register(r'npas', NPAViewSet)
#router.register(r'municipalities', MunicipalityViewSet)
#router.register(r'districts', DistrictViewSet)
#router.register(r'cantons', CantonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
