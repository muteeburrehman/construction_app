"""Service model for residential and commercial general contracting capabilities."""
from django.db import models
from django.utils.text import slugify
from apps.core.models.base import BaseModel


class PublishedManager(models.Manager):
    """Filters only published records by default."""

    def get_queryset(self):
        return super().get_queryset().filter(is_published=True)


class Service(BaseModel):
    """Contractor service categories (Custom Residential & Commercial)."""

    CATEGORY_RESIDENTIAL = "residential"
    CATEGORY_COMMERCIAL = "commercial"
    CATEGORY_CHOICES = [
        (CATEGORY_RESIDENTIAL, "Custom Residential"),
        (CATEGORY_COMMERCIAL, "Custom Commercial & Winery"),
    ]

    slug = models.SlugField(max_length=120, unique=True, db_index=True, blank=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, db_index=True)
    summary = models.TextField(help_text="Short executive summary for cards and headers")
    body = models.TextField(help_text="In-depth service description and methodology")
    hero_image = models.ImageField(upload_to="services/heroes/", blank=True, null=True)
    capabilities = models.JSONField(
        default=list,
        blank=True,
        help_text="List of key capability bullet points (strings)",
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)

    objects = models.Manager()
    published = PublishedManager()

    class Meta(BaseModel.Meta):
        verbose_name = "Service"
        verbose_name_plural = "Services"
        ordering = ["order", "title"]
        indexes = [
            models.Index(fields=["category", "is_published"]),
            models.Index(fields=["is_published", "order"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.get_category_display()})"

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Service.objects.filter(slug=slug).exclude(id=self.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
