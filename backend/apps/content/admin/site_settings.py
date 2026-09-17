"""Admin configuration for SiteSettings singleton model."""
from django.contrib import admin
from apps.content.models.site_settings import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ["company_name", "phone", "email", "license_number", "founding_year", "updated_at"]
    readonly_fields = ["id", "created_at", "updated_at"]

    def has_add_permission(self, request) -> bool:
        # Enforce singleton in admin: cannot add if one exists
        if SiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None) -> bool:
        # Cannot delete singleton settings
        return False
