"""Selectors for querying cached SiteSettings."""
from apps.content.models.site_settings import SiteSettings


def get_site_settings() -> SiteSettings:
    """Retrieve singleton site configuration (cached 15 minutes)."""
    return SiteSettings.get_settings()
