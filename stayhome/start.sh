#!/usr/bin/env bash

# Apply migrations
python manage.py migrate --noinput

# Create admin user
python manage.py createsuperuser --no-input

# Import data, only with new repo
# Do it manually in container later if necessary
# This is to avoid a very long startup delay
if [ ! -f "datasets/.imported" ]; then

    # Uncompress Swiss Post dataset
    cd datasets
    bunzip2 -f post_data.csv.bz2
    cd ..

    # Import Swiss Post dataset - Creates municipalities and postal codes (NPA)
    python manage.py geo_import datasets/post_data.csv --debug

    # Import list of Swiss cantons
    python manage.py geo_import_cantons datasets/cantons.csv

    # Import list of Swiss districts
    python manage.py geo_import_districts datasets/districts.csv

    # Attach municipalities to districts
    python manage.py geo_import_municipalities datasets/municipalities.csv

    # Not importing anymore
    echo "" > datasets/.imported

fi

# Compile language files
python manage.py compilemessages

# Statics
python manage.py collectstatic --noinput
python manage.py compress --force
python manage.py collectstatic --noinput

# Translations
python manage.py update_translation_fields

# Generate API key for sync-service
python create_api_key.py

# Workers
if [ "$RUNNING_ENV" == "prod" ]; then
    workers="17"
else
    workers="2"
fi

# Run application
ddtrace-run gunicorn -b 0.0.0.0:8000 --workers=$workers --name="stayhome-$RUNNING_ENV" --statsd-host="datadog:8125" stayhome.wsgi
