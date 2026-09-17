"""Serializers for Testimonial model."""
from rest_framework import serializers
from apps.content.models.testimonial import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    """Read-only serializer for client testimonials."""

    project_title = serializers.CharField(source="project.title", read_only=True, default=None)
    project_slug = serializers.CharField(source="project.slug", read_only=True, default=None)

    class Meta:
        model = Testimonial
        fields = [
            "id",
            "author",
            "role_or_location",
            "quote",
            "project_title",
            "project_slug",
            "order",
        ]
        read_only_fields = fields
