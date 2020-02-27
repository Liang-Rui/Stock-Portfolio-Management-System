from rest_framework import serializers
from user_profile.models import UserProfile

# User Serializer
class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = '__all__'
