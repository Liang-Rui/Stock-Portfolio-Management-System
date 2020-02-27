from django.contrib import admin
from .models import Article, UserProfile
from stock.Model.models import Stocks, Symbols, Holding, HistoryPrediction, FuturePrediction, UserProfile
# Register your models here.
# admin.site.register(Article)
# admin.site.register(UserProfile)
admin.site.register(Stocks)
admin.site.register(Symbols)
admin.site.register(Holding)
admin.site.register(HistoryPrediction)
admin.site.register(FuturePrediction)
admin.site.register(UserProfile)