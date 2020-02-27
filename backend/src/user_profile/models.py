from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    firstName = models.CharField(max_length=100, blank=True)
    lastName = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=100, unique=True)
    birthDate = models.DateField(null=True, blank=True)
    budget = models.CharField(max_length=100, blank=True)
    owner = models.ForeignKey(
        User, related_name="user_profile", on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
