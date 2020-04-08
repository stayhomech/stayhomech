from progressbar import progressbar

from django.core.management.base import BaseCommand
from django.db.models import Q
from django.db import connection

from business.models import Request, Business, RequestHistoryEvent, HistoryEvent


class Command(BaseCommand):
    help = 'Remove duplicates occuring after a rekeying of the requests'

    def handle(self, *args, **options):

        # Remove all keepalives
        keepalives = RequestHistoryEvent.objects.filter(
            Q(new_status=Request.events.KEEPALIVE)
            |
            Q(event_type=HistoryEvent.KEEPALIVE)
        )
        print('Found %d keepalives to remove.' % keepalives.count())
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM business_requesthistoryevent WHERE event_type=2")
            row = cursor.fetchone()

        # Removing all updated status
        events = RequestHistoryEvent.objects.filter(new_status=Request.events.UPDATED)
        print("Found %d UPDATED events to remove" % events.count())
        for event in progressbar(events):
            request = event.parent
            if request.get_history_status(-1) != Request.events.HANDLED:
                event.delete()

        # Handling duplicate NEW requests
        requests = Request.objects.filter(status=Request.events.NEW, source=2, source_uuid__startswith='DerBund-')
        print("Found %d requests !" % requests.count())

        old_c = 0
        new_c = 0
        old_found = 0
        old_not_found = 0
        old_multi_found = 0

        old_count = {}

        for request in progressbar(requests):

            new_key = request.source_uuid
            key = new_key.split('_')

            if len(key) == 2:

                # Old entry found
                old_c += 1

            elif len(key) == 3:

                # New entry found
                new_c += 1

                # Checking if an old entry exists
                try:
                    old_key = key[0] + '_' + key[1]
                    old_request = Request.objects.get(source_uuid=old_key)

                    # Old found, but we have to check if multiple match
                    old_found += 1

                    if old_key in old_count:
                        old_count[old_key].append(new_key)
                    else:
                        old_count[old_key] = [new_key]

                except Request.DoesNotExist:

                    try:
                        old_request = Request.objects.filter(name=request.name, location=request.location, creation__range=['1999-01-01', '2020-04-07'], source=2, source_uuid__startswith='DerBund-')

                        if old_request.count() == 1:

                            old_request = old_request[0]

                            # Old found, but we have to check if multiple match
                            old_found += 1
                        
                            if old_request.source_uuid in old_count:
                                old_count[old_request.source_uuid].append(new_key)
                            else:
                                old_count[old_request.source_uuid] = [new_key]

                        elif old_request.count() > 1:

                            old_multi_found += 1

                        else:

                            # Old not found, we can consider that this is a new request
                            old_not_found += 1

                    except Request.DoesNotExist:

                        # Old not found, we can consider that this is a new request
                        old_not_found += 1

            else:
                print('Found an unexpected key groups count: %d' % len(key))
                exit()

        print('Found %d old keys and %d new keys!' % (old_c, new_c))
        print('%d new requests have a matching old request. %d do not.' % (old_found, old_not_found))
        print('%d new requests had multiple match using looser algo' % old_multi_found)

        unique_c = 0
        non_unique_c = 0
        business_c = 0

        non_uniques = {}

        for old_key, new_keys in progressbar(old_count.items()):

            if len(new_keys) > 1:

                # Non-unique, we will have to deal with them manually
                non_unique_c += 1

                non_uniques[old_key] = new_keys

            else:

                # Unique, we can replace the old one
                unique_c += 1

                new_key = new_keys[0]

                old_request = Request.objects.get(source_uuid=old_key)
                new_request = Request.objects.get(source_uuid=new_key)

                old_status = old_request.get_status()
                new_request.set_status(old_status)

                if old_status == Request.events.HANDLED:
                    businesses = Business.objects.filter(parent_request=old_request)
                    for business in businesses:
                        business.parent_request = new_request
                        business.save()
                        business_c += 1

                old_request.delete()

        print('Found %d unique match and %d multiple matches.' % (unique_c, non_unique_c))
        print('Changed reference in %d businesses.' % business_c)

        print(non_uniques)

        exit()
