from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from hitcount.models import HitCount, HitCountMixin
from django.contrib.contenttypes.fields import GenericRelation

# post models, for future extension
class UserProfile(models.Model):
    firstName = models.CharField(max_length=120)
    lastName = models.CharField(max_length=120)
    jobDescription_1 = models.CharField(max_length=120)
    jobDescription_2 = models.CharField(max_length=120)
    jobDescription_3 = models.CharField(max_length=120)
    email = models.EmailField()
    phone_1 = models.CharField(max_length=120, blank=True)
    phone_2 = models.CharField(max_length=120, blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    wechat_QR_code = models.URLField(blank=True)

    def __str__(self):
        return self.email


class Article(models.Model, HitCountMixin):
    title = models.CharField(max_length=120)
    content = models.TextField(blank=True)
    content_preview = models.TextField(blank=True)
    category = models.CharField(max_length=120)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    slug = models.SlugField(blank=True, null=True)
    recommended = models.BooleanField(default=False)
    post_image_url = models.CharField(max_length=120, null=True, blank=True)
    topRecommended = models.BooleanField(default=False)
    hit_count = GenericRelation(
        HitCount, object_id_field='object_pk',
        related_query_name='hit_count_generic_relation')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-timestamp", "-updated"]


def slug_generator(instance, offset=0):
    slug = slugify(instance.title)
    newSlug = slug

    while instance.__class__.objects.filter(slug=newSlug).exists():
        newSlug = slug + '-' + str(offset)
        offset += 1

    return newSlug


def pre_save_article_receiver(sender, instance, *args, **kwargs):
    if (instance.id is None):
        instance.slug = slug_generator(instance)
    else:
        try:
            existInstance = instance.__class__.objects.get(id=instance.id)
            if (instance.title != existInstance.title):
                instance.slug = slug_generator(instance)
        except:
            pass

    if instance.topRecommended:
        Article.objects.filter(topRecommended=True).update(
            topRecommended=False)


pre_save.connect(pre_save_article_receiver, sender=Article)
