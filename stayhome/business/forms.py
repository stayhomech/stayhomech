import json
import os

from django import forms
from captcha.fields import ReCaptchaField
from phonenumber_field.formfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _

from geodata.models import NPA
from business.models import Request


class AddForm(forms.Form):

    name = forms.CharField(
        label=_('Company name'),
        max_length=150,
        help_text=_('The name of the company.')
    )
    name.widget.attrs.update({'class': 'form-control form-control-sm'})

    description = forms.CharField(
        label=_('Description'),
        help_text=_('A short description of the services of the company.'),
        widget=forms.Textarea(attrs={
            'class': 'form-control form-control-sm',
            'rows': 5
        })
    )

    location = forms.ModelChoiceField(
        label=_('Main location'),
        help_text=_('Where is the company based?'),
        queryset=NPA.objects.all().order_by('npa', 'name')
    )
    location.widget.attrs.update({'class': 'form-control form-control-sm'})

    website = forms.URLField(
        label=_('Website'),
        max_length=255,
        help_text=_('Company website.'),
        required=False
    )
    website.widget.attrs.update({'class': 'form-control form-control-sm'})

    phone = PhoneNumberField(
        label=_('Phone number'),
        region='CH',
        max_length=100,
        help_text=_('Company phone number, if any.'),
        required=False
    )
    phone.widget.attrs.update({'class': 'form-control form-control-sm'})

    email = forms.EmailField(
        label=_('Email address'),
        max_length=255,
        help_text=_('Company email address, if any.'),
        required=False
    )
    email.widget.attrs.update({'class': 'form-control form-control-sm'})

    category = forms.CharField(
        label=_('Categories'),
        help_text=_('List possible categories of the service that the company provides (eg. Food, Books, Drinks, Music, Games, Mobility)'),
        max_length=255
    )
    category.widget.attrs.update({'class': 'form-control form-control-sm'})

    delivery = forms.CharField(
        label=_('Delivery perimeter'),
        help_text=_('Where is the service available ?'),
        max_length=255
    )
    delivery.widget.attrs.update({'class': 'form-control form-control-sm'})

    if os.environ.get("RUNNING_ENV", default='dev') != 'dev':
        captcha = ReCaptchaField(
            label=''
        )
    
    def save_request(self):

        request = Request(
            name=self.cleaned_data['name'],
            description=self.cleaned_data['description'],
            location=self.cleaned_data['location'],
            website=self.cleaned_data['website'],
            phone=self.cleaned_data['phone'],
            email=self.cleaned_data['email'],
            category=self.cleaned_data['category'],
            delivery=self.cleaned_data['delivery'],
            source=1,
            checksum='Web Form',
        )
        request.save()
