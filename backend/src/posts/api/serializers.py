from rest_framework import serializers
from posts.models import Article, UserProfile
from hitcount.models import HitCount

# post serializers for future extension
class HitCountRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return value.hits


class ArticleListSerializer(serializers.ModelSerializer):
    hit_count = HitCountRelatedField(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ('title', 'content_preview', 'category',
                  'timestamp', 'updated', 'slug', 'post_image_url', 'hit_count')


class ArticleDetailSerializer(serializers.ModelSerializer):
    hit_count = HitCountRelatedField(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ('title', 'category',
                  'timestamp', 'updated', 'content', 'post_image_url', 'slug', 'hit_count')


class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('title', 'category', 'slug')


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
