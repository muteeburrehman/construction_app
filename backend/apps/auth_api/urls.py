"""Authentication API URL routes."""
from django.urls import path
from .views import (
    AdminTokenObtainPairView,
    AdminTokenRefreshView,
    AdminLogoutView,
    CurrentUserView,
)

urlpatterns = [
    path("token/", AdminTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", AdminTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", AdminLogoutView.as_view(), name="auth_logout"),
    path("me/", CurrentUserView.as_view(), name="auth_current_user"),
]
