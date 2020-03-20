import csv

from django.core.management.base import BaseCommand

from geodata.models import Canton


class Command(BaseCommand):
    help = 'Import cantons data'

    def add_arguments(self, parser):
        parser.add_argument('source', type=str, help='File containing dataset to import')

    def handle(self, *args, **options):
        
        source = options['source']

        with open(source, ) as csvfile:
            reader = csv.DictReader(csvfile, delimiter=';')
            for r in reader:
                try:
                    canton = Canton.objects.get(ofs_id=r['ofs_id'])
                except Canton.DoesNotExist:
                    canton = Canton(**r)
                    canton.save()
                    print('Added ' + str(canton))
