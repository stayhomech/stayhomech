import os
import django

from stayhome.wsgi import set_environment

# Set environment and setup Django
set_environment()
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

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
        user.save()

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
