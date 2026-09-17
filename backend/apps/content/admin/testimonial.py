"""Admin configuration for Testimonial model."""
from django.contrib import admin
from apps.content.models.testimonial import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["author", "role_or_location", "project", "is_published", "order"]
    list_filter = ["is_published"]
    search_fields = ["author", "role_or_location", "quote"]
    list_select_related = ["project"]
    readonly_fields = ["id", "created_at", "updated_at"]
    ordering = ["order", "-created_at"]
