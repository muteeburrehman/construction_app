"""Project model representing completed and active construction builds."""
from django.db import models
from django.utils.text import slugify
from apps.core.models.base import BaseModel
from .service import Service, PublishedManager


class Project(BaseModel):
    """Construction project portfolio item."""

    slug = models.SlugField(max_length=140, unique=True, db_index=True, blank=True)
    title = models.CharField(max_length=200)
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="projects",
        help_text="Associated service division",
    )
    category = models.CharField(
        max_length=30,
        choices=Service.CATEGORY_CHOICES,
        default=Service.CATEGORY_RESIDENTIAL,
        db_index=True,
        help_text="Primary category filter",
    )
    location = models.CharField(max_length=150, help_text="e.g. Yountville, CA")
    year = models.PositiveIntegerField(db_index=True, help_text="Year completed, e.g. 2023")
    scope = models.CharField(max_length=200, help_text="e.g. Ground-up 6,500 sq ft custom residential build")
    summary = models.TextField(help_text="Brief card overview")
    body = models.TextField(help_text="Detailed project description, structural methods, and materials")
    is_featured = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Featured projects displayed on the home page",
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)

    objects = models.Manager()
    published = PublishedManager()

    class Meta(BaseModel.Meta):
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ["order", "-year", "-created_at"]
        indexes = [
            models.Index(fields=["is_published", "is_featured"]),
            models.Index(fields=["category", "is_published"]),
            models.Index(fields=["is_published", "order", "-year"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} — {self.location} ({self.year})"

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exclude(id=self.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        if self.service and not self.category:
            self.category = self.service.category
        super().save(*args, **kwargs)

    @property
    def cover_image(self):
        """Returns the designated cover image or first project image."""
        cover = self.images.filter(is_cover=True).first()
        if not cover:
            cover = self.images.first()
        return cover
