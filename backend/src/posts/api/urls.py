from django.urls import path, re_path

from .views import ArticleListView, ArticleDetailView, RecommendedArticleListView, ArticleCategoryListView, UserProfileView, RecommendedTopArticleView

# post urls, for future extension
urlpatterns = [
    path('posts/', ArticleListView.as_view()),
    re_path(r'^posts/(?P<slug>[\w-]+)/$', ArticleDetailView.as_view()),
    path('recommended-posts/', RecommendedArticleListView.as_view()),
    path('posts-category/', ArticleCategoryListView.as_view()),
    re_path(r'^user-profile/(?P<email>.*)/$', UserProfileView.as_view()),
    path('top-recommended-post/', RecommendedTopArticleView.as_view())
]
