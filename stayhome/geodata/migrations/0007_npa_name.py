# Generated by Django 3.0.4 on 2020-03-15 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geodata', '0006_npa_npa'),
    ]

    operations = [
        migrations.AddField(
            model_name='npa',
            name='name',
            field=models.CharField(default='', max_length=27),
            preserve_default=False,
        ),
    ]
