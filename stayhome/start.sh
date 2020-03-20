#!/usr/bin/env bash

# Apply migrations
python manage.py migrate --noinput

# Create admin user
python manage.py createsuperuser --no-input

# Import data
if [ -f "datasets/post_data.csv.bz2" ]; then
    cd datasets
    bunzip2 post_data.csv.bz2
    cd ..
fi
if [ -f "datasets/post_data.csv" ]; then
    python manage.py geo_import datasets/post_data.csv --debug
fi
if [ -f "datasets/cantons.csv" ]; then
    python manage.py geo_import_cantons datasets/cantons.csv
fi
if [ -f "datasets/districts.csv" ]; then
    python manage.py geo_import_districts datasets/districts.csv
fi
if [ -f "datasets/municipalities.csv" ]; then
    python manage.py geo_import_municipalities datasets/municipalities.csv
fi

# Statics
python manage.py collectstatic --noinput

# Translations
python manage.py update_translation_fields

# Run application
gunicorn -b 0.0.0.0:8000 stayhome.wsgi