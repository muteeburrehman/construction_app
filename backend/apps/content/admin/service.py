"""Admin configuration for Service model."""
from django.contrib import admin
from apps.content.models.service import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "order", "is_published", "created_at"]
    list_filter = ["category", "is_published"]
    search_fields = ["title", "summary", "body"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["id", "created_at", "updated_at"]
    ordering = ["order", "title"]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "slug",
                    "category",
                    "summary",
                    "body",
                    "hero_image",
                    "capabilities",
                )
            },
        ),
        (
            "Visibility & Ordering",
            {
                "fields": ("order", "is_published"),
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
