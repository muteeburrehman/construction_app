"""URL routes for chatbot."""
from django.urls import path
from .views import ChatMessageView, ChatSuggestionsView

urlpatterns = [
    path("message/", ChatMessageView.as_view(), name="chat_message"),
    path("suggestions/", ChatSuggestionsView.as_view(), name="chat_suggestions"),
]
