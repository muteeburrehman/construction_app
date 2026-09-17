"""SiteSettings singleton model for business metadata and contact info."""
from django.core.cache import cache
from django.db import models
from apps.core.models.base import BaseModel

SITE_SETTINGS_CACHE_KEY = "site_settings_cache"
CACHE_TIMEOUT_SECONDS = 60 * 15  # 15 minutes


class SiteSettings(BaseModel):
    """Singleton site configuration and business credentials."""

    company_name = models.CharField(
        max_length=150,
        default="Eric Sherwood Construction",
        help_text="Legal business entity name",
    )
    tagline = models.CharField(
        max_length=255,
        default="Building in the Napa Valley since 1979",
        help_text="Brand headline",
    )
    phone = models.CharField(max_length=30, default="707-255-3875")
    email = models.EmailField(default="eric@ericsherwoodconstruction.com")
    license_number = models.CharField(max_length=50, default="CSLB Lic. 902560")
    founding_year = models.PositiveIntegerField(default=1979)

    # Address
    street_address = models.CharField(max_length=200, blank=True, default="")
    city = models.CharField(max_length=100, default="Napa")
    state = models.CharField(max_length=50, default="California")
    postal_code = models.CharField(max_length=20, default="94558")
    hours = models.CharField(
        max_length=100,
        default="Monday – Friday: 7:00 AM – 5:00 PM PST",
        help_text="Operating hours",
    )
    service_area = models.CharField(
        max_length=200,
        default="Napa County, Sonoma County, St. Helena, Yountville, Calistoga",
    )

    # Socials
    linkedin_url = models.URLField(blank=True, default="https://www.linkedin.com")
    facebook_url = models.URLField(blank=True, default="https://www.facebook.com")
    youtube_url = models.URLField(blank=True, default="https://www.youtube.com")

    class Meta(BaseModel.Meta):
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self) -> str:
        return f"{self.company_name} Settings ({self.license_number})"

    def save(self, *args, **kwargs) -> None:
        # Enforce singleton pattern: only one record exists
        self.pk = self.id or self.pk
        super().save(*args, **kwargs)
        cache.delete(SITE_SETTINGS_CACHE_KEY)

    def delete(self, *args, **kwargs):
        cache.delete(SITE_SETTINGS_CACHE_KEY)
        return super().delete(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Fetches singleton settings with 15-minute caching."""
        settings_obj = cache.get(SITE_SETTINGS_CACHE_KEY)
        if not settings_obj:
            settings_obj = cls.objects.first()
            if not settings_obj:
                settings_obj = cls.objects.create()
            cache.set(SITE_SETTINGS_CACHE_KEY, settings_obj, CACHE_TIMEOUT_SECONDS)
        return settings_obj
