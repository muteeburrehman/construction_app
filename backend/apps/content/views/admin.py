"""Admin views and ViewSets with strict N+1 query elimination and aggregated statistics."""
from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Count, Q

from apps.content.models.project import Project
from apps.content.models.project_image import ProjectImage
from apps.content.models.service import Service
from apps.content.models.testimonial import Testimonial
from apps.content.models.site_settings import SiteSettings
from apps.inquiries.models.inquiry import Inquiry
from apps.chatbot.models import FAQ, ChatLog

from apps.content.serializers.admin import (
    ProjectAdminSerializer,
    ProjectImageAdminSerializer,
    ServiceAdminSerializer,
    TestimonialAdminSerializer,
    SiteSettingsAdminSerializer,
)
from apps.inquiries.serializers import InquiryAdminSerializer
from apps.chatbot.serializers import ChatLogSerializer


class ProjectAdminViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet for Projects.
    Uses select_related and prefetch_related to guarantee zero N+1 queries.
    """

    permission_classes = [IsAdminUser]
    serializer_class = ProjectAdminSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "location", "scope", "summary", "body"]
    ordering_fields = ["order", "year", "created_at", "title"]

    def get_queryset(self):
        return (
            Project.objects.all()
            .select_related("service")
            .prefetch_related("images")
            .order_by("order", "-year", "-created_at")
        )

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        """Upload an image to a project gallery."""
        project = self.get_object()
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        alt_text = request.data.get("alt_text", "")
        caption = request.data.get("caption", "")
        is_cover = str(request.data.get("is_cover", "false")).lower() in ["true", "1"]
        order = int(request.data.get("order", project.images.count()))

        if is_cover:
            project.images.update(is_cover=False)

        project_image = ProjectImage.objects.create(
            project=project,
            image=image_file,
            alt_text=alt_text,
            caption=caption,
            is_cover=is_cover,
            order=order,
        )
        serializer = ProjectImageAdminSerializer(project_image, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path="images/(?P<image_id>[^/.]+)")
    def delete_image(self, request, pk=None, image_id=None):
        """Delete an image from a project gallery."""
        project = self.get_object()
        try:
            image = project.images.get(id=image_id)
            image.delete()
            return Response({"success": True, "message": "Image deleted."}, status=status.HTTP_200_OK)
        except ProjectImage.DoesNotExist:
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["patch"], url_path="images/(?P<image_id>[^/.]+)/set-cover")
    def set_cover_image(self, request, pk=None, image_id=None):
        """Designate an image as the cover image for this project."""
        project = self.get_object()
        try:
            target_image = project.images.get(id=image_id)
            project.images.update(is_cover=False)
            target_image.is_cover = True
            target_image.save()
            return Response({"success": True, "message": "Cover image updated."}, status=status.HTTP_200_OK)
        except ProjectImage.DoesNotExist:
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)


class ServiceAdminViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for Services, annotating projects_count to prevent N+1 queries."""

    permission_classes = [IsAdminUser]
    serializer_class = ServiceAdminSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "summary", "body"]
    ordering_fields = ["order", "title"]

    def get_queryset(self):
        return (
            Service.objects.all()
            .annotate(project_count=Count("projects"))
            .order_by("order", "title")
        )


class TestimonialAdminViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for Testimonials with preloaded project relationship."""

    permission_classes = [IsAdminUser]
    serializer_class = TestimonialAdminSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["author", "role_or_location", "quote"]
    ordering_fields = ["order", "created_at"]

    def get_queryset(self):
        return (
            Testimonial.objects.all()
            .select_related("project")
            .order_by("order", "-created_at")
        )


class SiteSettingsAdminView(APIView):
    """Admin endpoint for viewing and editing site settings."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        settings = SiteSettings.get_solo()
        serializer = SiteSettingsAdminSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings = SiteSettings.get_solo()
        serializer = SiteSettingsAdminSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AdminDashboardStatsView(APIView):
    """
    Aggregates metrics and recent activity for the admin dashboard.
    Performs high-performance database-level aggregation to prevent N+1 queries.
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        # 1. Projects aggregation
        proj_stats = Project.objects.aggregate(
            total=Count("id"),
            published=Count("id", filter=Q(is_published=True)),
            featured=Count("id", filter=Q(is_featured=True)),
        )

        # 2. Inquiries aggregation
        inquiry_stats = Inquiry.objects.aggregate(
            total=Count("id"),
            new=Count("id", filter=Q(status=Inquiry.STATUS_NEW)),
            in_progress=Count("id", filter=Q(status=Inquiry.STATUS_IN_PROGRESS)),
            contacted=Count("id", filter=Q(status=Inquiry.STATUS_CONTACTED)),
        )

        # 3. Services & Testimonials aggregation
        service_count = Service.objects.count()
        testimonial_stats = Testimonial.objects.aggregate(
            total=Count("id"),
            published=Count("id", filter=Q(is_published=True)),
        )

        # 4. Chatbot knowledge & conversation stats
        faq_stats = FAQ.objects.aggregate(
            total=Count("id"),
            active=Count("id", filter=Q(is_active=True)),
        )
        chat_stats = ChatLog.objects.aggregate(
            total_conversations=Count("id"),
            faq_resolved=Count("id", filter=Q(source=ChatLog.SOURCE_FAQ)),
            project_resolved=Count("id", filter=Q(source=ChatLog.SOURCE_PROJECT)),
            settings_resolved=Count("id", filter=Q(source=ChatLog.SOURCE_SETTINGS)),
        )

        # 5. Recent inquiries (limit 5) - zero N+1
        recent_inquiries = Inquiry.objects.all().order_by("-created_at")[:5]
        recent_inquiries_data = InquiryAdminSerializer(recent_inquiries, many=True).data

        # 6. Recent chat logs (limit 5) - zero N+1
        recent_chats = ChatLog.objects.all().order_by("-created_at")[:5]
        recent_chats_data = ChatLogSerializer(recent_chats, many=True).data

        return Response(
            {
                "stats": {
                    "projects": proj_stats,
                    "inquiries": inquiry_stats,
                    "services": {"total": service_count},
                    "testimonials": testimonial_stats,
                    "faq": faq_stats,
                    "chat": chat_stats,
                },
                "recent_inquiries": recent_inquiries_data,
                "recent_chats": recent_chats_data,
            }
        )
