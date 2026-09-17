"""Selectors for querying Project records with zero N+1 queries."""
from django.db.models import Prefetch, QuerySet
from apps.content.models.project import Project
from apps.content.models.project_image import ProjectImage


def _get_project_base_queryset() -> QuerySet[Project]:
    """Base queryset prefetching ordered images and selecting service foreign key."""
    return (
        Project.published.all()
        .select_related("service")
        .prefetch_related(
            Prefetch(
                "images",
                queryset=ProjectImage.objects.order_by("order", "created_at"),
            )
        )
    )


def get_projects(
    category: str | None = None,
    featured: bool | None = None,
) -> QuerySet[Project]:
    """Retrieve published projects filtered by category and/or featured status."""
    qs = _get_project_base_queryset().order_by("order", "-year", "-created_at")
    if category:
        qs = qs.filter(category=category)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs


def get_featured_projects(limit: int = 4) -> QuerySet[Project]:
    """Retrieve top featured published projects for home page showcase."""
    return get_projects(featured=True)[:limit]


def get_project_by_slug(slug: str) -> Project | None:
    """Retrieve a single published project with preloaded images by unique slug."""
    try:
        return _get_project_base_queryset().get(slug=slug)
    except Project.DoesNotExist:
        return None
