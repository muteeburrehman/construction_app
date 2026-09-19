"""URL configuration for Eric Sherwood Construction."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path, re_path
from django.views.static import serve
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def spa_fallback_view(request):
    """Serve the single-page React application index.html for client-side routing."""
    dist_dir = getattr(settings, "FRONTEND_DIST_DIR", settings.BASE_DIR.parent / "frontend" / "dist")
    index_file = dist_dir / "index.html"
    if index_file.exists():
        return HttpResponse(index_file.read_text(encoding="utf-8"), content_type="text/html; charset=utf-8")
    return HttpResponse(
        "<h1>Eric Sherwood Construction</h1><p>API is active. Frontend build not found.</p>",
        content_type="text/html",
        status=200,
    )


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

    # Media files serving (accessible both in dev and containerized prod)
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),

    # SPA catch-all route: sends all non-API / non-admin web routes to React index.html
    re_path(r"^(?!api/|django-admin/|static/|media/).*$", spa_fallback_view, name="spa"),
]

if settings.DEBUG:
    try:
        import debug_toolbar

        urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    except ImportError:
        pass
