import pojson,polib
po_file_path = polib.pofile('./angular/src/assets/locales/de/LC_MESSAGES/django.po')
po_dict = pojson.po2dict('./angular/src/assets/i18n/de.json')
print(po_dict)
