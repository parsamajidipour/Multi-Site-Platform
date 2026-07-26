import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update a Django superuser from CMS_SUPERUSER_* environment variables."

    def handle(self, *args, **options):
        username = os.environ.get("CMS_SUPERUSER_USERNAME", "").strip()
        email = os.environ.get("CMS_SUPERUSER_EMAIL", "").strip()
        password = os.environ.get("CMS_SUPERUSER_PASSWORD", "")

        if not username or not password:
            self.stdout.write("CMS_SUPERUSER_USERNAME or CMS_SUPERUSER_PASSWORD not set; skipping superuser setup.")
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        if email and user.email != email:
            user.email = email
        if not user.is_staff:
            user.is_staff = True
        if not user.is_superuser:
            user.is_superuser = True

        user.set_password(password)
        user.save()

        action = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} CMS superuser: {username}"))
