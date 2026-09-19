"""Views for public inquiries submission and staff administration."""
from rest_framework import generics, viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models.inquiry import Inquiry
from .serializers import InquiryCreateSerializer, InquiryAdminSerializer


class InquiryCreateView(generics.CreateAPIView):
    """Public endpoint allowing website visitors to submit a contact inquiry."""

    serializer_class = InquiryCreateSerializer
    permission_classes = [AllowAny]
    throttle_scope = "inquiries"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        return Response(
            {
                "success": True,
                "message": "Thank you for reaching out. Eric Sherwood Construction will be in touch shortly.",
                "inquiry_id": str(inquiry.id),
            },
            status=status.HTTP_201_CREATED,
        )


class InquiryAdminViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for reviewing and managing client inquiries."""

    queryset = Inquiry.objects.all().order_by("-created_at")
    serializer_class = InquiryAdminSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "email", "phone", "project_location", "message"]
    ordering_fields = ["created_at", "status", "project_type"]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs
