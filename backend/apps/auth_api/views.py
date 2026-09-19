"""Views for staff authentication and token lifecycle."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import AdminTokenObtainPairSerializer, UserProfileSerializer


class AdminTokenObtainPairView(TokenObtainPairView):
    """Staff login endpoint issuing access + refresh JWT tokens."""

    permission_classes = [AllowAny]
    serializer_class = AdminTokenObtainPairSerializer


class AdminTokenRefreshView(TokenRefreshView):
    """Refreshes access token with a valid refresh token."""

    permission_classes = [AllowAny]


class AdminLogoutView(APIView):
    """Blacklist or invalidate refresh token on logout."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"success": True, "message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"success": True, "message": "Logged out."}, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    """Return profile details of the authenticated staff member."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
