from django.core.management.base import BaseCommand

from geodata.models import DatasetModel, Municipality, NPA


class Command(BaseCommand):
    help = 'Import geo data'

    force_import = False
    debug = False

    def add_arguments(self, parser):
        parser.add_argument('source', type=str, help='File containing dataset to import')
        parser.add_argument('--force', action='store_true', help='Force import')
        parser.add_argument('--debug', action='store_true', help='Debug output')

    def handle(self, *args, **options):
        
        source = options['source']
        self.force_import = options['force']
        self.debug = options['debug']

        with open(source, encoding='latin-1') as infile:
            for line in infile:

                # Split line
                line = line.strip().split(';')

                # Line type
                l_type = int(line[0])

                # Dataset
                if l_type == 0:
                    self.handle_hea(line)

                # NPA
                elif l_type == 1:
                    self.handle_plz(line)

                # Municipality
                elif l_type == 3:
                    self.handle_com(line)

    # Type 0 - Dataset
    def handle_hea(self, line):
        
        # Current existing data source if any
        ds = None
        if DatasetModel.objects.count() > 0:
            ds = DatasetModel.objects.all()[:1].get()
            if self.debug:
                print('Existing dataset with version %d.' % ds.version)
        else:
            if self.debug:
                print('No existing dataset.')

        # Check if newer
        new_version = int(line[1])
        if ds is None or (ds.version < new_version or self.force_import):

            if self.debug:
                print('Importing new dataset with version %d...' % new_version)
            
            if ds is None:
                ds = DatasetModel.objects.create_ds(new_version)
            else:
                ds.version = new_version
            
            ds.save()
        else:
            
            if self.debug:
                print('Not importing as current dataset is newer or identical. Use --force to import anyway.')
    
            exit(1)

    # Type 1 - NPA
    def handle_plz(self, line):
        
        # ONRP ID is key
        onrp_id = int(line[1])

        # Filter types
        npa_type = int(line[3])
        if npa_type not in [10, 20]:
            return

        # Get NPA if existing or create
        try:
            npa = NPA.objects.get(onrp_id=onrp_id)
        except NPA.DoesNotExist:
            npa = NPA(onrp_id=onrp_id)
        
        # Get municipality
        try:
            m = Municipality.objects.get(ofs_id=int(line[2]))
        except Municipality.DoesNotExist:
            print('Municipality not found.')
            return
        npa.municipality = m

        # Updating object
        npa.npa = int(line[4])
        npa.name = str(line[8])
        npa.save()

        # Print
        if self.debug:
            print("Added or updated %d %s in database." % (npa.npa, npa.name))

    # Type 3 - Municipality
    def handle_com(self, line):

        # OFS ID is key
        ofs_id = int(line[1])

        # Get municipality
        m, created = Municipality.objects.get_or_create(
            ofs_id=ofs_id
        )

        # Updating object
        m.name = str(line[2])
        m.canton = str(line[3])
        aglo_id = line[4]
        if line[4] == '':
            m.aglo_id = None
        else:
            m.aglo_id = int(aglo_id)
        m.save()

        # Print
        if self.debug:
            if created:
                print("Added %s (%s) in database." % (m.name, m.canton))
            else:
                print("Updated %s (%s) in database." % (m.name, m.canton))
