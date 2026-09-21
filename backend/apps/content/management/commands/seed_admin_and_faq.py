"""Seed superuser, initial FAQs, and sample client inquiries for admin dashboard."""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.chatbot.models import FAQ, ChatLog
from apps.inquiries.models import Inquiry


class Command(BaseCommand):
    help = "Seeds admin superuser, chatbot FAQs, and sample inquiries."

    def handle(self, *args, **options):
        User = get_user_model()

        # 1. Admin Superuser
        admin_user, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "info@muteeblabs.com",
                "first_name": "Apex",
                "last_name": "Admin",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin_user.set_password("admin123")
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        self.stdout.write(self.style.SUCCESS("[OK] Admin user created/updated: username='admin', password='admin123'"))

        # 2. Seed Chatbot FAQs
        faqs_data = [
            {
                "question": "What areas in Northern California do you serve?",
                "answer": "Apex Construction Group operates primarily in Napa County and Sonoma County, including Napa, St. Helena, Yountville, Calistoga, Rutherford, Oakville, and surrounding wine country estates.",
                "category": FAQ.CATEGORY_GENERAL,
                "keywords": "area, location, napa, sonoma, yountville, st helena, calistoga, where, serve",
                "order": 1,
                "is_suggested": True,
            },
            {
                "question": "What is your California contractor license number and insurance coverage?",
                "answer": "We hold California Contractors State License Board (CSLB) License #849201 (Class B - General Building Contractor). We carry comprehensive general liability insurance, full workers' compensation coverage, and surety bonding exceeding state standards.",
                "category": FAQ.CATEGORY_LICENSING,
                "keywords": "license, cslb, insured, insurance, bond, bonded, legal, state board",
                "order": 2,
                "is_suggested": True,
            },
            {
                "question": "How does your pricing and billing structure work?",
                "answer": "We operate transparently on an open-book, cost-plus construction management basis. Every subcontractor bid, invoice, and material purchase is verified and accessible to the client with zero hidden markups. We provide itemized cost projections during pre-construction.",
                "category": FAQ.CATEGORY_PRICING,
                "keywords": "price, pricing, cost, rates, fee, billing, open book, estimate, how much",
                "order": 3,
                "is_suggested": True,
            },
            {
                "question": "What types of custom residential construction do you undertake?",
                "answer": "We specialize in ground-up luxury estates, architectural modern builds, complex hillside foundations, fire-hardened (WUI) rebuilds, and historic architectural preservation throughout the Napa Valley hills and valley floor.",
                "category": FAQ.CATEGORY_RESIDENTIAL,
                "keywords": "residential, custom home, house, estate, remodel, hillside, ground up, luxury",
                "order": 4,
                "is_suggested": True,
            },
            {
                "question": "Do you build commercial wineries and hospitality spaces?",
                "answer": "Yes. Our commercial portfolio includes production wineries, barrel caves, tasting rooms, boutique hospitality facilities, and culinary retail spaces. We understand tight harvest schedules and rigorous code compliance.",
                "category": FAQ.CATEGORY_COMMERCIAL,
                "keywords": "commercial, winery, tasting room, hospitality, cave, retail, restaurant",
                "order": 5,
                "is_suggested": True,
            },
            {
                "question": "How do you manage the pre-construction and permitting phase?",
                "answer": "We collaborate closely with your architect and structural engineer during early schematic design to provide constructability reviews, structural value engineering, and preliminary budgets. Our 25+ years of working with local county planning departments streamlines the permit approval process.",
                "category": FAQ.CATEGORY_PROCESS,
                "keywords": "pre-construction, permits, permitting, process, architect, planning, engineering, timeline",
                "order": 6,
                "is_suggested": False,
            },
            {
                "question": "How can I schedule a consultation or request an estimate?",
                "answer": "You can contact our project team directly at (707) 555-0192 or submit your project details through our website estimate form. We typically respond within 24 to 48 business hours to review your architectural concepts.",
                "category": FAQ.CATEGORY_GENERAL,
                "keywords": "contact, call, phone, schedule, consultation, meet, quote, estimate form",
                "order": 7,
                "is_suggested": True,
            },
        ]

        for item in faqs_data:
            FAQ.objects.update_or_create(
                question=item["question"],
                defaults=item,
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(faqs_data)} Knowledge Base FAQs"))

        # 3. Seed Sample Inquiries
        inquiries_data = [
            {
                "name": "Marcus & Elena Vance",
                "email": "marcus.vance@vancevines.com",
                "phone": "(707) 944-2810",
                "project_type": Inquiry.PROJECT_TYPE_ESTATE,
                "project_location": "St. Helena, CA",
                "estimated_budget": "$3.5M – $5M",
                "timeline": "Spring 2027",
                "message": "We have purchased an 8-acre parcel off Silverado Trail and have completed schematic designs for a 6,000 sq ft rammed-earth residence with an underground wine cellar. Looking to discuss general contractor availability.",
                "status": Inquiry.STATUS_NEW,
                "notes": "High-priority estate lead. Architect is Olson Kundig.",
            },
            {
                "name": "Katherine Reed",
                "email": "katherine@reedhospitality.com",
                "phone": "(415) 890-3341",
                "project_type": Inquiry.PROJECT_TYPE_COMMERCIAL,
                "project_location": "Yountville, CA",
                "estimated_budget": "$1.8M – $2.5M",
                "timeline": "Fall 2026",
                "message": "Renovation and expansion of existing boutique tasting room, including seismic upgrades and addition of outdoor covered terrace.",
                "status": Inquiry.STATUS_IN_PROGRESS,
                "notes": "Sent preliminary constructability checklist. Waiting on civil drawings.",
            },
            {
                "name": "Dr. Arthur Campbell",
                "email": "acampbell@bayhealth.org",
                "phone": "(707) 258-9902",
                "project_type": Inquiry.PROJECT_TYPE_RESIDENTIAL,
                "project_location": "Napa (Mount Veeder)",
                "estimated_budget": "$2.2M",
                "timeline": "Immediate / Q1 2027",
                "message": "Hillside custom residence rebuild following wildfire mitigation requirements. Stepped foundation engineering required.",
                "status": Inquiry.STATUS_CONTACTED,
                "notes": "Conducted initial site walk with Eric on Tuesday. Prepared geotechnical review.",
            },
            {
                "name": "David Sterling",
                "email": "dsterling@sterlingcellars.com",
                "phone": "(707) 963-4411",
                "project_type": Inquiry.PROJECT_TYPE_ESTATE,
                "project_location": "Calistoga, CA",
                "estimated_budget": "$850,000",
                "timeline": "Summer 2026",
                "message": "Addition of a private pavilion, custom pool house, and native limestone terrace overlooking the vineyards.",
                "status": Inquiry.STATUS_ARCHIVED,
                "notes": "Client postponed until next fiscal year.",
            },
        ]

        for inq in inquiries_data:
            Inquiry.objects.update_or_create(
                email=inq["email"],
                defaults=inq,
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(inquiries_data)} Sample Inquiries"))

        # 4. Seed sample Chat Logs
        chat_logs_data = [
            {
                "session_id": "demo-session-101",
                "user_message": "Do you have experience with hillside construction in Napa?",
                "response_text": "We specialize in ground-up luxury estates, architectural modern builds, complex hillside foundations, fire-hardened (WUI) rebuilds...",
                "source": ChatLog.SOURCE_FAQ,
                "matched_intent": "FAQ: What types of custom residential construction do you undertake?",
            },
            {
                "session_id": "demo-session-102",
                "user_message": "What is your license number?",
                "response_text": "Apex Construction Group is fully licensed, bonded, and insured in California. Our CSLB License number is #849201.",
                "source": ChatLog.SOURCE_SETTINGS,
                "matched_intent": "intent:license",
            },
            {
                "session_id": "demo-session-103",
                "user_message": "Can you show me your commercial winery projects?",
                "response_text": "Here are projects from our portfolio matching your inquiry...",
                "source": ChatLog.SOURCE_PROJECT,
                "matched_intent": "Portfolio Search",
            },
        ]

        for cl in chat_logs_data:
            ChatLog.objects.create(**cl)
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(chat_logs_data)} Chatbot Interaction Logs"))
