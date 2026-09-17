"""Views for SiteSettings endpoint."""
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from apps.content.selectors.site_settings import get_site_settings
from apps.content.serializers.site_settings import SiteSettingsSerializer


class SiteSettingsView(APIView):
    """Retrieve singleton site settings (cached for 15 minutes)."""

    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="Get Site Settings",
        description="Retrieve cached business metadata, phone, email, licensing, and social links.",
        responses={200: SiteSettingsSerializer},
    )
    def get(self, request: Request) -> Response:
        site_settings = get_site_settings()
        serializer = SiteSettingsSerializer(site_settings, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
