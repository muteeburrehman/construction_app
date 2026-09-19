"""Centralized administrative API URL routes for React Admin Panel."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.content.views.admin import (
    ProjectAdminViewSet,
    ServiceAdminViewSet,
    TestimonialAdminViewSet,
    SiteSettingsAdminView,
    AdminDashboardStatsView,
)
from apps.inquiries.views import InquiryAdminViewSet
from apps.chatbot.views import FAQAdminViewSet, ChatLogAdminListView

router = DefaultRouter()
router.register(r"projects", ProjectAdminViewSet, basename="admin_projects")
router.register(r"services", ServiceAdminViewSet, basename="admin_services")
router.register(r"testimonials", TestimonialAdminViewSet, basename="admin_testimonials")
router.register(r"inquiries", InquiryAdminViewSet, basename="admin_inquiries")
router.register(r"faqs", FAQAdminViewSet, basename="admin_faqs")

urlpatterns = [
    path("stats/", AdminDashboardStatsView.as_view(), name="admin_dashboard_stats"),
    path("settings/", SiteSettingsAdminView.as_view(), name="admin_site_settings"),
    path("chat-logs/", ChatLogAdminListView.as_view(), name="admin_chat_logs"),
    path("", include(router.urls)),
]
