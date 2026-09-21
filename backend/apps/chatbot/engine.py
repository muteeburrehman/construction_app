"""Local database-powered Chatbot Engine (Zero Cost, Zero External APIs)."""
import re
from typing import Any
from django.db.models import Q
from apps.content.models.project import Project
from apps.content.models.service import Service
from apps.content.models.site_settings import SiteSettings
from .models import FAQ, ChatLog


def clean_text(text: str) -> str:
    """Normalize text for matching: lowercase, strip punctuation."""
    return re.sub(r"[^\w\s]", "", text.lower()).strip()


def query_chatbot(user_message: str, session_id: str = "") -> dict[str, Any]:
    """
    Search local PostgreSQL / SQLite database to generate an intelligent answer.
    Answer Priority Chain:
      1. FAQ Question / Keyword match
      2. Direct Intent matching (License, Phone, Hours, Location, Pricing)
      3. Project / Portfolio database query
      4. Service database query
      5. Graceful fallback with direct contact options
    """
    cleaned = clean_text(user_message)
    tokens = set(cleaned.split())

    # Fetch active FAQs in a single query (no N+1)
    faqs = list(FAQ.objects.filter(is_active=True).order_by("order"))

    # 1. Exact or high-score FAQ match
    best_faq = None
    highest_score = 0

    for faq in faqs:
        faq_q_clean = clean_text(faq.question)
        faq_tokens = set(faq_q_clean.split())

        # Check keyword matches
        kw_tokens = set()
        if faq.keywords:
            for kw in faq.keywords.split(","):
                kw_tokens.update(clean_text(kw).split())

        # Scoring
        overlap_q = len(tokens & faq_tokens)
        overlap_kw = len(tokens & kw_tokens) * 2  # keywords weighted higher

        # If user message contains the whole FAQ question or vice versa
        if cleaned in faq_q_clean or faq_q_clean in cleaned:
            score = 100
        else:
            score = overlap_q + overlap_kw

        if score > highest_score and score >= 2:
            highest_score = score
            best_faq = faq

    if best_faq and highest_score >= 2:
        response_text = best_faq.answer
        _log_chat(
            session_id=session_id,
            user_message=user_message,
            response_text=response_text,
            source=ChatLog.SOURCE_FAQ,
            matched_intent=f"FAQ: {best_faq.question}",
            matched_item_id=str(best_faq.id),
        )
        return {
            "source": "faq",
            "message": response_text,
            "category": best_faq.category,
            "suggestions": _get_related_suggestions(best_faq.category),
        }

    # 2. Direct Intent Matching (Site Settings & Core Knowledge)
    settings = SiteSettings.get_solo()

    # License intent
    if any(word in tokens for word in ["license", "cslb", "insured", "insurance", "bond", "bonded"]):
        company = settings.company_name or "Apex Construction Group"
        response_text = (
            f"{company} is fully licensed, bonded, and insured in California. "
            f"Our California Contractors State License Board (CSLB) License number is #{settings.license_number or '849201'}. "
            f"We maintain an impeccable standing with premier residential and commercial builds across the region."
        )
        _log_chat(session_id, user_message, response_text, ChatLog.SOURCE_SETTINGS, "intent:license")
        return {
            "source": "settings",
            "message": response_text,
            "action": {"type": "link", "label": "Verify on CSLB", "url": "https://www.cslb.ca.gov/"},
        }

    # Phone / Contact intent
    if any(word in tokens for word in ["phone", "call", "contact", "email", "reach", "number", "talk"]):
        phone = settings.phone or "(707) 555-0192"
        email = settings.email or "info@muteeblabs.com"
        response_text = (
            f"You can reach our team and project leads directly at {phone} or via email at {email}. "
            f"We also welcome project inquiries through our online estimate request form."
        )
        _log_chat(session_id, user_message, response_text, ChatLog.SOURCE_SETTINGS, "intent:contact")
        return {
            "source": "settings",
            "message": response_text,
            "action": {"type": "route", "label": "Open Estimate Request", "route": "/contact"},
        }

    # Pricing / Cost intent
    if any(word in tokens for word in ["cost", "price", "pricing", "budget", "rate", "rates", "estimate", "quote", "fee"]):
        response_text = (
            "We operate on an open-book, cost-plus construction management basis. Every subcontractor bid, "
            "material invoice, and labor ledger is completely transparent with no hidden markups. "
            "Because every custom residential build or commercial estate has distinct architectural specifications, "
            "we provide detailed cost projections during pre-construction after reviewing your initial plans."
        )
        _log_chat(session_id, user_message, response_text, ChatLog.SOURCE_SETTINGS, "intent:pricing")
        return {
            "source": "settings",
            "message": response_text,
            "action": {"type": "route", "label": "Request Project Estimate", "route": "/contact"},
        }

    # Location / Service Area intent
    if any(word in tokens for word in ["location", "area", "where", "napa", "sonoma", "yountville", "helena", "calistoga", "address"]):
        company = settings.company_name or "Apex Construction Group"
        service_areas = settings.service_area or "Napa, St. Helena, Yountville, Calistoga, Oakville, and Sonoma County"
        response_text = (
            f"{company} is based in Napa, California. We build and remodel throughout "
            f"the wine country and surrounding regions, including {service_areas}. Our deep relationships with local planning "
            f"departments and master craftsmen ensure a seamless permitting and building process."
        )
        _log_chat(session_id, user_message, response_text, ChatLog.SOURCE_SETTINGS, "intent:location")
        return {
            "source": "settings",
            "message": response_text,
            "action": {"type": "route", "label": "View Our Work", "route": "/work"},
        }

    # 3. Search Portfolio Projects in Database
    project_query = Q()
    for word in tokens:
        if len(word) > 3 and word not in ["have", "with", "what", "some", "tell", "show", "built", "build", "project", "projects"]:
            project_query |= Q(title__icontains=word) | Q(location__icontains=word) | Q(summary__icontains=word) | Q(scope__icontains=word)

    if project_query:
        # Preload project list without N+1 query
        matching_projects = list(
            Project.published.filter(project_query)
            .select_related("service")
            .order_by("-is_featured", "-year")[:3]
        )
        if matching_projects:
            items_desc = []
            for p in matching_projects:
                items_desc.append(f"• **{p.title}** ({p.location}, {p.year}) — {p.scope}")
            
            response_text = (
                f"Here are projects from our portfolio matching your inquiry:\n\n"
                + "\n".join(items_desc)
                + "\n\nYou can explore high-resolution photo galleries of these builds on our Work page."
            )
            _log_chat(
                session_id,
                user_message,
                response_text,
                ChatLog.SOURCE_PROJECT,
                matched_item_id=str(matching_projects[0].id),
            )
            return {
                "source": "project",
                "message": response_text,
                "projects": [
                    {"id": str(p.id), "title": p.title, "slug": p.slug, "location": p.location, "year": p.year}
                    for p in matching_projects
                ],
                "action": {"type": "route", "label": "View Full Portfolio", "route": "/work"},
            }

    # 4. Search Services in Database
    service_query = Q()
    for word in tokens:
        if len(word) > 3:
            service_query |= Q(title__icontains=word) | Q(summary__icontains=word) | Q(body__icontains=word)

    if service_query:
        matching_services = list(
            Service.published.filter(service_query).order_by("order")[:2]
        )
        if matching_services:
            svc = matching_services[0]
            route = "/services/residential" if svc.category == Service.CATEGORY_RESIDENTIAL else "/services/commercial"
            response_text = f"**{svc.title}**: {svc.summary}\n\nWe provide full design-assist, pre-construction budgeting, and master craftsmanship across this division."
            _log_chat(session_id, user_message, response_text, ChatLog.SOURCE_SERVICE, matched_item_id=str(svc.id))
            return {
                "source": "service",
                "message": response_text,
                "action": {"type": "route", "label": f"Explore {svc.title}", "route": route},
            }

    # 5. Graceful Fallback
    phone = settings.phone or "(707) 555-0192"
    response_text = (
        f"Thank you for your question! For specific architectural plans, site evaluations, or custom project inquiries, "
        f"our principal builders would be delighted to speak with you directly. You can call us at {phone}, or send a "
        f"brief message through our project inquiry form."
    )
    _log_chat(session_id, user_message, response_text, ChatLog.SOURCE_FALLBACK)
    return {
        "source": "fallback",
        "message": response_text,
        "action": {"type": "route", "label": "Start Project Inquiry", "route": "/contact"},
        "suggestions": [
            "What areas do you serve?",
            "What is your California contractor license?",
            "How does your pricing & billing work?",
            "Do you handle winery and commercial builds?",
        ],
    }


def _log_chat(
    session_id: str,
    user_message: str,
    response_text: str,
    source: str,
    matched_intent: str = "",
    matched_item_id: str = "",
) -> None:
    """Safely log interaction to database for admin dashboard analytics."""
    try:
        ChatLog.objects.create(
            session_id=session_id[:100],
            user_message=user_message,
            response_text=response_text,
            source=source,
            matched_intent=matched_intent[:150],
            matched_item_id=matched_item_id[:100],
        )
    except Exception:
        pass


def _get_related_suggestions(category: str) -> list[str]:
    """Retrieve up to 3 FAQ questions for quick chip follow-up."""
    qs = FAQ.objects.filter(is_active=True).exclude(category=category).order_by("order")[:3]
    return [f.question for f in qs]
