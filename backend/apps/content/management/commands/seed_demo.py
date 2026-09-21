"""Management command to seed realistic demo data for Apex Construction Group."""
from pathlib import Path
from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from apps.content.models.service import Service
from apps.content.models.project import Project
from apps.content.models.project_image import ProjectImage
from apps.content.models.testimonial import Testimonial
from apps.content.models.site_settings import SiteSettings


class Command(BaseCommand):
    help = "Seeds database with Services, 8 Napa Valley Projects, Testimonials, and SiteSettings."

    def handle(self, *args, **options):
        self.stdout.write("Starting idempotent demo seeding...")

        media_assets = Path(settings.MEDIA_ROOT) / "downloaded_assets"

        def get_image_file(filename: str):
            filepath = media_assets / filename
            if filepath.exists():
                return File(open(filepath, "rb"), name=filename)
            return None

        # 1. SiteSettings (Singleton)
        site_settings, created = SiteSettings.objects.update_or_create(
            id=SiteSettings.objects.first().id if SiteSettings.objects.exists() else None,
            defaults={
                "company_name": "Apex Construction Group",
                "tagline": "Premier Custom Residential & Commercial Builders",
                "phone": "707-555-0192",
                "email": "info@muteeblabs.com",
                "license_number": "Licensed & Insured (Lic. #849201)",
                "founding_year": 1998,
                "city": "Napa",
                "state": "California",
                "postal_code": "94558",
                "hours": "Monday – Friday: 7:00 AM – 5:00 PM PST",
                "service_area": "Napa County, Sonoma County, St. Helena, Yountville, Calistoga, Rutherford, Oakville",
                "linkedin_url": "",
                "facebook_url": "",
                "youtube_url": "",
            },
        )
        self.stdout.write(self.style.SUCCESS(f"  [Settings] Seeded {site_settings.company_name}"))

        # 2. Services
        residential_service, _ = Service.objects.update_or_create(
            slug="custom-residential",
            defaults={
                "title": "Custom Residential Construction",
                "category": Service.CATEGORY_RESIDENTIAL,
                "summary": "Estate residences, ground-up architectural homes, and complex hill-terrain construction throughout Napa and Sonoma.",
                "body": (
                    "For over 25 years, Apex Construction Group has partnered with discerning homeowners "
                    "and renowned architects to build enduring residences. From complex hill foundations "
                    "and wildland-urban interface (WUI) compliance to precision timber framing and hand-finished stone, "
                    "every phase is directed with uncompromising master craftsmanship."
                ),
                "capabilities": [
                    "Ground-Up Estate Construction",
                    "Hillside Topography & Engineered Foundations",
                    "Historic Remodels & Architectural Additions",
                    "Wildland-Urban Interface (WUI) Fire Hardening",
                ],
                "order": 1,
                "is_published": True,
            },
        )
        res_hero = get_image_file("tower_exterior.jpg")
        if res_hero:
            residential_service.hero_image.save("tower_exterior.jpg", res_hero, save=True)

        commercial_service, _ = Service.objects.update_or_create(
            slug="custom-commercial",
            defaults={
                "title": "Custom Commercial & Winery Construction",
                "category": Service.CATEGORY_COMMERCIAL,
                "summary": "Winery hospitality pavilions, tasting rooms, production upgrades, and boutique commercial spaces.",
                "body": (
                    "Navigating commercial building standards, agricultural zoning, and tasting room hospitality "
                    "requirements requires specialized local experience. We deliver steel-framed structures, "
                    "climate-controlled barrel cellars, and guest pavilions that marry operational rigor with wine country aesthetics."
                ),
                "capabilities": [
                    "Winery Hospitality Pavilions & Tasting Rooms",
                    "Structural Steel & Timber Integration",
                    "Commercial Code & ADA Accessibility Compliance",
                    "Operating Facility Phased Upgrades",
                ],
                "order": 2,
                "is_published": True,
            },
        )
        com_hero = get_image_file("commercial_facility.jpg")
        if com_hero:
            commercial_service.hero_image.save("commercial_facility.jpg", com_hero, save=True)

        self.stdout.write(self.style.SUCCESS("  [Services] Seeded Residential & Commercial services"))

        # 3. Eight Projects
        projects_data = [
            {
                "slug": "silverado-trail-estate",
                "title": "Silverado Trail Estate",
                "service": residential_service,
                "category": Service.CATEGORY_RESIDENTIAL,
                "location": "Yountville, CA",
                "year": 2023,
                "scope": "Ground-up 6,800 sq ft limestone and Douglas fir residence + infinity pool",
                "summary": "An expansive valley-floor residence marrying precision timber framing with Napa limestone masonry.",
                "body": (
                    "Perched along the iconic Silverado Trail, this custom residence was constructed on an engineered "
                    "slab foundation to accommodate expansive valley soils. Hand-cut limestone walls anchor the structure, "
                    "while custom steel-framed glass curtain walls open directly into active vineyard rows. The interior "
                    "features tongue-and-groove cedar ceilings, a temperature-zoned 1,200-bottle wine room, and an open-plan "
                    "chef's kitchen with bookmatched quartzite countertops."
                ),
                "is_featured": True,
                "order": 1,
                "images": [
                    {"file": "tower_exterior.jpg", "alt": "Silverado Trail stone tower and exterior facade", "is_cover": True},
                    {"file": "custom_kitchen.png", "alt": "Custom culinary kitchen with limestone island and minimalist cabinetry", "is_cover": False},
                    {"file": "living_room.png", "alt": "Double-height living room with timber beam trusses and floor-to-ceiling glass", "is_cover": False},
                ],
            },
            {
                "slug": "st-helena-vineyard-residence",
                "title": "St. Helena Vineyard Residence",
                "service": residential_service,
                "category": Service.CATEGORY_RESIDENTIAL,
                "location": "St. Helena, CA",
                "year": 2022,
                "scope": "5,400 sq ft modern hillside residence + cantilevered terrace",
                "summary": "Steep-slope architectural build overlooking private cabernet sauvignon vineyard parcels.",
                "body": (
                    "Constructed into a 22-degree volcanic rock incline, this residence required extensive micropile "
                    "drilling and reinforced retaining walls. The design minimizes earth disruption through cantilevered steel "
                    "decks and non-combustible exterior siding specified for strict Wildland-Urban Interface compliance."
                ),
                "is_featured": True,
                "order": 2,
                "images": [
                    {"file": "spaced_house.jpg", "alt": "Modern hillside vineyard home exterior with cantilevered decks", "is_cover": True},
                    {"file": "living_room.png", "alt": "Warm wood interior living area with open vineyard views", "is_cover": False},
                ],
            },
            {
                "slug": "rutherford-winery-hospitality-pavilion",
                "title": "Rutherford Winery Hospitality Pavilion",
                "service": commercial_service,
                "category": Service.CATEGORY_COMMERCIAL,
                "location": "Rutherford, CA",
                "year": 2021,
                "scope": "4,200 sq ft glass and structural steel tasting pavilion and private salon",
                "summary": "Contemporary hospitality expansion for a heritage Napa Valley estate producer.",
                "body": (
                    "Designed to accommodate private tastings and collector events, this pavilion was constructed "
                    "while the winery maintained full production and daily public operations. Features include acoustic "
                    "slat wall paneling, polished aggregate concrete flooring, and motorized glass sliding pocket doors."
                ),
                "is_featured": True,
                "order": 3,
                "images": [
                    {"file": "commercial_facility.jpg", "alt": "Rutherford modern winery tasting pavilion and courtyard", "is_cover": True},
                ],
            },
            {
                "slug": "calistoga-hillside-retreat",
                "title": "Calistoga Hillside Retreat",
                "service": residential_service,
                "category": Service.CATEGORY_RESIDENTIAL,
                "location": "Calistoga, CA",
                "year": 2024,
                "scope": "4,800 sq ft concrete, steel, and timber retreat with integrated solar microgrid",
                "summary": "Off-grid capable estate home perched above Calistoga's northern valley floor.",
                "body": (
                    "Engineered for high fire resistance and thermal mass efficiency, using insulated board-formed "
                    "concrete exterior walls and standing-seam zinc roofing. The home features passive cooling corridors "
                    "and daylighting aligned with prevailing valley breezes."
                ),
                "is_featured": True,
                "order": 4,
                "images": [
                    {"file": "spaced_house.jpg", "alt": "Calistoga hillside retreat set against pine and oak grove", "is_cover": True},
                    {"file": "tower_exterior.jpg", "alt": "Stone entry tower detailing", "is_cover": False},
                ],
            },
            {
                "slug": "oakville-modern-farmhouse",
                "title": "Oakville Modern Farmhouse",
                "service": residential_service,
                "category": Service.CATEGORY_RESIDENTIAL,
                "location": "Oakville, CA",
                "year": 2020,
                "scope": "Complete architectural rehabilitation and 2,400 sq ft master wing addition",
                "summary": "Historic farmhouse revival honoring original 1920s proportions with modern framing.",
                "body": (
                    "Preserved the original heart-redwood framing elements while underpinning new seismic foundations. "
                    "Seamlessly unified the new master wing with reclaimed barnwood siding and high-efficiency radiant heating."
                ),
                "is_featured": False,
                "order": 5,
                "images": [
                    {"file": "custom_kitchen.png", "alt": "Modern farmhouse open kitchen with soapstone counters", "is_cover": True},
                ],
            },
            {
                "slug": "napa-valley-barrel-cellar-expansion",
                "title": "Napa Valley Barrel Cellar Expansion",
                "service": commercial_service,
                "category": Service.CATEGORY_COMMERCIAL,
                "location": "Napa, CA",
                "year": 2022,
                "scope": "Subterranean 3,500-barrel storage cellar and VIP tasting room",
                "summary": "Heavily reinforced sub-grade concrete barrel facility with precision climate controls.",
                "body": (
                    "Constructed to maintain consistent 55°F temperature and 75% relative humidity naturally. "
                    "Required deep excavation, waterproof bentonite membrane installation, and custom structural shotcrete arches."
                ),
                "is_featured": False,
                "order": 6,
                "images": [
                    {"file": "commercial_facility.jpg", "alt": "Subterranean tasting salon and barrel aging gallery", "is_cover": True},
                ],
            },
            {
                "slug": "atlas-peak-rebuild-estate",
                "title": "Atlas Peak Rebuild Estate",
                "service": residential_service,
                "category": Service.CATEGORY_RESIDENTIAL,
                "location": "Napa, CA",
                "year": 2019,
                "scope": "Non-combustible steel frame and stone custom residence",
                "summary": "Fire-rebuild custom home constructed to the most stringent WUI standards.",
                "body": (
                    "Reconstructed following the 2017 fires with non-vented roof assemblies, exterior fire shutters, "
                    "and ember-resistant micro-mesh screening. Features an independent 20,000-gallon dedicated fire draft reservoir."
                ),
                "is_featured": False,
                "order": 7,
                "images": [
                    {"file": "tower_exterior.jpg", "alt": "Atlas Peak stone masonry facade with steel pergola", "is_cover": True},
                    {"file": "spaced_house.jpg", "alt": "Panoramic mountain ridge view looking down on Napa Valley", "is_cover": False},
                ],
            },
            {
                "slug": "sonoma-valley-commercial-center",
                "title": "Sonoma Valley Commercial Facility",
                "service": commercial_service,
                "category": Service.CATEGORY_COMMERCIAL,
                "location": "Sonoma, CA",
                "year": 2023,
                "scope": "8,000 sq ft winery administrative headquarters and demonstration kitchen",
                "summary": "High-efficiency commercial building serving winery operations and culinary demonstrations.",
                "body": (
                    "Heavy timber post-and-beam construction paired with commercial culinary appliances and grease interceptors. "
                    "Delivered on time and materials with full budget accounting across three corporate shareholders."
                ),
                "is_featured": False,
                "order": 8,
                "images": [
                    {"file": "commercial_facility.jpg", "alt": "Sonoma commercial office and reception exterior", "is_cover": True},
                    {"file": "custom_kitchen.png", "alt": "Commercial stainless steel culinary preparation line", "is_cover": False},
                ],
            },
        ]

        for pdata in projects_data:
            images_spec = pdata.pop("images")
            proj, _ = Project.objects.update_or_create(
                slug=pdata["slug"],
                defaults=pdata,
            )
            # Remove existing images to allow idempotent fresh wiring
            proj.images.all().delete()
            for idx, img_spec in enumerate(images_spec):
                img_file = get_image_file(img_spec["file"])
                if img_file:
                    proj_img = ProjectImage(
                        project=proj,
                        alt_text=img_spec["alt"],
                        caption=img_spec.get("caption", ""),
                        order=idx + 1,
                        is_cover=img_spec.get("is_cover", False),
                    )
                    proj_img.image.save(img_spec["file"], img_file, save=True)

        self.stdout.write(self.style.SUCCESS(f"  [Projects] Seeded {len(projects_data)} projects with images"))

        # 4. Testimonials
        testimonials_data = [
            {
                "author": "David & Marcus L.",
                "role_or_location": "Estate Owners, Silverado Trail, Yountville",
                "quote": (
                    "The team was on site every morning before the sun cleared the ridge. Their transparent open-book "
                    "billing meant we knew where every dollar went, and the craftsmanship on our framing and stone masonry is unmatched."
                ),
                "project_slug": "silverado-trail-estate",
                "order": 1,
            },
            {
                "author": "Sarah K., Principal Architect",
                "role_or_location": "San Francisco & St. Helena Architectural Studio",
                "quote": (
                    "Working with Apex Construction Group is a true collaboration. They understand how to translate delicate architectural "
                    "details into durable, seismic-rated field reality and solve complex engineering issues before they become delays."
                ),
                "project_slug": "st-helena-vineyard-residence",
                "order": 2,
            },
            {
                "author": "Robert M., Managing Partner",
                "role_or_location": "Rutherford Estate Winery",
                "quote": (
                    "When expanding our tasting room, we couldn't afford downtime during harvest. The project leads phased the construction "
                    "flawlessly, delivered on schedule, and the finished millwork routinely receives compliments from our guests."
                ),
                "project_slug": "rutherford-winery-hospitality-pavilion",
                "order": 3,
            },
        ]

        for tdata in testimonials_data:
            proj = Project.objects.filter(slug=tdata.pop("project_slug")).first()
            Testimonial.objects.update_or_create(
                author=tdata["author"],
                defaults={
                    "role_or_location": tdata["role_or_location"],
                    "quote": tdata["quote"],
                    "project": proj,
                    "order": tdata["order"],
                    "is_published": True,
                },
            )

        self.stdout.write(self.style.SUCCESS("  [Testimonials] Seeded 3 client testimonials"))
        self.stdout.write(self.style.SUCCESS("Demo seeding completed successfully!"))
