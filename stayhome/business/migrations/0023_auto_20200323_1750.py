# Generated by Django 3.0.4 on 2020-03-23 16:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0022_auto_20200323_1636'),
    ]

    operations = [
        migrations.AddField(
            model_name='business',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='business',
            name='parent_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='child_businesses', to='business.Request'),
        ),
    ]