from django import forms
from mptt.forms import TreeNodeChoiceField, TreeNodeMultipleChoiceField
from django.urls import reverse_lazy

from business.models import Business, Category


class BusinessConvertForm(forms.ModelForm):

    class Meta:
        model = Business
        fields = '__all__'

    def clean(self):

        # Get cleaned data
        super().clean()
        d = self.cleaned_data

        # Check for delivery information
        has_info = False

        if 'delivers_to_ch' in d:
            has_info = d['delivers_to_ch']

        try:
            fields = ['delivers_to_canton', 'delivers_to_district', 'delivers_to_municipality', 'delivers_to']
            for field in fields:
                if d[field].count() > 0:
                    has_info = True
        except Exception:
            raise forms.ValidationError("No delivery information provided.")

        if not has_info:
            raise forms.ValidationError("No delivery information provided.")

        # Return data
        self.cleaned_data = d
        return d
