import csv

from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point

from geodata.models import NPA


class Command(BaseCommand):
    help = 'Import GIS data'

    def add_arguments(self, parser):
        parser.add_argument('source', type=str, help='File containing dataset to import')

    def handle(self, *args, **options):
        
        source = options['source']

        data = {}

        with open(source, ) as csvfile:
            reader = csv.DictReader(csvfile, delimiter=';')

            for r in reader:

                npa = r['npa']
                name = r['name']

                if npa not in data:
                    data[npa] = {}

                if name not in data[npa]:
                    data[npa][name] = {}

                data[npa][name] = {
                    'e': r['e'],
                    'n': r['n'],
                    'lang': r['lang']
                }

        for npa in NPA.objects.all():

            npa_data = None

            if npa.npa == 8238:
                print('Special case 8238 Büsingen (DE)')
                npa_data = {'lang': 'de', 'e': '8.690278', 'n': '47.696944'}

            elif npa.npa == 1992 and npa.name == 'Crête-à-l\'Oeil(Les Agettes)':
                print('Special case 1992 Crête-à-l\'Oeil(Les Agettes)')
                npa_data = data['1992']['Crête-à-l\'Oeil (Les Agettes)']

            else:
                try:
                    npa_data = data[str(npa.npa)][npa.name]
                except KeyError:
                    print('NPA not found %s' % npa)
                    if str(npa.npa) in data:
                        for name in data[str(npa.npa)]:
                            print('    Using similar NPA: %s' % name)
                            npa_data = data[str(npa.npa)][name]
                            break
                    else:
                        next_npa = npa.npa + 1
                        while True:
                            if str(next_npa) in data:
                                print('    Using next NPA: %d' % next_npa)
                                for name in data[str(next_npa)]:
                                    npa_data = data[str(next_npa)][name]
                                    break
                                break
                            next_npa += 1

            lang = npa_data['lang']
            if lang == 'de':
                lang = NPA.LANGUAGE.GERMAN
            elif lang == 'fr':
                lang = NPA.LANGUAGE.FRENCH
            elif lang == 'it':
                lang = NPA.LANGUAGE.ITALIAN
            elif lang == 'ro':
                lang = NPA.LANGUAGE.ROMANSH
            else:
                lang = NPA.LANGUAGE.UNKNOWN

            npa.lang = lang
            npa.geo_e = float(npa_data['e'])
            npa.geo_n = float(npa_data['n'])
            npa.geo_center = Point(npa.geo_e, npa.geo_n)
            npa.save()
        