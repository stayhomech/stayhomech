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
            for categories in blocks:
                categories = categories.strip().split('/')
                parent = None
                for category in categories:
                    name = category.strip()
                    if name != '':
                        parent, created = Category.objects.get_or_create(name=name, parent=parent)
                if parent is not None:
                    added_categories.append(parent)

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
        return d
