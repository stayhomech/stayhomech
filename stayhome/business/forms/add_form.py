import json
import os

from django import forms
from captcha.fields import ReCaptchaField
from phonenumber_field.formfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.utils.translation import get_language

from geodata.models import NPA
from business.models import Request


class BusinessAddForm(forms.Form):

    name = forms.CharField(
        label=_('Company name'),
        max_length=255,
        help_text=_('The name of the company.'),
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    description = forms.CharField(
        label=_('Description'),
        help_text=_('A short description of the services of the company.'),
        widget=forms.Textarea(attrs={
            'class': 'form-control form-control-sm',
            'rows': 5
        })
    )

    address = forms.CharField(
        label=_('Street and number'),
        max_length=255,
        help_text=_('The street and street number of your address'),
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    location = forms.ModelChoiceField(
        label=_('City'),
        help_text=_('Where is the company based?'),
        queryset=NPA.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    category = forms.CharField(
        label=_('Categories'),
        max_length=255,
        help_text=_('List possible categories of the service that the company provides (eg. Food, Books, Drinks, Music, Games, Mobility)'),
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    delivery = forms.CharField(
        label=_('Delivery locations'),
        max_length=255,
        help_text=_('Where are you delivering ? Whole Switzerland, cantons, districts, municipalities, be as precise as possible.'),
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    website = forms.CharField(
        label=_('Website'),
        max_length=255,
        help_text=_('Company website, if any.'),
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    phone = forms.CharField(
        label=_('Phone number'),
        max_length=100,
        help_text=_('Company phone number, if any.'),
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    email = forms.CharField(
        label=_('Email address'),
        max_length=255,
        help_text=_('Company email address, if any.'),
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    if os.environ.get("RUNNING_ENV", default='dev') != 'dev':
        captcha = ReCaptchaField(
            label=''
        )
    
    def get_location_choices(self):
        return [
            (0, 'Test')
        ]

    def save_request(self):

        location = str(self.cleaned_data['location']) + ' [PK:' + str(self.cleaned_data['location'].pk) + ']'

        # Create request
        r = Request(
            name=self.cleaned_data['name'],
            description=self.cleaned_data['description'],
            address=self.cleaned_data['address'],
            location=location,
            website=self.cleaned_data['website'],
            phone=self.cleaned_data['phone'],
            email=self.cleaned_data['email'],
            category=self.cleaned_data['category'],
            delivery=self.cleaned_data['delivery'],
            source=1,
            checksum='Web Form',
            lang=get_language()
        )
        r.save()

        # Set status
        r.set_status(r.events.NEW)
