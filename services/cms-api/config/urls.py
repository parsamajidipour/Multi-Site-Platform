from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content import views


router = DefaultRouter()
router.register(r"api/admin/sites", views.SiteViewSet, basename="admin-sites")
router.register(r"api/admin/pages", views.PageViewSet, basename="admin-pages")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", views.LoginView.as_view(), name="api-login"),
    path("api/auth/logout/", views.LogoutView.as_view(), name="api-logout"),
    path("api/auth/me/", views.MeView.as_view(), name="api-me"),
    path("", include(router.urls)),
    path("api/admin/pages/<int:page_id>/sync-from-english/", views.PageSyncFromEnglishView.as_view(), name="admin-page-sync-from-english"),
    path("api/admin/pages/<int:page_id>/sections/", views.PageSectionListCreateView.as_view(), name="admin-page-sections"),
    path("api/admin/pages/<int:page_id>/sections/reorder/", views.SectionReorderView.as_view(), name="admin-section-reorder"),
    path(
        "api/admin/sites/<int:site_id>/locales/<slug:locale>/clone-from-default/",
        views.SiteLocaleCloneView.as_view(),
        name="admin-site-locale-clone",
    ),
    path("api/admin/sections/<int:pk>/", views.SectionDetailView.as_view(), name="admin-section-detail"),
    path("api/admin/sections/<int:section_id>/blocks/", views.SectionBlockListCreateView.as_view(), name="admin-section-blocks"),
    path("api/admin/sections/<int:section_id>/blocks/reorder/", views.ContentBlockReorderView.as_view(), name="admin-block-reorder"),
    path("api/admin/blocks/<int:pk>/", views.ContentBlockDetailView.as_view(), name="admin-block-detail"),
    path("api/admin/sites/<int:site_id>/navigation/", views.NavigationListCreateView.as_view(), name="admin-site-navigation"),
    path("api/admin/sites/<int:site_id>/navigation/reorder/", views.NavigationReorderView.as_view(), name="admin-navigation-reorder"),
    path("api/admin/navigation/<int:pk>/", views.NavigationDetailView.as_view(), name="admin-navigation-detail"),
    path("api/admin/sites/<int:site_id>/settings/", views.SiteSettingDetailView.as_view(), name="admin-site-settings"),
    path("api/admin/inquiries/", views.InquiryListView.as_view(), name="admin-inquiries"),
    path("api/admin/inquiries/<int:pk>/", views.InquiryDetailView.as_view(), name="admin-inquiry-detail"),
    path("api/admin/media-assets/", views.MediaAssetListCreateView.as_view(), name="admin-media-assets"),
    path("api/admin/media-assets/<int:pk>/", views.MediaAssetDetailView.as_view(), name="admin-media-asset-detail"),
    path("api/public/inquiries/", views.PublicInquiryCreateView.as_view(), name="public-inquiries"),
    path("api/public/sites/<slug:site_key>/", views.PublicSiteView.as_view(), name="public-site"),
    path("api/public/sites/<slug:site_key>/navigation/", views.PublicNavigationView.as_view(), name="public-navigation"),
    path("api/public/sites/<slug:site_key>/settings/", views.PublicSiteSettingView.as_view(), name="public-settings"),
    path("api/public/sites/<slug:site_key>/homepage/", views.PublicHomepageView.as_view(), name="public-homepage"),
    path("api/public/sites/<slug:site_key>/blog/", views.PublicBlogListView.as_view(), name="public-blog"),
    path("api/public/sites/<slug:site_key>/pages/<path:slug>/", views.PublicPageView.as_view(), name="public-page"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
