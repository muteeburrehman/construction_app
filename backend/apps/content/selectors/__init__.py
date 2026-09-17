"""Content selectors package."""
from .services import get_services, get_service_by_slug
from .projects import (
    get_projects,
    get_featured_projects,
    get_project_by_slug,
)
from .testimonials import get_testimonials
from .site_settings import get_site_settings

__all__ = [
    "get_services",
    "get_service_by_slug",
    "get_projects",
    "get_featured_projects",
    "get_project_by_slug",
    "get_testimonials",
    "get_site_settings",
]
