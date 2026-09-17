"""Serializers for Service model."""
from rest_framework import serializers
from apps.content.models.service import Service


class ServiceSerializer(serializers.ModelSerializer):
    """Read-only serializer for general contractor services."""

    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "category_display",
            "summary",
            "body",
            "hero_image",
            "capabilities",
            "order",
        ]
        read_only_fields = fields
