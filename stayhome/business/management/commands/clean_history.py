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
