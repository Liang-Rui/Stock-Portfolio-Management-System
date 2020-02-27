from django.urls import path
from .DAO import SectorDAO, SymbolDAO
from .Controller import HomeController, StockController, SectorController, testController


urlpatterns = [

    #detail of a stock
    path('stocks/<symbol>/chart/', StockController.chart, name='chart'),
    path('stocks/<symbol>/profile/', StockController.profile, name='profile'),
    path('stocks/<symbol>/predict/history/', StockController.predictHistory, name='predictHistory'),
    path('stocks/<symbol>/predict/future/', StockController.predictFutureRquest, name='predictFutureRquest'),

    # purchase and sell
    path('purchase/', StockController.purchase, name='purchase'),
    path('delete/', StockController.delete, name='delete'),
    path('holdings/', HomeController.holdings, name='holdings'),
    path('update/', StockController.update, name='update'),
    path("profolio/", StockController.profolio, name='profolio'),

    # add or remove symbol from Watching_List
    path('add/', StockController.add, name='add'),
    path("remove/", StockController.remove, name='remove'),


    #return all stocks
    path('stocks/', HomeController.stocks, name='stocks'),
    path('updateSymbolRequest/', HomeController.updateSymbolRequest, name='updateSymbolRequest'),
    path('updateStockRequest/', HomeController.updateStockRequest, name='updateStockRequest'),
    path('updateStockHistoryPredictionRequest/', HomeController.updateStockHistoryPredictionRequest, name='updateStockHistoryPredictionRequest'),
    path('updateStockFuturePredictionModelRequest/', HomeController.updateStockFuturePredictionModelRequest, name='updateStockFuturePredictionModelRequest'),
    path('updateUserProfile/', HomeController.updateUserProfileRequest, name='updateUserProfileRequest'),
    path('getUserProfile/', HomeController.getUserProfileRequest, name='getUserProfileRequest'),

    #news list
    path('news/', HomeController.news_list, name='news'),
    path('news/<symbol>/<page>', HomeController.load_more_news, name='news'),
    path('news/search/<symbol>/<keyword>/<page>', HomeController.search_news, name='news'),
    path('recommendedStocks/', HomeController.fama, name='fama')

]







