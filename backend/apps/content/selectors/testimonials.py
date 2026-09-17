"""Selectors for querying Testimonial records."""
from django.db.models import QuerySet
from apps.content.models.testimonial import Testimonial


def get_testimonials() -> QuerySet[Testimonial]:
    """Retrieve published testimonials with project foreign key preloaded."""
    return (
        Testimonial.published.all()
        .select_related("project")
        .order_by("order", "-created_at")
    )
