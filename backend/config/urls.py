"""URL configuration for Eric Sherwood Construction."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Django Superuser Admin (moved to django-admin/ so /admin is the custom React Admin Panel)
    path("django-admin/", admin.site.urls),

    # API endpoints under /api/v1/
    path("api/v1/health/", include("apps.core.urls")),
    path("api/v1/auth/", include("apps.auth_api.urls")),
    path("api/v1/admin/", include("config.admin_urls")),
    path("api/v1/chat/", include("apps.chatbot.urls")),
    path("api/v1/inquiries/", include("apps.inquiries.urls")),
    path("api/v1/", include("apps.content.urls")),

    # OpenAPI Schema & Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    try:
        import debug_toolbar

        urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    except ImportError:
        pass
