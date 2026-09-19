"""Serializers for chatbot interactions and FAQ management."""
from rest_framework import serializers
from .models import FAQ, ChatLog


class ChatMessageRequestSerializer(serializers.Serializer):
    """Payload sent by public chat widget."""

    message = serializers.CharField(max_length=1000, required=True)
    session_id = serializers.CharField(max_length=100, required=False, default="", allow_blank=True)


class FAQSerializer(serializers.ModelSerializer):
    """Admin and public serializer for FAQ knowledge items."""

    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = FAQ
        fields = [
            "id",
            "question",
            "answer",
            "category",
            "category_display",
            "keywords",
            "order",
            "is_active",
            "is_suggested",
            "helpful_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "category_display"]


class ChatLogSerializer(serializers.ModelSerializer):
    """Admin serializer for viewing visitor question logs and response sources."""

    source_display = serializers.CharField(source="get_source_display", read_only=True)

    class Meta:
        model = ChatLog
        fields = [
            "id",
            "session_id",
            "user_message",
            "response_text",
            "source",
            "source_display",
            "matched_intent",
            "is_helpful",
            "created_at",
        ]
        read_only_fields = fields
