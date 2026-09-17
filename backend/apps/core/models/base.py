"""Base abstract model for all models in the project."""

import uuid

from django.db import models


class BaseModel(models.Model):
    """Abstract base model with UUID primary key and timestamp tracking."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier (UUIDv4)",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when the record was created",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the record was last modified",
    )

    class Meta:
        abstract = True
        ordering = ["-created_at"]
