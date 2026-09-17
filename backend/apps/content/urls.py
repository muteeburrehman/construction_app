from django.urls import path
from apps.content.views import (
    ServiceListView,
    ServiceDetailView,
    ProjectListView,
    ProjectDetailView,
    TestimonialListView,
    SiteSettingsView,
)

urlpatterns = [
    path("services/", ServiceListView.as_view(), name="service-list"),
    path("services/<slug:slug>/", ServiceDetailView.as_view(), name="service-detail"),
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<slug:slug>/", ProjectDetailView.as_view(), name="project-detail"),
    path("testimonials/", TestimonialListView.as_view(), name="testimonial-list"),
    path("site-settings/", SiteSettingsView.as_view(), name="site-settings"),
]
