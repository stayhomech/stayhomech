from django import forms
from mptt.forms import TreeNodeChoiceField, TreeNodeMultipleChoiceField

from business.models import Business, Category


class BusinessAddForm(forms.ModelForm):

    leaf_categories = Category.objects.filter(children__isnull=True)
    cat_list = []
    for cat in leaf_categories:
        path = cat.get_ancestors(include_self=True)
        name = []
        for node in path:
            name.append(node.name)
        cat_list.append((cat.pk, ' / '.join(name)))

    main_category = forms.ChoiceField(choices=cat_list)

    other_categories = forms.MultipleChoiceField(
        choices=cat_list,
        required=False
    )

    class Meta:
        model = Business
        fields = '__all__'

    def clean_main_category(self):
        data = self.cleaned_data['main_category']
        try:
            data = Category.objects.get(pk=data)
        except Category.DoesNotExist:
            raise forms.ValidationError("This category does not exist.")
        return data

    def clean_other_categories(self):
        data = self.cleaned_data['other_categories']
        try:
            data = Category.objects.filter(pk__in=data)
        except Category.DoesNotExist:
            raise forms.ValidationError("This category does not exist.")
        return data
