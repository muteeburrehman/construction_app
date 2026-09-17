"""Views for Service endpoints."""
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiParameter
from apps.content.selectors.services import get_services, get_service_by_slug
from apps.content.serializers.service import ServiceSerializer


class ServiceListView(APIView):
    """List general contractor services, optionally filtered by category."""

    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="List Services",
        description="Retrieve all published services, optionally filtered by category (residential or commercial).",
        parameters=[
            OpenApiParameter(
                name="category",
                type=str,
                description="Filter by category: residential or commercial",
                required=False,
            ),
        ],
        responses={200: ServiceSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        category = request.query_params.get("category")
        services = get_services(category=category)
        serializer = ServiceSerializer(services, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ServiceDetailView(APIView):
    """Retrieve details for a single service by slug."""

    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="Get Service Detail",
        description="Retrieve a single published service by its unique slug.",
        responses={200: ServiceSerializer, 404: dict},
    )
    def get(self, request: Request, slug: str) -> Response:
        service = get_service_by_slug(slug=slug)
        if not service:
            return Response({"detail": f"Service with slug '{slug}' not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(service, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
