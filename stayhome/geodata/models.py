from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point


class DatasetModelManager(models.Manager):
    def create_ds(self, version):
        ds = self.create(version=version)
        return ds


class DatasetModel(models.Model):
    version = models.PositiveIntegerField()
    objects = DatasetModelManager()


class Canton(models.Model):

    ofs_id = models.PositiveIntegerField(
        unique=True
    )
    
    name = models.CharField(
        max_length=100
    )

    code = models.CharField(
        max_length=2
    )

    def __str__(self):
        return '%s (%s)' % (self.name, self.code)


class District(models.Model):

    ofs_id = models.PositiveIntegerField(
        unique=True
    )
    
    name = models.CharField(
        max_length=100
    )

    canton = models.ForeignKey(
        'Canton',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return '%s, %s' % (self.name, self.canton)


class Municipality(models.Model):
    ofs_id = models.PositiveIntegerField(
        unique=True
    )
    name = models.CharField(
        max_length=30
    )
    canton = models.CharField(
        max_length=2
    )
    aglo_id = models.PositiveIntegerField(
        null=True
    )

    district_id = models.ForeignKey(
        'District',
        on_delete=models.SET_NULL,
        null=True
    )

    class Meta:
        verbose_name_plural = 'municipalities'

    def __str__(self):
        return self.name


class NPA(gis_models.Model):

    class LANGUAGE:
        UNKNOWN = 0
        GERMAN = 1
        FRENCH = 2
        ITALIAN = 3
        ROMANSH = 4

    LANGUAGE_CHOICES = [
        (LANGUAGE.UNKNOWN, 'Unknown'),
        (LANGUAGE.GERMAN, 'German'),
        (LANGUAGE.FRENCH, 'French'),
        (LANGUAGE.ITALIAN, 'Italian'),
        (LANGUAGE.ROMANSH, 'Romansh')
    ]

    onrp_id = models.PositiveIntegerField(
        unique=True
    )

    municipality = models.ForeignKey(
        'Municipality',
        on_delete=models.CASCADE
    )

    npa = models.PositiveIntegerField()

    name = models.CharField(
        max_length=27
    )

    lang = models.PositiveSmallIntegerField(
        choices=LANGUAGE_CHOICES,
        default=0
    )

    geo_e = gis_models.FloatField(
        null=True
    )

    geo_n = gis_models.FloatField(
        null=True
    )

    geo_center = gis_models.PointField()

    class Meta:
        verbose_name = 'NPA'
        verbose_name_plural = 'NPAs'

    def __str__(self):
        return '%d %s' % (self.npa, self.name)
