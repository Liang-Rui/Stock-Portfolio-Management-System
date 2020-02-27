from rest_framework.generics import RetrieveAPIView, ListAPIView
from posts.models import Article, UserProfile
from .serializers import ArticleListSerializer, ArticleDetailSerializer, ArticleCategorySerializer, UserProfileSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter


from hitcount.models import HitCount
from hitcount.views import HitCountMixin

# post views, for future extension
class ArticleListPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'size'
    max_page_size = 20


class ArticleDetailView(RetrieveAPIView):
    queryset = Article.objects.all()
    lookup_field = 'slug'
    serializer_class = ArticleDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # counting article hits
        hit_count = HitCount.objects.get_for_object(instance)
        hit_count_response = HitCountMixin.hit_count(request, hit_count)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ArticleListView(ListAPIView):
    queryset = Article.objects.filter(recommended=False, topRecommended=False)
    serializer_class = ArticleListSerializer
    pagination_class = ArticleListPagination
    filter_backends = (OrderingFilter,)
    ordering_fields = ('timestamp', 'hit_count')


class RecommendedArticleListView(ListAPIView):
    queryset = Article.objects.filter(recommended=True, topRecommended=False)
    serializer_class = ArticleListSerializer
    pagination_class = ArticleListPagination


class ArticleCategoryListView(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleCategorySerializer


class UserProfileView(RetrieveAPIView):
    queryset = UserProfile.objects.all()
    lookup_field = 'email'
    serializer_class = UserProfileSerializer


class RecommendedTopArticleView(ListAPIView):
    queryset = Article.objects.filter(topRecommended=True)
    serializer_class = ArticleListSerializer
