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
        default="Apex Construction Group",
        help_text="Legal business entity name",
    )
    tagline = models.CharField(
        max_length=255,
        default="Premier Custom Residential & Commercial Builders",
        help_text="Brand headline",
    )
    phone = models.CharField(max_length=30, default="707-555-0192")
    email = models.EmailField(default="info@muteeblabs.com")
    license_number = models.CharField(max_length=50, default="Licensed & Insured (Lic. #849201)")
    founding_year = models.PositiveIntegerField(default=1998)

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
    linkedin_url = models.URLField(
        blank=True,
        default="",
    )
    facebook_url = models.URLField(
        blank=True,
        default="",
    )
    youtube_url = models.URLField(
        blank=True,
        default="",
    )

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

    @classmethod
    def get_solo(cls):
        """Convenience alias for get_settings."""
        return cls.get_settings()
