import json

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
        help_text=_('The name of your company as shown on the website.')
    )
    name.widget.attrs.update({'class':('form-control form-control-sm')})

    description = forms.CharField(
        label=_('Description'),
        max_length=255,
        help_text=_('A short description of the activities of your company.')
    )
    description.widget.attrs.update({'class':('form-control form-control-sm')})

    location = forms.ModelChoiceField(
        label=_('Main location'),
        help_text=_('Where is based your company?'),
        queryset=NPA.objects.all().order_by('npa', 'name')
    )
    location.widget.attrs.update({'class':('form-control form-control-sm')})

    website = forms.URLField(
        label=_('Website'),
        max_length=255,
        help_text=_('Company website.')
    )
    website.widget.attrs.update({'class':('form-control form-control-sm')})

    phone = PhoneNumberField(
        label=_('Phone number'),
        region='CH',
        max_length=100,
        help_text=_('Company phone number, if any.'),
        required=False
    )
    phone.widget.attrs.update({'class':('form-control form-control-sm')})

    email = forms.EmailField(
        label=_('Email address'),
        max_length=255,
        help_text=_('Company email address, if any.'),
        required=False
    )
    email.widget.attrs.update({'class':('form-control form-control-sm')})

    category = forms.CharField(
        label=_('Service description'),
        max_length=255,
        help_text=_('What kind of delivery service are you providing ? For example for food, what kind of food ?')
    )
    category.widget.attrs.update({'class':('form-control form-control-sm')})

    delivery = forms.CharField(
        label=_('Delivery perimeter'),
        max_length=255,
        help_text=_('Where are you delivering ?')
    )
    delivery.widget.attrs.update({'class':('form-control form-control-sm')})

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
            delivery=self.cleaned_data['delivery']
        )
        request.save()
