# Generated by Django 3.0.4 on 2020-03-24 09:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0023_auto_20200323_1750'),
    ]

    operations = [
        migrations.AddField(
            model_name='business',
            name='delivers_to_ch',
            field=models.BooleanField(default=False),
        ),
    ]
