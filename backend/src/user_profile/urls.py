from rest_framework import routers
from .api import UserProfileViewSet, UserProfileUpdateViewSet

router = routers.DefaultRouter()

# Using rest_framework's register can automatically create all urlpatterns we need.
router.register('api/user_profile', UserProfileViewSet, 'user_profile')
router.register('api/update_profile', UserProfileUpdateViewSet, 'update_profile')

urlpatterns = router.urls
