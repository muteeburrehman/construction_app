"""Serializers for staff authentication and user profile."""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer that ensures the user is staff/admin and returns user details."""

    def validate(self, attrs):
        data = super().validate(attrs)

        if not (self.user.is_staff or self.user.is_superuser):
            raise serializers.ValidationError({"detail": "Access restricted to authorized administrative staff."})

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "is_staff": self.user.is_staff,
            "is_superuser": self.user.is_superuser,
        }
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for authenticated user profile."""

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "full_name", "is_staff", "is_superuser"]

    def get_full_name(self, obj) -> str:
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name if name else obj.username
