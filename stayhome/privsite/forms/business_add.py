from django import forms
from mptt.forms import TreeNodeChoiceField, TreeNodeMultipleChoiceField
from django.urls import reverse_lazy

from business.models import Business, Category


class BusinessAddForm(forms.ModelForm):

    new_categories = forms.CharField(
        required=False
    )

    class Meta:
        model = Business
        fields = '__all__'

    def clean(self):

        # Get cleaned data
        super().clean()
        d = self.cleaned_data

        # New categories
        added_categories = []
        if 'new_categories' in d:
            blocks = str(d['new_categories']).split(',')
            for cats in blocks:
                cats = cats.strip().split('/')
                p = None
                for cat in cats:
                    name=cat.strip()
                    if name != '':
                        p, created = Category.objects.get_or_create(name=name, parent=p)
                added_categories.append(p)

        # Main category
        if 'main_category' not in d:
            if len(added_categories) == 0:
                raise forms.ValidationError("No main category selected and no new category provided.")
            else:
                d['main_category'] = added_categories.pop(0)

        # Other categories
        if 'other_categories' in d:
            d['other_categories'] = d['other_categories'] | added_categories
        else:
            d['other_categories'] = added_categories

        # ToDo: Check for delivery

        # Return data
        return d
