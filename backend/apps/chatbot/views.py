"""Views for chatbot query interface and admin knowledge management."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, filters, generics
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import FAQ, ChatLog
from .serializers import ChatMessageRequestSerializer, FAQSerializer, ChatLogSerializer
from .engine import query_chatbot


class ChatMessageView(APIView):
    """Public query endpoint for visitor chatbot interactions."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ChatMessageRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.validated_data["message"]
        session_id = serializer.validated_data.get("session_id", "")

        result = query_chatbot(user_message=message, session_id=session_id)
        return Response(result, status=status.HTTP_200_OK)


class ChatSuggestionsView(APIView):
    """Returns top suggested questions for quick chips on public widget."""

    permission_classes = [AllowAny]

    def get(self, request):
        # Retrieve suggested or top-ordered FAQs in single query
        faqs = list(
            FAQ.objects.filter(is_active=True, is_suggested=True).order_by("order")[:5]
        )
        if not faqs:
            faqs = list(FAQ.objects.filter(is_active=True).order_by("order")[:5])

        suggestions = [
            {"id": str(f.id), "question": f.question, "category": f.category}
            for f in faqs
        ]
        return Response({"suggestions": suggestions})


class FAQAdminViewSet(viewsets.ModelViewSet):
    """Admin CRUD ViewSet for managing chatbot FAQ knowledge base."""

    queryset = FAQ.objects.all().order_by("order", "created_at")
    serializer_class = FAQSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["question", "answer", "keywords"]
    ordering_fields = ["order", "category", "created_at", "helpful_count"]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class ChatLogAdminListView(generics.ListAPIView):
    """Admin view to review questions asked by visitors."""

    queryset = ChatLog.objects.all().order_by("-created_at")
    serializer_class = ChatLogSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ["user_message", "response_text", "matched_intent"]
