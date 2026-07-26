from django.contrib import admin

from .models import ContentBlock, Inquiry, MediaAsset, NavigationItem, Page, PublishLog, Section, Site, SiteSetting


class SectionInline(admin.TabularInline):
    model = Section
    extra = 0
    fields = ("section_key", "type", "title", "order", "is_visible")


class ContentBlockInline(admin.TabularInline):
    model = ContentBlock
    extra = 0
    fields = ("block_key", "type", "title", "href", "order", "is_visible")


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("key", "name", "domain", "default_locale", "is_active", "updated_at")
    list_filter = ("is_active", "default_locale")
    search_fields = ("key", "name", "domain")


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("site", "slug", "title", "locale", "page_type", "status", "published_at", "updated_at")
    list_filter = ("site", "locale", "page_type", "status")
    search_fields = ("slug", "title", "seo_title", "seo_description")
    inlines = [SectionInline]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("page", "section_key", "type", "title", "order", "is_visible", "updated_at")
    list_filter = ("type", "is_visible", "page__site")
    search_fields = ("section_key", "title", "summary", "body")
    inlines = [ContentBlockInline]


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ("section", "type", "title", "href", "order", "is_visible", "updated_at")
    list_filter = ("type", "is_visible", "section__page__site")
    search_fields = ("block_key", "title", "subtitle", "body", "href")


@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = ("site", "label", "href", "section_key", "locale", "order", "is_visible")
    list_filter = ("site", "locale", "is_visible")
    search_fields = ("label", "href", "section_key")


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("site", "contact_email", "contact_phone", "updated_at")
    search_fields = ("site__key", "contact_email", "contact_phone", "contact_address")


@admin.register(PublishLog)
class PublishLogAdmin(admin.ModelAdmin):
    list_display = ("page", "action", "user", "created_at")
    list_filter = ("action", "page__site")
    search_fields = ("page__slug", "page__title", "user__username")
    readonly_fields = ("page", "action", "user", "created_at")


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("site", "name", "email", "subject", "status", "created_at")
    list_filter = ("site", "status", "locale")
    search_fields = ("name", "email", "phone", "company", "country", "subject", "message")
    readonly_fields = ("created_at", "updated_at")


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("title", "external_url", "mime_type", "uploaded_by", "created_at")
    search_fields = ("title", "alt_text", "external_url", "mime_type")
