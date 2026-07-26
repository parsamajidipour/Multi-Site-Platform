import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Site",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.SlugField(max_length=80, unique=True)),
                ("name", models.CharField(max_length=160)),
                ("domain", models.CharField(blank=True, max_length=255)),
                ("default_locale", models.CharField(default="en", max_length=12)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["key"]},
        ),
        migrations.CreateModel(
            name="MediaAsset",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(blank=True, max_length=180)),
                ("alt_text", models.CharField(blank=True, max_length=255)),
                ("file", models.FileField(blank=True, upload_to="cms-media/%Y/%m/")),
                ("external_url", models.URLField(blank=True)),
                ("mime_type", models.CharField(blank=True, max_length=120)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("uploaded_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Page",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.CharField(max_length=255)),
                ("title", models.CharField(max_length=180)),
                ("locale", models.CharField(default="en", max_length=12)),
                ("page_type", models.CharField(default="standard", max_length=60)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
                ("seo_title", models.CharField(blank=True, max_length=180)),
                ("seo_description", models.TextField(blank=True)),
                ("seo_keywords", models.TextField(blank=True)),
                ("og_image_url", models.URLField(blank=True)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("site", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="pages", to="content.site")),
            ],
            options={
                "ordering": ["site__key", "slug", "locale"],
                "indexes": [models.Index(fields=["site", "slug", "locale", "status"], name="content_pag_site_id_d87537_idx")],
                "constraints": [models.UniqueConstraint(fields=("site", "slug", "locale"), name="unique_page_per_site_slug_locale")],
            },
        ),
        migrations.CreateModel(
            name="NavigationItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label", models.CharField(max_length=120)),
                ("href", models.CharField(max_length=255)),
                ("section_key", models.CharField(blank=True, max_length=100)),
                ("locale", models.CharField(default="en", max_length=12)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_visible", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("site", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="navigation_items", to="content.site")),
            ],
            options={
                "ordering": ["site", "locale", "order", "id"],
                "indexes": [models.Index(fields=["site", "locale", "order"], name="content_nav_site_id_a0b57c_idx")],
            },
        ),
        migrations.CreateModel(
            name="SiteSetting",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("contact_email", models.EmailField(blank=True, max_length=254)),
                ("contact_phone", models.CharField(blank=True, max_length=80)),
                ("contact_address", models.TextField(blank=True)),
                ("whatsapp", models.CharField(blank=True, max_length=80)),
                ("footer_text", models.TextField(blank=True)),
                ("settings", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("site", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="settings", to="content.site")),
            ],
        ),
        migrations.CreateModel(
            name="PublishLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("action", models.CharField(choices=[("publish", "Publish"), ("unpublish", "Unpublish")], max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("page", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="publish_logs", to="content.page")),
                ("user", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Section",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("section_key", models.CharField(max_length=100)),
                ("type", models.CharField(choices=[("hero", "Hero"), ("cards", "Cards"), ("services", "Services"), ("process", "Process"), ("contact", "Contact"), ("cta", "Call to Action"), ("rich_text", "Rich Text"), ("links", "Links")], max_length=40)),
                ("title", models.CharField(blank=True, max_length=220)),
                ("subtitle", models.CharField(blank=True, max_length=220)),
                ("summary", models.TextField(blank=True)),
                ("body", models.TextField(blank=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_visible", models.BooleanField(default=True)),
                ("settings", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("page", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="sections", to="content.page")),
            ],
            options={
                "ordering": ["page", "order", "id"],
                "indexes": [models.Index(fields=["page", "order"], name="content_sec_page_id_a94c85_idx")],
                "constraints": [models.UniqueConstraint(fields=("page", "section_key"), name="unique_section_key_per_page")],
            },
        ),
        migrations.CreateModel(
            name="ContentBlock",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("block_key", models.CharField(blank=True, max_length=100)),
                ("type", models.CharField(choices=[("card", "Card"), ("service_item", "Service Item"), ("process_step", "Process Step"), ("stat", "Stat"), ("link", "Link"), ("contact_row", "Contact Row"), ("button", "Button")], max_length=40)),
                ("title", models.CharField(blank=True, max_length=220)),
                ("subtitle", models.CharField(blank=True, max_length=220)),
                ("body", models.TextField(blank=True)),
                ("icon", models.CharField(blank=True, max_length=80)),
                ("image_url", models.URLField(blank=True)),
                ("video_url", models.URLField(blank=True)),
                ("href", models.CharField(blank=True, max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_visible", models.BooleanField(default=True)),
                ("settings", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("section", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="blocks", to="content.section")),
            ],
            options={
                "ordering": ["section", "order", "id"],
                "indexes": [models.Index(fields=["section", "order"], name="content_con_section_c3dc8e_idx")],
            },
        ),
    ]
