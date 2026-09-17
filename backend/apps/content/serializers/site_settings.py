"""Serializers for SiteSettings singleton model."""
from rest_framework import serializers
from apps.content.models.site_settings import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Read-only serializer for company configuration and metadata."""

    class Meta:
        model = SiteSettings
        fields = [
            "company_name",
            "tagline",
            "phone",
            "email",
            "license_number",
            "founding_year",
            "street_address",
            "city",
            "state",
            "postal_code",
            "hours",
            "service_area",
            "linkedin_url",
            "facebook_url",
            "youtube_url",
        ]
        read_only_fields = fields
