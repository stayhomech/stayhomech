import uuid

from django.db import models
from django.db.models import OuterRef, Subquery, Case, When, Exists, Value
from django.conf import settings
from django.contrib.auth.models import User
from mptt.models import MPTTModel, TreeForeignKey
from phonenumber_field.modelfields import PhoneNumberField
from django.core.cache import cache
from django_prometheus.models import ExportModelOperationsMixin


class Category(ExportModelOperationsMixin('category'), MPTTModel):

    name = models.CharField(
        max_length=255
    )

    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )

    class Meta:
        verbose_name_plural = 'categories'

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

    def get_path(self):
        if self.parent is None:
            return self.name
        else:
            return "%s / %s" % (self.parent.name, self.name)


class HistoryEvent(models.Model):

    STATUS_CHOICES = []

    UNKNOWN = 0
    STATUS = 1
    KEEPALIVE = 2

    TYPE_CHOICES = [
        (0, 'Unknown'),
        (1, 'Status update'),
        (2, 'API keepalive')
    ]

    class Meta:
        abstract = True
        indexes = [
            models.Index(
                fields=['parent', '-time']
            ),
            models.Index(
                fields=['parent', '-time', 'new_status']
            ),
            models.Index(
                fields=['parent', 'event_type', '-time']
            ),
            models.Index(
                fields=['parent', 'event_type', '-time', 'new_status']
            ),
        ]

    old_status = models.PositiveSmallIntegerField(
    )

    new_status = models.PositiveSmallIntegerField(
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True, on_delete=models.SET_NULL
    )

    time = models.DateTimeField(
        auto_now_add=True
    )

    event_type = models.PositiveIntegerField(
        choices=TYPE_CHOICES,
        default=0
    )

    event_data = models.TextField(
        blank=True,
        null=True,
        default=''
    )


class EventModel(models.Model):

    events = HistoryEvent

    class Meta:
        abstract = True

    def get_status(self):
        events = self.events.objects.filter(parent=self).order_by('-time').values('new_status')[:1]
        if events.count() == 0:
            return 0
        else:
            return events[0]['new_status']

    def get_status_text(self):
        events = self.events.objects.filter(parent=self).order_by('-time').values('new_status')[:1]
        if events.count() == 0:
            return 0
        else:
            return dict(self.events.STATUS_CHOICES)[events[0]['new_status']]

    def get_history_status(self, index):
        db_index = abs(index)
        events = self.events.objects.filter(parent=self, event_type__lt=HistoryEvent.KEEPALIVE).order_by('-time').values('new_status')
        if events.count() < db_index + 1:
            return None
        else:
            return events[db_index]['new_status']

    def set_status(self, new_status, user=None):

        # Don't update status if no change
        if new_status == self.get_status():
            return

        event = self.events(
            parent=self,
            old_status=self.get_status(),
            new_status=new_status,
            event_type=self.events.STATUS,
            user=user
        )
        event.save()

    def set_status_with_reason(self, new_status, reason, user=None):

        # Don't update status if no change
        if new_status == self.get_status():
            return

        event = self.events(
            parent=self,
            old_status=self.get_status(),
            new_status=new_status,
            event_type=self.events.STATUS,
            event_data=reason,
            user=user
        )
        event.save()

    def get_creation(self):
        events = self.events.objects.filter(parent=self).order_by('time').values('time')[:1]
        if events.count() == 0:
            return None
        else:
            return events[0]['time']

    def get_owner(self):
        events = self.events.objects.filter(parent=self).order_by('-time')[:1]
        if events.count() == 0:
            return None
        else:
            return events[0].user

    def add_event(self, event_type, event_data=None, user=None):

        # Update the user only if it is not None or the SYNC user
        current_owner = self.get_owner()
        sync_user = User.objects.get(username=settings.SYNC_USER)
        if current_owner is None or current_owner == sync_user.pk:
            new_owner = user
        else:
            new_owner = current_owner

        # Check type
        if not isinstance(new_owner, User):
            new_owner = User.objects.get(pk=new_owner)

        event = self.events(
            parent=self,
            old_status=self.get_status(),
            new_status=self.get_status(),
            event_type=event_type,
            event_data=event_data,
            user=new_owner
        )
        event.save()


class RequestHistoryEvent(ExportModelOperationsMixin('history-request'), HistoryEvent):

    VOID = 0
    NEW = 1
    RESERVED = 2
    HANDLED = 3
    UPDATED = 4
    DELETED = 5
    KEEPALIVE = 6

    STATUS_CHOICES = [
        (VOID, 'In error'),
        (NEW, 'New'),
        (RESERVED, 'In process'),
        (HANDLED, 'Handled'),
        (UPDATED, 'Updated'),
        (DELETED, 'Deleted'),
        (KEEPALIVE, 'Keepalive')
    ]

    parent = models.ForeignKey(
        'Request',
        on_delete=models.CASCADE
    )


class RequestEventManager(models.Manager):

    def get_queryset(self):

        events = RequestHistoryEvent.objects.filter(parent=OuterRef('pk')).order_by('-time')

        return super().get_queryset().annotate(
            status=Case(
                When(Exists(events), then=Subquery(events.values('new_status')[:1])),
                default=Value(0)
            ),
            creation=Case(
                When(Exists(events), then=Subquery(events.values('time')[:1])),
                default=Value(None)
            ),
            owner=Case(
                When(Exists(events), then=Subquery(events.values('user')[:1])),
                default=Value(None)
            )
        ).order_by('-creation')


class Request(ExportModelOperationsMixin('request'), EventModel):

    events = RequestHistoryEvent
    objects = RequestEventManager()

    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        primary_key=True
    )

    ttl = models.PositiveIntegerField(
        default=0
    )

    source = models.PositiveSmallIntegerField(
        choices=[
            (0, 'Manual'),
            (1, 'Web form'),
            (2, 'API')
        ],
        default=0
    )

    source_uuid = models.CharField(
        max_length=255,
        blank=False,
        unique=True
    )

    lang = models.CharField(
        max_length=2,
        default='en',
        choices=[
            ('en', 'English'),
            ('fr', 'French'),
            ('de', 'German'),
            ('it', 'Italian')
        ]
    )

    name = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=False
    )

    address = models.CharField(
        max_length=255,
        blank=True
    )

    location = models.CharField(
        max_length=255,
        blank=False
    )

    contact = models.TextField(
        blank=True
    )

    website = models.CharField(
        max_length=255,
        blank=True
    )

    phone = models.CharField(
        max_length=255,
        blank=True
    )

    email = models.CharField(
        max_length=255,
        blank=True
    )

    category = models.TextField(
        blank=False
    )

    delivery = models.TextField(
        blank=False
    )

    checksum = models.CharField(
        blank=False,
        max_length=255
    )

    def set_status(self, new_status, user=None):
        
        # Only allow updated status on handled requests
        if new_status == self.events.UPDATED and self.get_status() != self.events.HANDLED:
            return

        # Call parent
        return super().set_status(new_status, user)


class BusinessHistoryEvent(ExportModelOperationsMixin('history-business'), HistoryEvent):

    VOID = 0
    VALID = 1
    DELETED = 2

    STATUS_CHOICES = [
        (VOID, 'In error'),
        (VALID, 'Valid'),
        (DELETED, 'Deleted')
    ]

    parent = models.ForeignKey(
        'Business',
        on_delete=models.CASCADE
    )


class BusinessEventManager(models.Manager):

    def get_queryset(self):

        events = BusinessHistoryEvent.objects.filter(parent=OuterRef('pk')).order_by('-time')

        return super().get_queryset().annotate(
            status=Case(
                When(Exists(events), then=Subquery(events.values('new_status')[:1])),
                default=Value(0)
            )
        )


class Business(ExportModelOperationsMixin('business'), EventModel):

    objects = BusinessEventManager()
    events = BusinessHistoryEvent

    name = models.CharField(
        max_length=255,
    )

    location = models.ForeignKey(
        'geodata.NPA',
        on_delete=models.SET_NULL,
        null=True,
        related_name='located'
    )

    address = models.CharField(
        max_length=255,
        default=''
    )

    description = models.TextField(
        blank=True
    )

    main_category = models.ForeignKey(
        'Category',
        on_delete=models.SET_NULL,
        null=True,
        related_name='as_main_category',
        blank=False
    )

    other_categories = models.ManyToManyField(
        'Category',
        related_name='as_other_category',
        blank=True
    )

    delivers_to = models.ManyToManyField(
        'geodata.NPA',
        related_name='delivers',
        blank=True
    )

    delivers_to_canton = models.ManyToManyField(
        'geodata.Canton',
        related_name='delivers',
        blank=True
    )

    delivers_to_district = models.ManyToManyField(
        'geodata.District',
        related_name='delivers',
        blank=True
    )

    delivers_to_municipality = models.ManyToManyField(
        'geodata.Municipality',
        related_name='delivers',
        blank=True
    )

    delivers_to_ch = models.BooleanField(
        default=False,
        verbose_name='Delivers to whole Switzerland'
    )

    website = models.URLField(
        blank=True
    )

    phone = PhoneNumberField(
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    parent_request = models.ForeignKey(
        Request,
        related_name='child_businesses',
        null=True, blank=True,
        on_delete=models.SET_NULL
    )

    class Meta:
        verbose_name_plural = 'businesses'

    def __str__(self):
        return '%s (%s)' % (self.name, self.location)

    def clear_npa_cache(self):
        cache_key = str(self.location.pk) + '_businesses'
        cache.delete(cache_key)
