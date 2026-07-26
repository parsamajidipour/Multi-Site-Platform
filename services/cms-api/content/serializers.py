from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ContentBlock, Inquiry, MediaAsset, NavigationItem, Page, PublishLog, Section, Site, SiteSetting


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("id", "username", "email", "is_superuser")


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ("id", "key", "name", "domain", "default_locale", "is_active", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = (
            "id",
            "site",
            "contact_email",
            "contact_phone",
            "contact_address",
            "whatsapp",
            "footer_text",
            "settings",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "site", "created_at", "updated_at")


class NavigationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationItem
        fields = (
            "id",
            "site",
            "label",
            "href",
            "section_key",
            "locale",
            "order",
            "is_visible",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ContentBlockSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(required=False, allow_blank=True)
    video_url = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ContentBlock
        fields = (
            "id",
            "section",
            "block_key",
            "type",
            "title",
            "subtitle",
            "body",
            "icon",
            "image_url",
            "video_url",
            "href",
            "order",
            "is_visible",
            "settings",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "section", "created_at", "updated_at")


class SectionSerializer(serializers.ModelSerializer):
    blocks = ContentBlockSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = (
            "id",
            "page",
            "section_key",
            "type",
            "title",
            "subtitle",
            "summary",
            "body",
            "order",
            "is_visible",
            "settings",
            "blocks",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "page", "created_at", "updated_at")


class PageSerializer(serializers.ModelSerializer):
    site_key = serializers.CharField(source="site.key", read_only=True)
    sections = SectionSerializer(many=True, read_only=True)
    og_image_url = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Page
        fields = (
            "id",
            "site",
            "site_key",
            "slug",
            "title",
            "locale",
            "page_type",
            "status",
            "seo_title",
            "seo_description",
            "seo_keywords",
            "og_image_url",
            "published_at",
            "sections",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "published_at", "created_at", "updated_at")


class PublishLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PublishLog
        fields = ("id", "page", "action", "user", "created_at")
        read_only_fields = fields


class MediaAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = (
            "id",
            "title",
            "alt_text",
            "file",
            "file_url",
            "external_url",
            "mime_type",
            "uploaded_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "file_url", "uploaded_by", "created_at", "updated_at")

    def get_file_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return ""
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class InquirySerializer(serializers.ModelSerializer):
    site_key = serializers.CharField(source="site.key", read_only=True)
    site_name = serializers.CharField(source="site.name", read_only=True)

    class Meta:
        model = Inquiry
        fields = (
            "id",
            "site",
            "site_key",
            "site_name",
            "page_slug",
            "locale",
            "name",
            "email",
            "phone",
            "company",
            "country",
            "subject",
            "message",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "site", "site_key", "site_name", "created_at", "updated_at")


class PublicInquirySerializer(serializers.ModelSerializer):
    site_key = serializers.SlugField(write_only=True)

    class Meta:
        model = Inquiry
        fields = (
            "id",
            "site_key",
            "page_slug",
            "locale",
            "name",
            "email",
            "phone",
            "company",
            "country",
            "subject",
            "message",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
        extra_kwargs = {
            "name": {"required": True, "allow_blank": False},
            "email": {"required": True, "allow_blank": False},
            "message": {"required": True, "allow_blank": False},
        }

    def validate_site_key(self, value):
        try:
            return Site.objects.get(key=value, is_active=True)
        except Site.DoesNotExist as error:
            raise serializers.ValidationError("Invalid site.") from error

    def create(self, validated_data):
        site = validated_data.pop("site_key")
        return Inquiry.objects.create(site=site, **validated_data)


class PublicContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ("block_key", "type", "title", "subtitle", "body", "icon", "image_url", "video_url", "href", "order", "settings")


class PublicSectionSerializer(serializers.ModelSerializer):
    blocks = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ("section_key", "type", "title", "subtitle", "summary", "body", "order", "settings", "blocks")

    def get_blocks(self, obj):
        blocks = obj.blocks.filter(is_visible=True).order_by("order", "id")
        return PublicContentBlockSerializer(blocks, many=True).data


class PublicNavigationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationItem
        fields = ("label", "href", "section_key", "order")


class PublicSiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ("contact_email", "contact_phone", "contact_address", "whatsapp", "footer_text", "settings")


class PublicPageSerializer(serializers.ModelSerializer):
    seo = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ("slug", "title", "locale", "page_type", "seo", "sections", "published_at", "updated_at")

    def get_seo(self, obj):
        return {
            "title": obj.seo_title,
            "description": obj.seo_description,
            "keywords": obj.seo_keywords,
            "og_image_url": obj.og_image_url,
        }

    def get_sections(self, obj):
        sections = obj.sections.filter(is_visible=True).order_by("order", "id")
        return PublicSectionSerializer(sections, many=True).data


class PublicBlogPostSummarySerializer(serializers.ModelSerializer):
    excerpt = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ("slug", "title", "locale", "excerpt", "category", "image_url", "published_at", "updated_at")

    def _hero_section(self, obj):
        return obj.sections.filter(section_key="hero", is_visible=True).order_by("order", "id").first()

    def get_excerpt(self, obj):
        hero = self._hero_section(obj)
        if hero and hero.summary:
            return hero.summary
        if obj.seo_description:
            return obj.seo_description
        return ""

    def get_category(self, obj):
        hero = self._hero_section(obj)
        return hero.subtitle if hero and hero.subtitle else ""

    def get_image_url(self, obj):
        if obj.og_image_url:
            return obj.og_image_url
        hero = self._hero_section(obj)
        if not hero:
            return ""
        block = hero.blocks.filter(is_visible=True).order_by("order", "id").first()
        return block.image_url if block and block.image_url else ""


class PublicSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ("key", "name", "domain", "default_locale")
