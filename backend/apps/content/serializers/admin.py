"""Admin serializers for managing content models (writable + relationship preloading)."""
from rest_framework import serializers
from apps.content.models.project import Project
from apps.content.models.project_image import ProjectImage
from apps.content.models.service import Service
from apps.content.models.testimonial import Testimonial
from apps.content.models.site_settings import SiteSettings


class ProjectImageAdminSerializer(serializers.ModelSerializer):
    """Serializer for project images in admin."""

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = [
            "id",
            "project",
            "image",
            "image_url",
            "alt_text",
            "caption",
            "order",
            "is_cover",
            "created_at",
        ]
        read_only_fields = ["id", "image_url", "created_at"]

    def get_image_url(self, obj: ProjectImage) -> str:
        if not obj.image:
            return ""
        request = self.context.get("request")
        try:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        except Exception:
            return str(obj.image)


class ProjectAdminSerializer(serializers.ModelSerializer):
    """Full writable serializer for Projects in the admin panel."""

    service_title = serializers.CharField(source="service.title", read_only=True, default=None)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    images = ProjectImageAdminSerializer(many=True, read_only=True)
    images_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "slug",
            "title",
            "service",
            "service_title",
            "category",
            "category_display",
            "location",
            "year",
            "scope",
            "summary",
            "body",
            "is_featured",
            "is_published",
            "order",
            "images",
            "images_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "service_title", "category_display", "images", "images_count", "created_at", "updated_at"]
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }

    def get_images_count(self, obj: Project) -> int:
        # Leverage prefetched cache if available
        if hasattr(obj, "_prefetched_objects_cache") and "images" in obj._prefetched_objects_cache:
            return len(obj.images.all())
        return obj.images.count()


class ServiceAdminSerializer(serializers.ModelSerializer):
    """Full writable serializer for Services in the admin panel."""

    category_display = serializers.CharField(source="get_category_display", read_only=True)
    projects_count = serializers.SerializerMethodField()

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
            "capabilities",
            "order",
            "is_published",
            "projects_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "category_display", "projects_count", "created_at", "updated_at"]
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }

    def get_projects_count(self, obj: Service) -> int:
        if hasattr(obj, "project_count"):
            return obj.project_count
        return obj.projects.count()


class TestimonialAdminSerializer(serializers.ModelSerializer):
    """Full writable serializer for Testimonials in the admin panel."""

    project_title = serializers.CharField(source="project.title", read_only=True, default=None)

    class Meta:
        model = Testimonial
        fields = [
            "id",
            "author",
            "role_or_location",
            "quote",
            "project",
            "project_title",
            "order",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "project_title", "created_at", "updated_at"]


class SiteSettingsAdminSerializer(serializers.ModelSerializer):
    """Full writable serializer for SiteSettings in the admin panel."""

    class Meta:
        model = SiteSettings
        fields = [
            "id",
            "company_name",
            "tagline",
            "license_number",
            "phone",
            "email",
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
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]
