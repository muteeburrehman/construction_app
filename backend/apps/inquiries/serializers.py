"""Serializers for Inquiry creation and admin management."""
from rest_framework import serializers
from .models.inquiry import Inquiry


class InquiryCreateSerializer(serializers.ModelSerializer):
    """Public serializer for website visitors submitting an estimate request."""

    class Meta:
        model = Inquiry
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "project_type",
            "project_location",
            "estimated_budget",
            "timeline",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class InquiryAdminSerializer(serializers.ModelSerializer):
    """Admin serializer for reviewing, updating status, and adding internal notes."""

    status_display = serializers.CharField(source="get_status_display", read_only=True)
    project_type_display = serializers.CharField(source="get_project_type_display", read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "project_type",
            "project_type_display",
            "project_location",
            "estimated_budget",
            "timeline",
            "message",
            "status",
            "status_display",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "status_display", "project_type_display"]
