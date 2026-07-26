from django.conf import settings
from django.db import models
from django.utils import timezone


class Site(models.Model):
    key = models.SlugField(max_length=80, unique=True)
    name = models.CharField(max_length=160)
    domain = models.CharField(max_length=255, blank=True)
    default_locale = models.CharField(max_length=12, default="en")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["key"]

    def __str__(self):
        return self.name


class Page(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    site = models.ForeignKey(Site, related_name="pages", on_delete=models.CASCADE)
    slug = models.CharField(max_length=255)
    title = models.CharField(max_length=180)
    locale = models.CharField(max_length=12, default="en")
    page_type = models.CharField(max_length=60, default="standard")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    seo_title = models.CharField(max_length=180, blank=True)
    seo_description = models.TextField(blank=True)
    seo_keywords = models.TextField(blank=True)
    og_image_url = models.URLField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["site__key", "slug", "locale"]
        constraints = [
            models.UniqueConstraint(fields=["site", "slug", "locale"], name="unique_page_per_site_slug_locale"),
        ]
        indexes = [
            models.Index(fields=["site", "slug", "locale", "status"]),
        ]

    def __str__(self):
        return f"{self.site.key}: {self.slug} ({self.locale})"

    def publish(self, user=None):
        self.status = self.Status.PUBLISHED
        self.published_at = timezone.now()
        self.save(update_fields=["status", "published_at", "updated_at"])
        PublishLog.objects.create(page=self, user=user, action=PublishLog.Action.PUBLISH)

    def unpublish(self, user=None):
        self.status = self.Status.DRAFT
        self.save(update_fields=["status", "updated_at"])
        PublishLog.objects.create(page=self, user=user, action=PublishLog.Action.UNPUBLISH)


class Section(models.Model):
    class SectionType(models.TextChoices):
        HERO = "hero", "Hero"
        CARDS = "cards", "Cards"
        SERVICES = "services", "Services"
        PROCESS = "process", "Process"
        CONTACT = "contact", "Contact"
        CTA = "cta", "Call to Action"
        RICH_TEXT = "rich_text", "Rich Text"
        LINKS = "links", "Links"

    page = models.ForeignKey(Page, related_name="sections", on_delete=models.CASCADE)
    section_key = models.CharField(max_length=100)
    type = models.CharField(max_length=40, choices=SectionType.choices)
    title = models.CharField(max_length=220, blank=True)
    subtitle = models.CharField(max_length=220, blank=True)
    summary = models.TextField(blank=True)
    body = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    settings = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["page", "order", "id"]
        constraints = [
            models.UniqueConstraint(fields=["page", "section_key"], name="unique_section_key_per_page"),
        ]
        indexes = [
            models.Index(fields=["page", "order"]),
        ]

    def __str__(self):
        return f"{self.page} / {self.section_key}"


class ContentBlock(models.Model):
    class BlockType(models.TextChoices):
        CARD = "card", "Card"
        SERVICE_ITEM = "service_item", "Service Item"
        PROCESS_STEP = "process_step", "Process Step"
        STAT = "stat", "Stat"
        LINK = "link", "Link"
        CONTACT_ROW = "contact_row", "Contact Row"
        BUTTON = "button", "Button"

    section = models.ForeignKey(Section, related_name="blocks", on_delete=models.CASCADE)
    block_key = models.CharField(max_length=100, blank=True)
    type = models.CharField(max_length=40, choices=BlockType.choices)
    title = models.CharField(max_length=220, blank=True)
    subtitle = models.CharField(max_length=220, blank=True)
    body = models.TextField(blank=True)
    icon = models.CharField(max_length=80, blank=True)
    image_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    href = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    settings = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["section", "order", "id"]
        indexes = [
            models.Index(fields=["section", "order"]),
        ]

    def __str__(self):
        return self.title or self.block_key or f"Block {self.pk}"


class NavigationItem(models.Model):
    site = models.ForeignKey(Site, related_name="navigation_items", on_delete=models.CASCADE)
    label = models.CharField(max_length=120)
    href = models.CharField(max_length=255)
    section_key = models.CharField(max_length=100, blank=True)
    locale = models.CharField(max_length=12, default="en")
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["site", "locale", "order", "id"]
        indexes = [
            models.Index(fields=["site", "locale", "order"]),
        ]

    def __str__(self):
        return f"{self.site.key}: {self.label}"


class SiteSetting(models.Model):
    site = models.OneToOneField(Site, related_name="settings", on_delete=models.CASCADE)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=80, blank=True)
    contact_address = models.TextField(blank=True)
    whatsapp = models.CharField(max_length=80, blank=True)
    footer_text = models.TextField(blank=True)
    settings = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.site.key}"


class Inquiry(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In Progress"
        CONTACTED = "contacted", "Contacted"
        CLOSED = "closed", "Closed"

    site = models.ForeignKey(Site, related_name="inquiries", on_delete=models.CASCADE)
    page_slug = models.CharField(max_length=255, blank=True)
    locale = models.CharField(max_length=12, default="en")
    name = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=80, blank=True)
    company = models.CharField(max_length=160, blank=True)
    country = models.CharField(max_length=120, blank=True)
    subject = models.CharField(max_length=220, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["site", "status", "created_at"]),
            models.Index(fields=["email", "created_at"]),
        ]

    def __str__(self):
        return f"{self.site.key}: {self.name} <{self.email}>"


class PublishLog(models.Model):
    class Action(models.TextChoices):
        PUBLISH = "publish", "Publish"
        UNPUBLISH = "unpublish", "Unpublish"

    page = models.ForeignKey(Page, related_name="publish_logs", on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=Action.choices)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.action} {self.page}"


class MediaAsset(models.Model):
    title = models.CharField(max_length=180, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to="cms-media/%Y/%m/", blank=True)
    external_url = models.URLField(blank=True)
    mime_type = models.CharField(max_length=120, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title or self.external_url or f"Media asset {self.pk}"
