from django import forms
from mptt.forms import TreeNodeChoiceField, TreeNodeMultipleChoiceField

from business.models import Business, Category


class BusinessAddForm(forms.ModelForm):

    new_categories = forms.CharField(
        required=False
    )

    def __init__(self, *args, **kwargs):
        super(BusinessAddForm, self).__init__(*args, **kwargs)

        leaf_categories = Category.objects.filter(children__isnull=True)

        cat_list = [(0, '----------')]
        for cat in leaf_categories:
            path = cat.get_ancestors(include_self=True)
            name = []
            for node in path:
                name.append(node.name)
            cat_list.append((cat.pk, ' / '.join(name)))

        self.fields.update({
            'main_category': forms.ChoiceField(
                choices=cat_list,
                required=False
            ),
            'other_categories = ': forms.MultipleChoiceField(
                choices=cat_list,
                required=False
            )
        }) 

    class Meta:
        model = Business
        fields = '__all__'

    def clean(self):

        cleaned_data = super().clean()

        added_categories = []

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
