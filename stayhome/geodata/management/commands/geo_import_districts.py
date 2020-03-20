import csv

from django.core.management.base import BaseCommand

from geodata.models import District, Canton


class Command(BaseCommand):
    help = 'Import district data'

    def add_arguments(self, parser):
        parser.add_argument('source', type=str, help='File containing dataset to import')

    def handle(self, *args, **options):
        
        source = options['source']

        with open(source, ) as csvfile:
            reader = csv.DictReader(csvfile, delimiter=';')
            for r in reader:

                r['canton'] = Canton.objects.get(ofs_id=r['canton'])

                try:
                    district = District.objects.get(ofs_id=r['ofs_id'])
                except District.DoesNotExist:
                    district = District(**r)
                    district.save()
                    print('Added ' + str(district))
