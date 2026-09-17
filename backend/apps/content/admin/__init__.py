"""Content admin package."""
from .service import ServiceAdmin
from .project import ProjectAdmin
from .testimonial import TestimonialAdmin
from .site_settings import SiteSettingsAdmin

__all__ = [
    "ServiceAdmin",
    "ProjectAdmin",
    "TestimonialAdmin",
    "SiteSettingsAdmin",
]
