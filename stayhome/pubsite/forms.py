import os

from django import forms
from django.utils.translation import gettext_lazy as _
from captcha.fields import ReCaptchaField


class ContactForm(forms.Form):

    name = forms.CharField(
        label=_('Name'),
        max_length=255,
        help_text=_('Your name.'),
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    email = forms.CharField(
        label=_('Email address'),
        max_length=255,
        help_text=_('Your e-mail address.'),
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-sm'
        })
    )

    message = forms.CharField(
        label=_('Your message'),
        help_text=_('The message you want to send us.'),
        widget=forms.Textarea(attrs={
            'class': 'form-control form-control-sm',
            'rows': 5
        })
    )

    if os.environ.get("RUNNING_ENV", default='dev') != 'dev':
        captcha = ReCaptchaField(
            label=''
        )
