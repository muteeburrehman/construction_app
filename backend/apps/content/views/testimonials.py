"""Views for Testimonials endpoint."""
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from apps.content.selectors.testimonials import get_testimonials
from apps.content.serializers.testimonial import TestimonialSerializer


class TestimonialListView(APIView):
    """List published client testimonials."""

    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="List Testimonials",
        description="Retrieve all published client quotes and endorsements.",
        responses={200: TestimonialSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        testimonials = get_testimonials()
        serializer = TestimonialSerializer(testimonials, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
