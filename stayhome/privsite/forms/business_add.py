from django import forms
from mptt.forms import TreeNodeChoiceField, TreeNodeMultipleChoiceField
from django.urls import reverse_lazy

from business.models import Business, Category


class BusinessAddForm(forms.ModelForm):

    main_category = forms.ChoiceField(
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-control form-control-sm sh-select2',
            'data-lookup-url': reverse_lazy('mgmt:lookup', kwargs={'model':'category'})
        })
    )

    other_categories = forms.MultipleChoiceField(
        required=False,
        widget=forms.SelectMultiple(attrs={
            'class': 'form-control form-control-sm sh-select2',
            'data-lookup-url': reverse_lazy('mgmt:lookup', kwargs={'model':'category'})
        })
    )

    new_categories = forms.CharField(
        required=False
    )

    delivers_to_canton = forms.MultipleChoiceField(
        required=False,
        widget=forms.SelectMultiple(attrs={
            'class': 'form-control form-control-sm sh-select2',
            'data-lookup-url': reverse_lazy('mgmt:lookup', kwargs={'model':'canton'})
        })
    )

    delivers_to_district = forms.MultipleChoiceField(
        required=False,
        widget=forms.SelectMultiple(attrs={
            'class': 'form-control form-control-sm sh-select2',
            'data-lookup-url': reverse_lazy('mgmt:lookup', kwargs={'model':'district'})
        })
    )

    delivers_to_municipality = forms.MultipleChoiceField(
        required=False,
        widget=forms.SelectMultiple(attrs={
            'class': 'form-control form-control-sm sh-select2',
            'data-lookup-url': reverse_lazy('mgmt:lookup', kwargs={'model':'municipality'})
        })
    )

    delivers_to = forms.MultipleChoiceField(
        required=False,
        widget=forms.SelectMultiple(attrs={
            'class': 'form-control form-control-sm sh-select2',
            'data-lookup-url': reverse_lazy('mgmt:lookup', kwargs={'model':'npa'})
        })
    )

    class Meta:
        model = Business
        fields = ['name', 'description', 'delivers_to_ch', 'address', 'location', 'website', 'phone', 'email']

    def clean(self):

        cleaned_data = super().clean()

        added_categories = []

        if cleaned_data['main_category'] == '':
            cleaned_data['main_category'] = 0
        data = int(cleaned_data['main_category'])
        if data == 0:
            if cleaned_data['new_categories'] == '':
                raise forms.ValidationError("No main category selected.")
            else:
                cleaned_data['main_category'] = None
        else:
            try:
                cleaned_data['main_category'] = Category.objects.get(pk=data)
            except Category.DoesNotExist:
                raise forms.ValidationError("This category does not exist.")

        data = cleaned_data['other_categories']
        try:
            data = Category.objects.filter(pk__in=data)
        except Category.DoesNotExist:
            raise forms.ValidationError("A selected category does not exist.")
        cleaned_data['other_categories'] = data

        data = cleaned_data['new_categories']
        blocks = str(data).split(',')
        for cats in blocks:
            cats = cats.strip().split('/')
            p = None
            for cat in cats:
                p, created = Category.objects.get_or_create(name=cat.strip(), parent=p)
            added_categories.append(p)

        if cleaned_data['main_category'] is None and len(added_categories) == 0:
            raise forms.ValidationError("No valid main category selected.")

        if cleaned_data['main_category'] is None:
            cleaned_data['main_category'] = added_categories.pop(0)

        all_cats = []
        for cat in added_categories:
            all_cats.append(cat)
        for cat in cleaned_data['other_categories']:
            all_cats.append(cat)
        cleaned_data['other_categories'] = all_cats

        del cleaned_data['new_categories']

        return cleaned_data
