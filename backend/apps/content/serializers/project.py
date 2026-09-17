"""Serializers for Project model list and detail endpoints."""
from rest_framework import serializers
from apps.content.models.project import Project
from .project_image import ProjectImageSerializer


class ProjectListSerializer(serializers.ModelSerializer):
    """List serializer with prefetched cover image and service details (zero queries)."""

    service_title = serializers.CharField(source="service.title", read_only=True, default=None)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "category_display",
            "service_title",
            "location",
            "year",
            "scope",
            "summary",
            "is_featured",
            "order",
            "cover_image",
        ]
        read_only_fields = fields

    def get_cover_image(self, obj: Project) -> dict | None:
        """Derive cover image from already-prefetched images without hitting the DB."""
        # Use obj.images.all() to leverage prefetched cache
        images = list(obj.images.all())
        cover = next((img for img in images if img.is_cover), None)
        if not cover and images:
            cover = images[0]
        if cover and cover.image:
            request = self.context.get("request")
            try:
                url = request.build_absolute_uri(cover.image.url) if request else cover.image.url
            except Exception:
                url = str(cover.image)
            return {
                "id": str(cover.id),
                "image": url,
                "alt_text": cover.alt_text,
                "caption": cover.caption,
            }
        return None


class ProjectDetailSerializer(ProjectListSerializer):
    """Detail serializer including rich body copy and full ordered gallery."""

    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            "body",
            "images",
        ]
