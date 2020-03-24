import os
import django

from stayhome.wsgi import set_environment


# Set environment and setup Django
set_environment()
django.setup()


from django.contrib.auth.models import User, Permission
from rest_framework.authtoken.models import Token
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404

from business.models import Request


def main():

    # Get required variables from environment
    username = os.environ.get("SYNC_USER", default='sync')
    password = os.environ.get("SYNC_PASSWORD", default='sync')

    # Echo
    print('Creating API user %s and generating API token...' % username)

    # Create user if it does not exist already
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        user = User.objects.create_user(username, password=password)

    # Save user
    user.save()

    # Assign authorizations to user
    perms = ['view_request', 'add_request', 'change_request']
    for perm in perms:
        content_type = ContentType.objects.get_for_model(Request)
        permission = Permission.objects.get(
            codename=perm,
            content_type=content_type,
        )
        user.user_permissions.add(permission)

    # Create API key if it does not exist already
    try:
        token = Token.objects.get(user=user)
    except Token.DoesNotExist:
        token = Token.objects.create(user=user)

    # Key file
    key_file_path = '/api/key.txt'
    if os.environ.get("RUNNING_ENV", default='dev-nodb') == 'dev-nodb':
        key_file_path = '/tmp/api_key.txt'

    # Store key to file
    with open(key_file_path, 'w+') as key_file:
        key_file.write(token.key)

if __name__ == '__main__':
    main()
