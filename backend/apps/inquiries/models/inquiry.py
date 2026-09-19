"""Inquiry model for client estimate requests and contact submissions."""
from django.db import models
from apps.core.models.base import BaseModel


class Inquiry(BaseModel):
    """Estimate request or inquiry submitted from the website contact form."""

    STATUS_NEW = "NEW"
    STATUS_IN_PROGRESS = "IN_PROGRESS"
    STATUS_CONTACTED = "CONTACTED"
    STATUS_ARCHIVED = "ARCHIVED"

    STATUS_CHOICES = [
        (STATUS_NEW, "New"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_CONTACTED, "Contacted"),
        (STATUS_ARCHIVED, "Archived"),
    ]

    PROJECT_TYPE_RESIDENTIAL = "residential"
    PROJECT_TYPE_COMMERCIAL = "commercial"
    PROJECT_TYPE_ESTATE = "estate"
    PROJECT_TYPE_OTHER = "other"

    PROJECT_TYPE_CHOICES = [
        (PROJECT_TYPE_RESIDENTIAL, "Residential"),
        (PROJECT_TYPE_COMMERCIAL, "Commercial"),
        (PROJECT_TYPE_ESTATE, "Estate / Winery"),
        (PROJECT_TYPE_OTHER, "Other"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    project_type = models.CharField(
        max_length=30,
        choices=PROJECT_TYPE_CHOICES,
        default=PROJECT_TYPE_RESIDENTIAL,
        db_index=True,
    )
    project_location = models.CharField(max_length=200, blank=True, help_text="e.g. Napa, St. Helena")
    estimated_budget = models.CharField(max_length=100, blank=True)
    timeline = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_NEW,
        db_index=True,
    )
    notes = models.TextField(blank=True, help_text="Internal staff notes")

    class Meta(BaseModel.Meta):
        verbose_name = "Inquiry"
        verbose_name_plural = "Inquiries"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.name} — {self.project_type} ({self.get_status_display()})"
