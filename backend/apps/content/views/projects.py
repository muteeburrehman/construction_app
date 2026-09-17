"""Views for Project endpoints."""
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiParameter
from apps.content.selectors.projects import get_projects, get_project_by_slug
from apps.content.serializers.project import ProjectListSerializer, ProjectDetailSerializer


class StandardProjectPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class ProjectListView(APIView):
    """List construction projects with pagination and category/featured filtering."""

    authentication_classes = []
    permission_classes = []
    pagination_class = StandardProjectPagination

    @extend_schema(
        summary="List Projects",
        description="Retrieve paginated list of published construction projects with prefetched images.",
        parameters=[
            OpenApiParameter(
                name="category",
                type=str,
                description="Filter by category (residential or commercial)",
                required=False,
            ),
            OpenApiParameter(
                name="featured",
                type=bool,
                description="Filter by featured flag (true or false)",
                required=False,
            ),
            OpenApiParameter(
                name="page",
                type=int,
                description="Page number (12 items per page)",
                required=False,
            ),
        ],
        responses={200: ProjectListSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        category = request.query_params.get("category")
        featured_param = request.query_params.get("featured")
        featured = None
        if featured_param is not None:
            featured = featured_param.lower() in ["true", "1", "yes"]

        projects_qs = get_projects(category=category, featured=featured)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(projects_qs, request, view=self)
        if page is not None:
            serializer = ProjectListSerializer(page, many=True, context={"request": request})
            return paginator.get_paginated_response(serializer.data)

        serializer = ProjectListSerializer(projects_qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectDetailView(APIView):
    """Retrieve full project details with ordered image gallery."""

    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="Get Project Detail",
        description="Retrieve a single published project by unique slug, including its ordered photography gallery.",
        responses={200: ProjectDetailSerializer, 404: dict},
    )
    def get(self, request: Request, slug: str) -> Response:
        project = get_project_by_slug(slug=slug)
        if not project:
            return Response({"detail": f"Project with slug '{slug}' not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProjectDetailSerializer(project, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
