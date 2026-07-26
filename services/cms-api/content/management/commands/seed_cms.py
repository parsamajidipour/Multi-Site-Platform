import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from content.models import ContentBlock, NavigationItem, Page, Section, Site, SiteSetting

SUPPORTED_LOCALES = ("en", "tr", "fa", "ar")
DEFAULT_LOCALE = "en"


SITE_SETTINGS_CONVENTIONS = {
    # Brand and theme
    "brand_logo_wide": "Wide variant logo URL (header)",
    "brand_logo_stacked": "Stacked variant logo URL (footer, OG)",
    "favicon_url": "Browser tab icon URL",
    "brand_color": "Primary brand color (hex)",
    "accent_color": "Accent color (hex)",
    # Hero media (site-wide default; pages can override via Section.settings)
    "hero_video": "Default hero video URL",
    "hero_poster": "Default hero poster image URL",
    # Sister-site cross-links
    "group_site_urls": "Object: { mainSite, realEstate, finance, visa }",
    # SEO defaults
    "area_served": "List of countries/markets for structured data",
    # Localized strings (form labels, error toasts, footer notes, etc.)
    # Shape: { "<key>": { "en": "...", "tr": "...", "fa": "...", "ar": "..." } }
    "ui_strings": "Per-locale UI strings keyed by string key",
    # Optional localized variants of footer_text
    "footer_text_by_locale": "Object keyed by locale code",
}


class Command(BaseCommand):
    help = (
        "Import CMS seed content from JSON. Intended for migrating static site content into CMS data.\n\n"
        "SiteSetting.settings JSON conventions (stored as a free-form dict, no migrations):\n"
        + "\n".join(f"  - {key}: {desc}" for key, desc in SITE_SETTINGS_CONVENTIONS.items())
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            default=None,
            help="Path to a JSON seed file or directory. Defaults to content/seed_data.",
        )
        parser.add_argument("--clear", action="store_true", help="Delete existing data for sites included in the seed before import.")

    def handle(self, *args, **options):
        seed_path = Path(options["path"]) if options["path"] else Path(__file__).resolve().parents[2] / "seed_data"
        seed_files = self.resolve_seed_files(seed_path)
        imported = 0

        with transaction.atomic():
            for file_path in seed_files:
                for site_payload in self.load_sites(file_path):
                    self.import_site(site_payload, clear=options["clear"])
                    imported += 1

        self.stdout.write(self.style.SUCCESS(f"Imported {imported} site seed(s) from {seed_path}"))

    def resolve_seed_files(self, seed_path):
        if not seed_path.exists():
            raise CommandError(f"Seed path does not exist: {seed_path}")

        if seed_path.is_dir():
            seed_files = sorted(seed_path.glob("*.json"))
            if not seed_files:
                raise CommandError(f"No JSON seed files found in: {seed_path}")
            return seed_files

        return [seed_path]

    def load_sites(self, seed_path):
        with seed_path.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)

        if "sites" in payload:
            sites = payload["sites"]
        elif "site" in payload:
            sites = [payload["site"]]
        else:
            raise CommandError(f"{seed_path} must contain a top-level 'sites' list or 'site' object.")

        if not isinstance(sites, list):
            raise CommandError(f"{seed_path} has invalid seed data: 'sites' must be a list.")

        return sites

    def import_site(self, payload, clear=False):
        key = payload["key"]
        site, _ = Site.objects.update_or_create(
            key=key,
            defaults={
                "name": payload.get("name", key),
                "domain": payload.get("domain", ""),
                "default_locale": payload.get("default_locale", "en"),
                "is_active": payload.get("is_active", True),
            },
        )

        if clear:
            site.pages.all().delete()
            site.navigation_items.all().delete()

        settings_payload = payload.get("settings", {})
        SiteSetting.objects.update_or_create(
            site=site,
            defaults={
                "contact_email": settings_payload.get("contact_email", ""),
                "contact_phone": settings_payload.get("contact_phone", ""),
                "contact_address": settings_payload.get("contact_address", ""),
                "whatsapp": settings_payload.get("whatsapp", ""),
                "footer_text": settings_payload.get("footer_text", ""),
                "settings": settings_payload.get("settings", {}),
            },
        )

        for index, item in enumerate(payload.get("navigation", [])):
            locale = item.get("locale", site.default_locale)
            section_key = item.get("section_key", "")
            lookup = {"site": site, "locale": locale}
            if section_key:
                lookup["section_key"] = section_key
            else:
                lookup["href"] = item["href"]
                lookup["label"] = item.get("label", item["href"])

            NavigationItem.objects.update_or_create(
                **lookup,
                defaults={
                    "label": item.get("label", item["href"]),
                    "href": item["href"],
                    "section_key": item.get("section_key", ""),
                    "locale": locale,
                    "order": item.get("order", index),
                    "is_visible": item.get("is_visible", True),
                },
            )

        for page_payload in payload.get("pages", []):
            self.import_page(site, page_payload)

        self.ensure_localized_placeholders(site)

    def import_page(self, site, payload):
        status = payload.get("status", Page.Status.DRAFT)
        page, _ = Page.objects.update_or_create(
            site=site,
            slug=payload.get("slug", "/"),
            locale=payload.get("locale", site.default_locale),
            defaults={
                "title": payload.get("title", ""),
                "page_type": payload.get("page_type", "standard"),
                "status": status,
                "seo_title": payload.get("seo", {}).get("title", ""),
                "seo_description": payload.get("seo", {}).get("description", ""),
                "seo_keywords": payload.get("seo", {}).get("keywords", ""),
                "og_image_url": payload.get("seo", {}).get("og_image_url", ""),
                "published_at": timezone.now() if status == Page.Status.PUBLISHED else None,
            },
        )
        page.sections.all().delete()

        for section_index, section_payload in enumerate(payload.get("sections", [])):
            section = Section.objects.create(
                page=page,
                section_key=section_payload["section_key"],
                type=section_payload["type"],
                title=section_payload.get("title", ""),
                subtitle=section_payload.get("subtitle", ""),
                summary=section_payload.get("summary", ""),
                body=section_payload.get("body", ""),
                order=section_payload.get("order", section_index),
                is_visible=section_payload.get("is_visible", True),
                settings=section_payload.get("settings", {}),
            )
            for block_index, block_payload in enumerate(section_payload.get("blocks", [])):
                ContentBlock.objects.create(
                    section=section,
                    block_key=block_payload.get("block_key", ""),
                    type=block_payload["type"],
                    title=block_payload.get("title", ""),
                    subtitle=block_payload.get("subtitle", ""),
                    body=block_payload.get("body", ""),
                    icon=block_payload.get("icon", ""),
                    image_url=block_payload.get("image_url", ""),
                    video_url=block_payload.get("video_url", ""),
                    href=block_payload.get("href", ""),
                    order=block_payload.get("order", block_index),
                    is_visible=block_payload.get("is_visible", True),
                    settings=block_payload.get("settings", {}),
                )

    def ensure_localized_placeholders(self, site):
        source_locale = site.default_locale or DEFAULT_LOCALE
        if not site.pages.filter(locale=source_locale).exists():
            source_locale = DEFAULT_LOCALE

        for locale in SUPPORTED_LOCALES:
            if locale == source_locale:
                continue
            self.clone_navigation(site, source_locale, locale)
            for source_page in site.pages.filter(locale=source_locale).prefetch_related("sections__blocks"):
                self.clone_page(source_page, locale)

    def clone_navigation(self, site, source_locale, target_locale):
        for item in site.navigation_items.filter(locale=source_locale).order_by("order", "id"):
            lookup = {
                "site": site,
                "locale": target_locale,
                "section_key": item.section_key,
                "href": item.href,
            }
            NavigationItem.objects.get_or_create(
                **lookup,
                defaults={
                    "label": item.label,
                    "order": item.order,
                    "is_visible": item.is_visible,
                },
            )

    def clone_page(self, source_page, target_locale):
        target_page, created = Page.objects.get_or_create(
            site=source_page.site,
            slug=source_page.slug,
            locale=target_locale,
            defaults={
                "title": source_page.title,
                "page_type": source_page.page_type,
                "status": source_page.status,
                "seo_title": source_page.seo_title,
                "seo_description": source_page.seo_description,
                "seo_keywords": source_page.seo_keywords,
                "og_image_url": source_page.og_image_url,
                "published_at": source_page.published_at,
            },
        )
        if not created:
            return

        for source_section in source_page.sections.all():
            target_section = Section.objects.create(
                page=target_page,
                section_key=source_section.section_key,
                type=source_section.type,
                title=source_section.title,
                subtitle=source_section.subtitle,
                summary=source_section.summary,
                body=source_section.body,
                order=source_section.order,
                is_visible=source_section.is_visible,
                settings=source_section.settings,
            )
            for source_block in source_section.blocks.all():
                ContentBlock.objects.create(
                    section=target_section,
                    block_key=source_block.block_key,
                    type=source_block.type,
                    title=source_block.title,
                    subtitle=source_block.subtitle,
                    body=source_block.body,
                    icon=source_block.icon,
                    image_url=source_block.image_url,
                    video_url=source_block.video_url,
                    href=source_block.href,
                    order=source_block.order,
                    is_visible=source_block.is_visible,
                    settings=source_block.settings,
                )
