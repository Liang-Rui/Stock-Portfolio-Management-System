"""blog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Stock Analysis API')

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', include('posts.api.urls')),
    path('', include('user_profile.urls')),
    path('', include('accounts.urls')),
    path('', include('stock.urls')),
    path(r'swagger-docs/', schema_view)
]
