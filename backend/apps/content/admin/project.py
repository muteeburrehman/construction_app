"""Admin configuration for Project and ProjectImage models."""
from django.contrib import admin
from django.utils.html import mark_safe
from apps.content.models.project import Project
from apps.content.models.project_image import ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ["image", "thumbnail_preview", "alt_text", "caption", "order", "is_cover"]
    readonly_fields = ["thumbnail_preview"]
    ordering = ["order", "created_at"]

    def thumbnail_preview(self, obj: ProjectImage) -> str:
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 3px;" alt="preview" />'
            )
        return "-"

    thumbnail_preview.short_description = "Preview"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "service",
        "location",
        "year",
        "is_featured",
        "is_published",
        "order",
        "image_count",
    ]
    list_filter = ["category", "is_featured", "is_published", "year"]
    search_fields = ["title", "location", "scope", "summary"]
    prepopulated_fields = {"slug": ("title",)}
    list_select_related = ["service"]
    readonly_fields = ["id", "created_at", "updated_at"]
    inlines = [ProjectImageInline]
    ordering = ["order", "-year", "-created_at"]
    fieldsets = (
        (
            "Project Overview",
            {
                "fields": (
                    "title",
                    "slug",
                    "service",
                    "category",
                    "location",
                    "year",
                    "scope",
                    "summary",
                    "body",
                )
            },
        ),
        (
            "Visibility & Features",
            {
                "fields": ("is_featured", "is_published", "order"),
            },
        ),
        (
            "Metadata",
            {
                "fields": ("id", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def image_count(self, obj: Project) -> int:
        return obj.images.count()

    image_count.short_description = "Photos"
