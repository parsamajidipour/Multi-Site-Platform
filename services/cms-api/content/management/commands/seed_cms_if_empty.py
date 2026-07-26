from django.core.management import call_command
from django.core.management.base import BaseCommand

from content.models import Site


class Command(BaseCommand):
    help = "Import CMS seed content only when the CMS has no sites yet."

    def handle(self, *args, **options):
        if Site.objects.exists():
            self.stdout.write("CMS already has site data; skipping seed import.")
            return

        self.stdout.write("CMS has no site data; importing initial seed content.")
        call_command("seed_cms")
