"""Unit and performance tests for Content models, selectors, and API endpoints."""
import pytest
from django.core.cache import cache
from rest_framework.test import APIClient
from apps.content.models.service import Service
from apps.content.models.project import Project
from apps.content.models.project_image import ProjectImage
from apps.content.models.testimonial import Testimonial
from apps.content.models.site_settings import SiteSettings, SITE_SETTINGS_CACHE_KEY


@pytest.fixture(autouse=True)
def clear_cache():
    """Clear cache before each test run."""
    cache.clear()
    yield
    cache.clear()


@pytest.mark.django_db
class TestContentEndpoints:
    @pytest.fixture(autouse=True)
    def setup_client(self):
        self.client = APIClient()

    def test_services_list_query_count(self, django_assert_num_queries):
        # Create 5 services
        for i in range(5):
            Service.objects.create(
                title=f"Service {i}",
                category=Service.CATEGORY_RESIDENTIAL if i % 2 == 0 else Service.CATEGORY_COMMERCIAL,
                summary=f"Summary {i}",
                body=f"Body {i}",
                order=i,
                is_published=True,
            )

        # Expected: exactly 1 query to fetch published services
        with django_assert_num_queries(1):
            response = self.client.get("/api/v1/services/")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5

    def test_service_detail_query_count(self, django_assert_num_queries):
        service = Service.objects.create(
            title="Custom Framing",
            slug="custom-framing",
            category=Service.CATEGORY_RESIDENTIAL,
            summary="Framing summary",
            body="Framing body",
            is_published=True,
        )

        # Expected: exactly 1 query to get service by slug
        with django_assert_num_queries(1):
            response = self.client.get(f"/api/v1/services/{service.slug}/")

        assert response.status_code == 200
        assert response.json()["slug"] == "custom-framing"

    def test_project_list_fixed_queries_n_plus_one_proof(self, django_assert_num_queries):
        """
        Proof against N+1:
        Creating 12 projects, each with 5 images and linked service.
        Query count must remain exactly 3:
        1 count query + 1 project list with joined service + 1 prefetch for all images.
        """
        service = Service.objects.create(
            title="Residential Estates",
            category=Service.CATEGORY_RESIDENTIAL,
            summary="High end estates",
            body="Estate details",
        )

        # Create 12 projects with 5 images each
        for p_idx in range(12):
            project = Project.objects.create(
                title=f"Napa Estate #{p_idx + 1}",
                service=service,
                category=Service.CATEGORY_RESIDENTIAL,
                location="St. Helena, CA",
                year=2020 + (p_idx % 5),
                scope="Ground-up estate",
                summary="Project summary",
                body="Full project narrative",
                is_featured=(p_idx < 4),
                order=p_idx,
                is_published=True,
            )
            # Add 5 images per project
            for img_idx in range(5):
                ProjectImage.objects.create(
                    project=project,
                    image=f"projects/gallery/fake_image_{p_idx}_{img_idx}.jpg",
                    alt_text=f"Architectural view {img_idx} of estate {p_idx}",
                    order=img_idx,
                    is_cover=(img_idx == 0),
                )

        # Expected: exactly 3 queries regardless of 60 images across 12 projects
        with django_assert_num_queries(3):
            response = self.client.get("/api/v1/projects/")

        assert response.status_code == 200
        data = response.json()
        assert data["count"] == 12
        assert len(data["results"]) == 12
        # Verify cover image is populated without extra queries
        for item in data["results"]:
            assert item["cover_image"] is not None
            assert item["cover_image"]["alt_text"] != ""

    def test_project_detail_query_count(self, django_assert_num_queries):
        service = Service.objects.create(
            title="Commercial Facilities",
            category=Service.CATEGORY_COMMERCIAL,
            summary="Winery facilities",
            body="Winery details",
        )
        project = Project.objects.create(
            title="Rutherford Tasting Salon",
            slug="rutherford-tasting-salon",
            service=service,
            category=Service.CATEGORY_COMMERCIAL,
            location="Rutherford, CA",
            year=2023,
            scope="4,000 sq ft pavilion",
            summary="Salon summary",
            body="Rich body description",
            is_published=True,
        )
        for i in range(4):
            ProjectImage.objects.create(
                project=project,
                image=f"projects/gallery/salon_{i}.jpg",
                alt_text=f"Salon detail photo {i}",
                order=i,
                is_cover=(i == 0),
            )

        # Expected: exactly 2 queries:
        # 1 project fetch with joined service + 1 prefetch of all 4 images
        with django_assert_num_queries(2):
            response = self.client.get(f"/api/v1/projects/{project.slug}/")

        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "rutherford-tasting-salon"
        assert len(data["images"]) == 4

    def test_testimonials_list_query_count(self, django_assert_num_queries):
        for i in range(3):
            Testimonial.objects.create(
                author=f"Author {i}",
                role_or_location=f"Location {i}",
                quote=f"Quote text {i}",
                order=i,
                is_published=True,
            )

        # Expected: exactly 1 query with select_related project
        with django_assert_num_queries(1):
            response = self.client.get("/api/v1/testimonials/")

        assert response.status_code == 200
        assert len(response.json()) == 3

    def test_site_settings_cached_queries(self, django_assert_num_queries):
        SiteSettings.objects.create(
            company_name="Apex Construction Group",
            phone="707-555-0192",
            email="info@muteeblabs.com",
            license_number="Licensed & Insured (Lic. #849201)",
        )

        # First hit: 1 query to fetch row and populate cache
        with django_assert_num_queries(1):
            response1 = self.client.get("/api/v1/site-settings/")
        assert response1.status_code == 200

        # Second hit: 0 queries (served directly from 15-min cache)
        with django_assert_num_queries(0):
            response2 = self.client.get("/api/v1/site-settings/")
        assert response2.status_code == 200
        assert response2.json()["license_number"] == "Licensed & Insured (Lic. #849201)"
