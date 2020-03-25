import uuid

from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from phonenumber_field.modelfields import PhoneNumberField


class Category(MPTTModel):

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

    def __str__(self):
        return self.name

    def get_path(self):
        if self.parent is None:
            return self.name
        else:
            return "%s / %s" % (self.parent.name, self.name)


class Request(models.Model):

    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        primary_key = True
    )

    handled = models.BooleanField(
        default=False
    )

    deleted = models.BooleanField(
        default=False
    )

    creation = models.DateTimeField(
        auto_now_add=True
    )

    update = models.DateTimeField(
        auto_now=True
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
        blank=True
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

    contact = models.CharField(
        max_length=255,
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

class Business(models.Model):

    name = models.CharField(
        max_length=255
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
        related_name='as_main_category'
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
        'business.Request',
        related_name='child_businesses',
        null=True, blank=True,
        on_delete=models.CASCADE
    )

    deleted = models.BooleanField(
        default=False
    )

    class Meta:
        verbose_name_plural = 'businesses'

    def __str__(self):
        return '%s (%s)' % (self.name, self.location)
