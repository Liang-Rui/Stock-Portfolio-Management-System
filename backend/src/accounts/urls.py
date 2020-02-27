from django.urls import path, include
from .api import RegisterAPI, LoginAPI, UserAPI, ChangePasswordAPI
from knox import views as knox_views

# urls for user account
urlpatterns = [
  path('api/auth/register', RegisterAPI.as_view()),
  path('api/auth/login', LoginAPI.as_view()),
  path('api/auth/user', UserAPI.as_view()),
  path('api/auth/user/password/change', ChangePasswordAPI.as_view()),
  path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
  path('api/auth', include('knox.urls'))
]