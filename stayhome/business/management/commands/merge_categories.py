from progressbar import progressbar

from django.core.management.base import BaseCommand
from django.db.models import Q
from django.db import connection

from business.models import Category, Business


class Command(BaseCommand):
    help = 'Merge the given categories'

    def add_arguments(self, parser):
        parser.add_argument('source_category', type=str, help='Category that will be removed')
        parser.add_argument('destination_category', type=str, help='Category that will be used to replace removed category')

    def handle(self, *args, **options):
        
        src = options['source_category']
        dst = options['destination_category']

        src = Category.objects.get(pk=src)
        dst = Category.objects.get(pk=dst)

        print("##############################################################")
        print()
        print("  WARNING !!!!")
        print()
        print("  This script will replace all references from category :")
        print("    " + src.name_en + " (" + str(src.id) + ")")
        print("  To reference to the following category :")
        print("    " + dst.name_en + " (" + str(dst.id) + ")")
        print("  And then remove the original category.")
        print()
        print("  THIS CANNOT BE UNDONE ! ARE YOU SURE ?")
        print()
        print("##############################################################")

        result = input("%s " % "Answer yes or no:")
        while result != "yes" and result != "no":
            result = input("Please answer yes or no: ")
        if result == 'no':
            exit()

        bs = Business.objects.filter(main_category=src)
        print("Found %d businesses with matching main_category..." % bs.count())
        for b in progressbar(bs):
            b.main_category = dst
            b.save()

        bs = Business.objects.filter(other_categories__in=[src])
        print("Found %d businesses with matching other_categories..." % bs.count())
        for b in progressbar(bs):
            b.other_categories.remove(src)
            b.other_categories.add(dst)
            b.save()

        src.delete()
