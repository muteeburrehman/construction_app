"""Health check endpoint for container probes and load balancers."""

from django.db import connection
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    """Health check endpoint returning application and database status."""

    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="Service Health Check",
        description="Returns system status and database connectivity.",
        responses={
            200: OpenApiResponse(description="System healthy"),
            503: OpenApiResponse(description="Database connection failed"),
        },
    )
    def get(self, request, *args, **kwargs):
        db_status = "connected"
        try:
            connection.ensure_connection()
        except Exception as exc:
            db_status = f"error: {str(exc)}"
            return Response(
                {
                    "status": "unhealthy",
                    "database": db_status,
                },
                status=status.HTTP_533_SERVICE_UNAVAILABLE
                if hasattr(status, "HTTP_533")
                else status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "status": "healthy",
                "database": db_status,
                "service": "construction-platform-api",
            },
            status=status.HTTP_200_OK,
        )
