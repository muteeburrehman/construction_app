"""Serializers for ProjectImage model."""
from rest_framework import serializers
from apps.content.models.project_image import ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    """Read-only serializer for architectural project photography."""

    class Meta:
        model = ProjectImage
        fields = [
            "id",
            "image",
            "alt_text",
            "caption",
            "order",
            "is_cover",
        ]
        read_only_fields = fields
