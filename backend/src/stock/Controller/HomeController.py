from django.http import HttpResponse
from ..DAO.StockDAO import insertStock, purchaseStock, deleteStock, showHolding, get_stocks, updateStock, updateStockCsv, buildPredictionModel, buildFuturePredictionModel
from ..DAO.SectorDAO import getSectors
from ..DAO.SymbolDAO import getSymbol, updateSymbol
import requests
from datetime import datetime
from ..Utils import login_util
from ..DAO.RedisDAO import Redis
import json
from ..Model.models import UserProfile
import urllib
import numpy as np
import pandas as pd
from sklearn import linear_model
from ..Model.models import Stocks
import os 


#home page where show a list of sectors
def home(request):
    sectors = getSectors()
    return HttpResponse(sectors)


#insert stock information to database
def index(request):
    symbols = getSymbol()
    index = 0
    for i in symbols:
        if index > 5:
            break
        insertStock(i.symbol)
        index += 1
    return HttpResponse('get data successfully')


#show the watchlist
def getWatchList(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        key = login_util.getKey(user['username'])
        r = Redis()
        results = r.getList(key)
        return HttpResponse(json.dumps(results))
    else:
        pass


#show all stocks that the user holds
def holdings(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        result = showHolding(user['username'])
        if not result:
            return HttpResponse("you have not hold any stocks")
        else:
            return HttpResponse(result)
    else:
        pass


#show all stocks
def stocks(request):
    result = get_stocks()
    return HttpResponse(json.dumps(result))


# update symbol
def updateSymbolRequest(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        userName = user['username']
        if userName == 'admin':
            symbols = updateSymbol()
            return HttpResponse('update symbols successfully')
        else:
            return HttpResponse('the user needs to be admin')
    else:
        pass

    
# update stock database
def updateStockRequest(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        userName = user['username']
        if userName == 'admin':
            updateStockCsv()
            return HttpResponse('update stocks successfully')
        else:
            return HttpResponse('the user needs to be admin')
    else:
        pass


# update historical prediction database
def updateStockHistoryPredictionRequest(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        userName = user['username']
        if userName == 'admin':
            buildPredictionModel()
            return HttpResponse('update history prediction successfully')
        else:
            return HttpResponse('the user needs to be admin')
    else:
        pass


# update future prediction database
def updateStockFuturePredictionModelRequest(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        userName = user['username']
        if userName == 'admin':
            buildFuturePredictionModel()
            return HttpResponse('update future prediction successfully')
        else:
            return HttpResponse('the user needs to be admin')
    else:
        pass


# update user profile
def updateUserProfileRequest(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        username = user['username']
        body = request.body
        body = json.loads(body)
        profile = UserProfile.objects.filter(userName=username)
        if len(profile) == 0:
            newProfile = UserProfile()
            try:
                lastName = body['lastName']
            except:
                lastName = ''
            try:
                firstName = body['firstName']
            except:
                firstName = ''
            try:
                birthday = body['birthday']
            except:
                birthday = ''
            try:
                budget = body['budget']
            except:
                budget = 0
            newProfile.userName = username
            newProfile.lastName = lastName
            newProfile.firstName = firstName
            newProfile.birthday = birthday
            newProfile.budget = budget
            newProfile.save()
            return HttpResponse(json.dumps('Success!'))
        else:
            newProfile = profile[0]
            try:
                lastName = body['lastName']
                newProfile.lastName = lastName
            except:
                pass
            try:
                firstName = body['firstName']
                newProfile.firstName = firstName
            except:
                pass
            try:
                birthday = body['birthday']
                newProfile.birthday = birthday
            except:
                pass
            try:
                budget = body['budget']
                newProfile.budget = budget
            except:
                pass
            newProfile.save()
            return HttpResponse(json.dumps('Success!'))
    else:
        return HttpResponse('Need to login!')


# get user profile
def getUserProfileRequest(request):
    http_token = request.META['HTTP_AUTHORIZATION']
#     token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        username = user['username']
        profile = UserProfile.objects.filter(userName=username)
        if len(profile) == 0:
            return HttpResponse(json.dumps([]))
        else:
            userProfile = {
                            'lastName': profile[0].lastName,
                            'firstName': profile[0].firstName,
                            'birthday': profile[0].birthday,
                            'budget': profile[0].budget
                            }

            return HttpResponse(json.dumps([userProfile]))


# get news list
def news_list(request):
    url = ('https://newsapi.org/v2/top-headlines?'
           'country=us&'
           'apiKey=56084e7c811b4da7b28fd3dc087c84e3')
    response = requests.get(url)
    response = response.json()
    response = response['articles']
    res = []
    for i in response:
        news = {}
        news['url'] = i['url']
        news['title'] = i['title']
        res.append(news)
    return HttpResponse(res)


#show a list of news that realted to one stock
def news_single(request, symbol):
    url = 'https://newsapi.org/v2/everything?q=%s&sortBy=popularity&language=en&pageSize=5&page=1' \
          '&apiKey=56084e7c811b4da7b28fd3dc087c84e3' % symbol
    response = requests.get(url)
    response = response.json()
    res = []
    try:
        response = response['articles']
        for i in response:
            news = {}
            news['slug'] = i['url']
            news['title'] = i['title']
            news['timestamp'] = i['publishedAt']
            news['content_preview'] = i['description']
            news['urlToImage'] = i['urlToImage']

            res.append(news)
        return HttpResponse(json.dumps({"symbol": symbol, "news": res}))
    except Exception as e:
        return HttpResponse(res)


#  load more news
def load_more_news(request, symbol, page):
    url = 'https://newsapi.org/v2/everything?q=%s&sortBy=popularity&language=en&pageSize=5&page=%s' \
          '&apiKey=56084e7c811b4da7b28fd3dc087c84e3' % (symbol, page)
    response = requests.get(url)
    response = response.json()
    res = []
    try:
        response = response['articles']
        for i in response:
            news = {}
            news['slug'] = i['url']
            news['title'] = i['title']
            news['timestamp'] = i['publishedAt']
            news['content_preview'] = i['description']
            news['urlToImage'] = i['urlToImage']

            res.append(news)
        return HttpResponse(json.dumps({"symbol": symbol, "news": res}))
    except Exception as e:
        return HttpResponse(res)


# search a news
def search_news(request, symbol, page, keyword):
    search = keyword
    search = urllib.parse.quote(search)
    url = 'https://newsapi.org/v2/everything?qInTitle=%s&sortBy=popularity&language=en&pageSize=5&page=%s' \
          '&apiKey=56084e7c811b4da7b28fd3dc087c84e3' % (search, page)
    response = requests.get(url)
    response = response.json()
    res = []
    try:
        response = response['articles']
        for i in response:
            news = {}
            news['slug'] = i['url']
            news['title'] = i['title']
            news['timestamp'] = i['publishedAt']
            news['content_preview'] = i['description']
            news['urlToImage'] = i['urlToImage']

            res.append(news)
        return HttpResponse(json.dumps({"symbol": symbol, "news": res, 'keyword': keyword}))
    except Exception as e:
        return HttpResponse(res)



# factor analysis
def fama(request):

    dir_path = os.path.abspath('../../')

    symbols = pd.read_csv(dir_path + "/stock_ml/stockDB/symbol.csv")
    symbols = symbols["symbol"].values

    dr = pd.DataFrame(columns=symbols);

    for i in range(len(symbols)):
        n = 1000
        symbol = symbols[i]
        prices = pd.read_csv(dir_path + "/stock_ml/stockDB/" + symbol + ".csv")[["adjusted_close"]]

        symbol_dr = prices[24 : n+24].values / prices[25 : n+25].values - 1
        symbol_dr = symbol_dr.flatten()
        dr[symbol] = symbol_dr


    factors_data = pd.read_csv(dir_path + "/stock_ml/stockDB/factors_daily.csv")
    x_list = ['Mkt-RF', 'SMB', 'HML']
    rf_data = factors_data["RF"].values[:n]


    clf = linear_model.LinearRegression()
    res = pd.DataFrame(index=['alpha'])
    for i in symbols:
        y = dr[i].values - rf_data
        x = factors_data[x_list][:n].values
        clf.fit(x, y)
        res[i] = clf.coef_[0]
    res = res.T
    res = pd.DataFrame(res).sort_values(by='alpha', ascending=True)

    symbolList = list(res.index)
    recommended = []

    for symbol in symbolList[:10]:
        stocks = Stocks.objects.filter(symbol=symbol).order_by("-date")
        if len(stocks) != 0:
            stock = stocks[0]
            tmp = {}
            tmp["date"] = stock.date
            tmp["lastPrice"] = str(round(stock.close,2))
            tmp["volume"] = '{:,}'.format(stock.volume)
            tmp["name"] = stock.symbol
            tmp["symbolName"] = symbol
            tmp["id"] = stock.id
            tmp["start"] = str(round(stock.start,2))
            tmp["high"] = str(round(stock.high,2))
            tmp["low"] = str(round(stock.low,2))
            tmp["split"] = stock.split
            tmp["dividend"] = stock.dividend
            tmp["change"] = "+" + str(round(stock.close - stock.start,2)) if round(stock.close - stock.start,2) > 0 else str(round(stock.close - stock.start,2))
            tmp["changePercent"] = "+" + str(round((stock.close - stock.start) * 100 / stock.start, 2)) + "%" if round((stock.close - stock.start) * 100 / stock.start, 2) > 0 else str(round((stock.close - stock.start) * 100 / stock.start, 2)) + "%"
            recommended.append(tmp)

    return HttpResponse(json.dumps(recommended))











