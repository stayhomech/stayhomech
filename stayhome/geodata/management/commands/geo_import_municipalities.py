import csv

from django.core.management.base import BaseCommand

from geodata.models import District, Municipality


class Command(BaseCommand):
    help = 'Import municipality data'

    def add_arguments(self, parser):
        parser.add_argument('source', type=str, help='File containing dataset to import')

    def handle(self, *args, **options):
        
        source = options['source']

        with open(source, ) as csvfile:
            reader = csv.DictReader(csvfile, delimiter=';')
            for r in reader:

                district = District.objects.get(ofs_id=r['district'])
                municipality = Municipality.objects.get(ofs_id=r['municipality'])

                municipality.district_id = district
                municipality.save()

                print("Municipality %s is now part of %s district" % (municipality, district))
