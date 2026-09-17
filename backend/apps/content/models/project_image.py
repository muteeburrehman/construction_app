"""ProjectImage model for architectural photography and galleries."""
from django.core.exceptions import ValidationError
from django.db import models
from apps.core.models.base import BaseModel
from .project import Project


class ProjectImage(BaseModel):
    """High-resolution architectural photography item associated with a Project."""

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images",
        help_text="Associated project",
    )
    image = models.ImageField(upload_to="projects/gallery/")
    alt_text = models.CharField(
        max_length=255,
        help_text="Accessible description of the architectural photo (mandatory for accessibility/SEO)",
    )
    caption = models.CharField(max_length=255, blank=True, help_text="Optional editorial caption")
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_cover = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Designate this image as the primary project card cover",
    )

    class Meta(BaseModel.Meta):
        verbose_name = "Project Image"
        verbose_name_plural = "Project Images"
        ordering = ["order", "created_at"]
        indexes = [
            models.Index(fields=["project", "order"]),
            models.Index(fields=["project", "is_cover"]),
        ]

    def __str__(self) -> str:
        cover_tag = " [Cover]" if self.is_cover else ""
        return f"{self.project.title} - Image #{self.order}{cover_tag}"

    def clean(self) -> None:
        super().clean()
        if not self.alt_text or not self.alt_text.strip():
            raise ValidationError({"alt_text": "Alt text is required and cannot be empty or whitespace only."})

    def save(self, *args, **kwargs) -> None:
        self.full_clean()
        super().save(*args, **kwargs)
