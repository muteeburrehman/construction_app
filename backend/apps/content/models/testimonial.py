"""Testimonial model for client quotes and project endorsements."""
from django.db import models
from apps.core.models.base import BaseModel
from .project import Project
from .service import PublishedManager


class Testimonial(BaseModel):
    """Client testimonial or owner endorsement."""

    author = models.CharField(max_length=150, help_text="Client or architect name")
    role_or_location = models.CharField(
        max_length=150,
        help_text="e.g. Estate Owner, Silverado Trail or Residential Client, St. Helena",
    )
    quote = models.TextField(help_text="Client quotation")
    project = models.ForeignKey(
        Project,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="testimonials",
        help_text="Optional linked project",
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)

    objects = models.Manager()
    published = PublishedManager()

    class Meta(BaseModel.Meta):
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"
        ordering = ["order", "-created_at"]
        indexes = [
            models.Index(fields=["is_published", "order"]),
        ]

    def __str__(self) -> str:
        return f"{self.author} ({self.role_or_location})"
