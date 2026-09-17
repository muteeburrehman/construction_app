"""Selectors for querying Service records."""
from django.db.models import QuerySet
from apps.content.models.service import Service


def get_services(category: str | None = None) -> QuerySet[Service]:
    """Retrieve published services, optionally filtered by category."""
    qs = Service.published.all().order_by("order", "title")
    if category:
        qs = qs.filter(category=category)
    return qs


def get_service_by_slug(slug: str) -> Service | None:
    """Retrieve a single published service by unique slug."""
    try:
        return Service.published.get(slug=slug)
    except Service.DoesNotExist:
        return None
