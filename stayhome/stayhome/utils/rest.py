from rest_framework import permissions
from rest_framework.permissions import DjangoModelPermissions
from rest_framework_api_key.permissions import HasAPIKey


# I had to create this in order to allow both Django-based permissions and Key-based permissions to work side-by-side.
# If any of the permission is True, then return True
# The default behavior of DRF is that all permissions must be True
class StayHomeAccessPermission(permissions.BasePermission):

    def has_permission(self, request, view):

        dmp = DjangoModelPermissions()
        kbp = HasAPIKey()

        return dmp.has_permission(request, view) or kbp.has_permission(request, view)
