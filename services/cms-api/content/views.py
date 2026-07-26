from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContentBlock, Inquiry, MediaAsset, NavigationItem, Page, Section, Site, SiteSetting
from .permissions import IsSuperAdmin
from .serializers import (
    ContentBlockSerializer,
    InquirySerializer,
    MediaAssetSerializer,
    NavigationItemSerializer,
    PageSerializer,
    PublicBlogPostSummarySerializer,
    PublicInquirySerializer,
    PublicNavigationItemSerializer,
    PublicPageSerializer,
    PublicSiteSerializer,
    PublicSiteSettingSerializer,
    SectionSerializer,
    SiteSerializer,
    SiteSettingSerializer,
    UserSerializer,
)

SUPPORTED_LOCALES = ("en", "fa", "ar", "tr")
DEFAULT_FALLBACK_LOCALE = "en"


def normalize_page_slug(slug):
    if not slug or slug in {"home", "/"}:
        return "/"
    normalized = slug.strip("/")
    return f"/{normalized}"


def normalize_locale(locale, fallback=DEFAULT_FALLBACK_LOCALE):
    value = str(locale or "").strip().lower()
    return value if value in SUPPORTED_LOCALES else fallback


def requested_locale(request, site=None):
    fallback = normalize_locale(getattr(site, "default_locale", DEFAULT_FALLBACK_LOCALE))
    return normalize_locale(request.query_params.get("locale"), fallback=fallback)


def locale_fallbacks(locale, site=None):
    candidates = [
        normalize_locale(locale),
        normalize_locale(getattr(site, "default_locale", DEFAULT_FALLBACK_LOCALE)),
        DEFAULT_FALLBACK_LOCALE,
    ]
    output = []
    for candidate in candidates:
        if candidate not in output:
            output.append(candidate)
    return output


def first_for_locale_fallback(queryset, locale, site=None):
    for candidate in locale_fallbacks(locale, site):
        item = queryset.filter(locale=candidate).first()
        if item:
            return item
    return None


def clone_page_to_locale(source_page, target_locale):
    page, created = Page.objects.get_or_create(
        site=source_page.site,
        slug=source_page.slug,
        locale=target_locale,
        defaults={
            "title": source_page.title,
            "page_type": source_page.page_type,
            "status": Page.Status.DRAFT,
            "seo_title": source_page.seo_title,
            "seo_description": source_page.seo_description,
            "seo_keywords": source_page.seo_keywords,
            "og_image_url": source_page.og_image_url,
        },
    )

    if not created:
        return page, False

    for source_section in source_page.sections.order_by("order", "id"):
        section = Section.objects.create(
            page=page,
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
        for source_block in source_section.blocks.order_by("order", "id"):
            ContentBlock.objects.create(
                section=section,
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

    return page, True


def clone_navigation_to_locale(site, source_locale, target_locale):
    created = 0
    for source_item in site.navigation_items.filter(locale=source_locale).order_by("order", "id"):
        _, item_created = NavigationItem.objects.get_or_create(
            site=site,
            locale=target_locale,
            href=source_item.href,
            section_key=source_item.section_key,
            defaults={
                "label": source_item.label,
                "order": source_item.order,
                "is_visible": source_item.is_visible,
            },
        )
        if item_created:
            created += 1
    return created


def visible_navigation_for_locale(site, locale):
    items = site.navigation_items.filter(locale=locale, is_visible=True).order_by("order", "id")
    if items.exists():
        return items

    for fallback_locale in locale_fallbacks(locale, site)[1:]:
        items = site.navigation_items.filter(locale=fallback_locale, is_visible=True).order_by("order", "id")
        if items.exists():
            return items

    return items


def public_settings_data(site):
    try:
        return PublicSiteSettingSerializer(site.settings).data
    except SiteSetting.DoesNotExist:
        return {
            "contact_email": "",
            "contact_phone": "",
            "contact_address": "",
            "whatsapp": "",
            "footer_text": "",
            "settings": {},
        }


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if not user or not user.is_superuser:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class SuperAdminMixin:
    permission_classes = [IsSuperAdmin]


class SiteViewSet(SuperAdminMixin, viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    lookup_field = "pk"

    def perform_create(self, serializer):
        site = serializer.save()
        SiteSetting.objects.get_or_create(site=site)


class PageViewSet(SuperAdminMixin, viewsets.ModelViewSet):
    serializer_class = PageSerializer

    def get_queryset(self):
        queryset = Page.objects.select_related("site").prefetch_related("sections__blocks").all()
        site = self.request.query_params.get("site")
        locale = self.request.query_params.get("locale")
        status_filter = self.request.query_params.get("status")
        if site:
            queryset = queryset.filter(site__key=site)
        if locale:
            queryset = queryset.filter(locale=locale)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def perform_create(self, serializer):
        slug = normalize_page_slug(serializer.validated_data.get("slug"))
        serializer.save(slug=slug)

    def perform_update(self, serializer):
        slug = serializer.validated_data.get("slug")
        if slug is not None:
            serializer.save(slug=normalize_page_slug(slug))
        else:
            serializer.save()

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        page = self.get_object()
        page.publish(user=request.user)
        return Response(PageSerializer(page, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def unpublish(self, request, pk=None):
        page = self.get_object()
        page.unpublish(user=request.user)
        return Response(PageSerializer(page, context={"request": request}).data)


class SiteLocaleCloneView(SuperAdminMixin, APIView):
    def post(self, request, site_id, locale):
        site = get_object_or_404(Site, pk=site_id)
        target_locale = normalize_locale(locale)
        if target_locale == DEFAULT_FALLBACK_LOCALE:
            return Response({"detail": "English is the default fallback locale and does not need cloning."}, status=status.HTTP_400_BAD_REQUEST)

        source_locale = normalize_locale(site.default_locale)
        source_pages = Page.objects.filter(site=site, locale=source_locale).prefetch_related("sections__blocks")
        if not source_pages.exists() and source_locale != DEFAULT_FALLBACK_LOCALE:
            source_locale = DEFAULT_FALLBACK_LOCALE
            source_pages = Page.objects.filter(site=site, locale=source_locale).prefetch_related("sections__blocks")

        created_pages = 0
        with transaction.atomic():
            for source_page in source_pages:
                _, created = clone_page_to_locale(source_page, target_locale)
                if created:
                    created_pages += 1
            created_navigation = clone_navigation_to_locale(site, source_locale, target_locale)

        pages = Page.objects.filter(site=site, locale=target_locale).select_related("site").prefetch_related("sections__blocks")
        return Response(
            {
                "locale": target_locale,
                "source_locale": source_locale,
                "created_pages": created_pages,
                "created_navigation": created_navigation,
                "pages": PageSerializer(pages, many=True, context={"request": request}).data,
            }
        )


class PageSyncFromEnglishView(SuperAdminMixin, APIView):
    """
    POST /api/admin/pages/<page_id>/sync-from-english/
    Copies missing sections and blocks from the EN version of this page into the
    target-locale version. Existing translated content is never overwritten.
    Returns counts of what was added.
    """

    def post(self, request, page_id):
        page = get_object_or_404(
            Page.objects.prefetch_related("sections__blocks"), pk=page_id
        )

        if page.locale == DEFAULT_FALLBACK_LOCALE:
            return Response(
                {"detail": "This is already the English (default) page."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            source = Page.objects.prefetch_related("sections__blocks").get(
                site=page.site, slug=page.slug, locale=DEFAULT_FALLBACK_LOCALE
            )
        except Page.DoesNotExist:
            return Response(
                {"detail": "No English version found for this page."},
                status=status.HTTP_404_NOT_FOUND,
            )

        added_sections = 0
        added_blocks = 0

        with transaction.atomic():
            existing_keys = {s.section_key for s in page.sections.all()}

            for src_sec in source.sections.order_by("order", "id"):
                if src_sec.section_key not in existing_keys:
                    new_sec = Section.objects.create(
                        page=page,
                        section_key=src_sec.section_key,
                        type=src_sec.type,
                        title=src_sec.title,
                        subtitle=src_sec.subtitle,
                        summary=src_sec.summary,
                        body=src_sec.body,
                        order=src_sec.order,
                        is_visible=src_sec.is_visible,
                        settings=src_sec.settings,
                    )
                    for src_blk in src_sec.blocks.order_by("order", "id"):
                        ContentBlock.objects.create(
                            section=new_sec,
                            block_key=src_blk.block_key,
                            type=src_blk.type,
                            title=src_blk.title,
                            subtitle=src_blk.subtitle,
                            body=src_blk.body,
                            icon=src_blk.icon,
                            image_url=src_blk.image_url,
                            video_url=src_blk.video_url,
                            href=src_blk.href,
                            order=src_blk.order,
                            is_visible=src_blk.is_visible,
                            settings=src_blk.settings,
                        )
                    added_sections += 1
                    added_blocks += src_sec.blocks.count()
                else:
                    tgt_sec = page.sections.get(section_key=src_sec.section_key)
                    existing_block_keys = {
                        b.block_key for b in tgt_sec.blocks.all() if b.block_key
                    }
                    for src_blk in src_sec.blocks.order_by("order", "id"):
                        if src_blk.block_key and src_blk.block_key not in existing_block_keys:
                            ContentBlock.objects.create(
                                section=tgt_sec,
                                block_key=src_blk.block_key,
                                type=src_blk.type,
                                title=src_blk.title,
                                subtitle=src_blk.subtitle,
                                body=src_blk.body,
                                icon=src_blk.icon,
                                image_url=src_blk.image_url,
                                video_url=src_blk.video_url,
                                href=src_blk.href,
                                order=src_blk.order,
                                is_visible=src_blk.is_visible,
                                settings=src_blk.settings,
                            )
                            added_blocks += 1

        return Response(
            {
                "added_sections": added_sections,
                "added_blocks": added_blocks,
                "source_sections": source.sections.count(),
                "source_blocks": ContentBlock.objects.filter(section__page=source).count(),
            }
        )


class PageSectionListCreateView(SuperAdminMixin, generics.ListCreateAPIView):
    serializer_class = SectionSerializer

    def get_page(self):
        return get_object_or_404(Page, pk=self.kwargs["page_id"])

    def get_queryset(self):
        return self.get_page().sections.prefetch_related("blocks").all()

    def perform_create(self, serializer):
        serializer.save(page=self.get_page())


class SectionDetailView(SuperAdminMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SectionSerializer
    queryset = Section.objects.select_related("page", "page__site").prefetch_related("blocks")


class SectionReorderView(SuperAdminMixin, APIView):
    def post(self, request, page_id):
        page = get_object_or_404(Page, pk=page_id)
        ordered_ids = request.data.get("ids", [])
        with transaction.atomic():
            for index, section_id in enumerate(ordered_ids):
                Section.objects.filter(page=page, pk=section_id).update(order=index)
        return Response({"detail": "Sections reordered."})


class SectionBlockListCreateView(SuperAdminMixin, generics.ListCreateAPIView):
    serializer_class = ContentBlockSerializer

    def get_section(self):
        return get_object_or_404(Section, pk=self.kwargs["section_id"])

    def get_queryset(self):
        return self.get_section().blocks.all()

    def perform_create(self, serializer):
        serializer.save(section=self.get_section())


class ContentBlockDetailView(SuperAdminMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContentBlockSerializer
    queryset = ContentBlock.objects.select_related("section", "section__page", "section__page__site")


class ContentBlockReorderView(SuperAdminMixin, APIView):
    def post(self, request, section_id):
        section = get_object_or_404(Section, pk=section_id)
        ordered_ids = request.data.get("ids", [])
        with transaction.atomic():
            for index, block_id in enumerate(ordered_ids):
                ContentBlock.objects.filter(section=section, pk=block_id).update(order=index)
        return Response({"detail": "Blocks reordered."})


class NavigationListCreateView(SuperAdminMixin, generics.ListCreateAPIView):
    serializer_class = NavigationItemSerializer

    def get_site(self):
        return get_object_or_404(Site, pk=self.kwargs["site_id"])

    def get_queryset(self):
        queryset = self.get_site().navigation_items.all()
        locale = self.request.query_params.get("locale")
        if locale:
            queryset = queryset.filter(locale=locale)
        return queryset

    def perform_create(self, serializer):
        serializer.save(site=self.get_site())


class NavigationDetailView(SuperAdminMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NavigationItemSerializer
    queryset = NavigationItem.objects.select_related("site")


class NavigationReorderView(SuperAdminMixin, APIView):
    def post(self, request, site_id):
        site = get_object_or_404(Site, pk=site_id)
        ordered_ids = request.data.get("ids", [])
        with transaction.atomic():
            for index, item_id in enumerate(ordered_ids):
                NavigationItem.objects.filter(site=site, pk=item_id).update(order=index)
        return Response({"detail": "Navigation reordered."})


class SiteSettingDetailView(SuperAdminMixin, generics.RetrieveUpdateAPIView):
    serializer_class = SiteSettingSerializer

    def get_object(self):
        site = get_object_or_404(Site, pk=self.kwargs["site_id"])
        settings, _ = SiteSetting.objects.get_or_create(site=site)
        return settings


class MediaAssetListCreateView(SuperAdminMixin, generics.ListCreateAPIView):
    serializer_class = MediaAssetSerializer
    queryset = MediaAsset.objects.select_related("uploaded_by")

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class MediaAssetDetailView(SuperAdminMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MediaAssetSerializer
    queryset = MediaAsset.objects.select_related("uploaded_by")


class InquiryListView(SuperAdminMixin, generics.ListAPIView):
    serializer_class = InquirySerializer

    def get_queryset(self):
        queryset = Inquiry.objects.select_related("site").all()
        site = self.request.query_params.get("site")
        status_filter = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if site:
            queryset = queryset.filter(site__key=site)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(email__icontains=search))

        return queryset


class InquiryDetailView(SuperAdminMixin, generics.RetrieveUpdateAPIView):
    serializer_class = InquirySerializer
    queryset = Inquiry.objects.select_related("site")
    http_method_names = ["get", "patch", "head", "options"]


class PublicInquiryCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = PublicInquirySerializer


class PublicSiteMixin:
    permission_classes = [AllowAny]

    def get_site(self, site_key):
        return get_object_or_404(Site, key=site_key, is_active=True)


class PublicSiteView(PublicSiteMixin, APIView):
    def get(self, request, site_key):
        site = self.get_site(site_key)
        return Response(PublicSiteSerializer(site).data)


class PublicNavigationView(PublicSiteMixin, APIView):
    def get(self, request, site_key):
        site = self.get_site(site_key)
        locale = requested_locale(request, site)
        items = visible_navigation_for_locale(site, locale)
        return Response(PublicNavigationItemSerializer(items, many=True).data)


class PublicSiteSettingView(PublicSiteMixin, APIView):
    def get(self, request, site_key):
        site = self.get_site(site_key)
        return Response(public_settings_data(site))


class PublicPageResponseMixin(PublicSiteMixin):
    def build_page_response(self, request, site, page):
        navigation = visible_navigation_for_locale(site, page.locale)
        return Response(
            {
                "site": PublicSiteSerializer(site).data,
                "page": PublicPageSerializer(page).data,
                "navigation": PublicNavigationItemSerializer(navigation, many=True).data,
                "settings": public_settings_data(site),
                "sections": PublicPageSerializer(page).data["sections"],
            }
        )


class PublicHomepageView(PublicPageResponseMixin, APIView):
    def get(self, request, site_key):
        site = self.get_site(site_key)
        locale = requested_locale(request, site)
        page = first_for_locale_fallback(
            Page.objects.select_related("site").prefetch_related("sections__blocks").filter(
                site=site,
                slug="/",
                status=Page.Status.PUBLISHED,
            ),
            locale,
            site=site,
        )
        if not page:
            return Response({"detail": "No published page found."}, status=status.HTTP_404_NOT_FOUND)
        return self.build_page_response(request, site, page)


class PublicPageView(PublicPageResponseMixin, APIView):
    def get(self, request, site_key, slug):
        site = self.get_site(site_key)
        locale = requested_locale(request, site)
        page = first_for_locale_fallback(
            Page.objects.select_related("site").prefetch_related("sections__blocks").filter(
                site=site,
                slug=normalize_page_slug(slug),
                status=Page.Status.PUBLISHED,
            ),
            locale,
            site=site,
        )
        if not page:
            return Response({"detail": "No published page found."}, status=status.HTTP_404_NOT_FOUND)
        return self.build_page_response(request, site, page)


class PublicBlogListView(PublicSiteMixin, APIView):
    def get(self, request, site_key):
        site = self.get_site(site_key)
        locale = requested_locale(request, site)
        pages = (
            Page.objects.select_related("site")
            .prefetch_related("sections__blocks")
            .filter(site=site, page_type="blog_post", status=Page.Status.PUBLISHED, locale=locale)
            .order_by("-published_at", "-updated_at")
        )
        if not pages.exists():
            for fallback_locale in locale_fallbacks(locale, site)[1:]:
                pages = (
                    Page.objects.select_related("site")
                    .prefetch_related("sections__blocks")
                    .filter(site=site, page_type="blog_post", status=Page.Status.PUBLISHED, locale=fallback_locale)
                    .order_by("-published_at", "-updated_at")
                )
                if pages.exists():
                    break
        return Response(PublicBlogPostSummarySerializer(pages, many=True).data)
