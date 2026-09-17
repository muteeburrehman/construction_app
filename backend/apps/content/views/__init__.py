"""Content views package."""
from .services import ServiceListView, ServiceDetailView
from .projects import ProjectListView, ProjectDetailView
from .testimonials import TestimonialListView
from .site_settings import SiteSettingsView

__all__ = [
    "ServiceListView",
    "ServiceDetailView",
    "ProjectListView",
    "ProjectDetailView",
    "TestimonialListView",
    "SiteSettingsView",
]
