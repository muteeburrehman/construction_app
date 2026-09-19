"""Models for local chatbot knowledge base (FAQ) and interaction logging."""
from django.db import models
from apps.core.models.base import BaseModel


class FAQ(BaseModel):
    """Admin-managed Knowledge Base question and answer item."""

    CATEGORY_GENERAL = "general"
    CATEGORY_RESIDENTIAL = "residential"
    CATEGORY_COMMERCIAL = "commercial"
    CATEGORY_PROCESS = "process"
    CATEGORY_PRICING = "pricing"
    CATEGORY_LICENSING = "licensing"

    CATEGORY_CHOICES = [
        (CATEGORY_GENERAL, "General"),
        (CATEGORY_RESIDENTIAL, "Residential"),
        (CATEGORY_COMMERCIAL, "Commercial"),
        (CATEGORY_PROCESS, "Process & Timeline"),
        (CATEGORY_PRICING, "Pricing & Billing"),
        (CATEGORY_LICENSING, "Licensing & Insurance"),
    ]

    question = models.CharField(max_length=500, help_text="Common question asked by prospective clients")
    answer = models.TextField(help_text="Detailed answer to return to the visitor")
    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default=CATEGORY_GENERAL,
        db_index=True,
    )
    keywords = models.CharField(
        max_length=500,
        blank=True,
        help_text="Comma-separated trigger words, e.g. 'license, cslb, insured, bonded'",
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    is_suggested = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Display as a quick suggestion chip in the public chat widget",
    )
    helpful_count = models.PositiveIntegerField(default=0)

    class Meta(BaseModel.Meta):
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ["order", "created_at"]
        indexes = [
            models.Index(fields=["is_active", "order"]),
            models.Index(fields=["is_suggested", "is_active"]),
        ]

    def __str__(self) -> str:
        return f"[{self.get_category_display()}] {self.question}"


class ChatLog(BaseModel):
    """Logs visitor questions and answers for admin insights and metrics."""

    SOURCE_FAQ = "faq"
    SOURCE_PROJECT = "project"
    SOURCE_SERVICE = "service"
    SOURCE_SETTINGS = "settings"
    SOURCE_FALLBACK = "fallback"

    SOURCE_CHOICES = [
        (SOURCE_FAQ, "FAQ Match"),
        (SOURCE_PROJECT, "Portfolio Search"),
        (SOURCE_SERVICE, "Service Lookup"),
        (SOURCE_SETTINGS, "Company Info"),
        (SOURCE_FALLBACK, "Fallback / Contact"),
    ]

    session_id = models.CharField(max_length=100, db_index=True, blank=True)
    user_message = models.TextField()
    response_text = models.TextField()
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default=SOURCE_FALLBACK,
        db_index=True,
    )
    matched_intent = models.CharField(max_length=150, blank=True)
    matched_item_id = models.CharField(max_length=100, blank=True)
    is_helpful = models.BooleanField(null=True, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Chat Log"
        verbose_name_plural = "Chat Logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["source", "-created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user_message[:40]}... -> {self.source}"
