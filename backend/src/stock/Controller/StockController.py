from django.http import HttpResponse
from ..DAO.StockDAO import  getChartList, purchaseStock, deleteStock, show_profolio, updateStock, addSymbol, deleteAllSymbolHolding, predictHistoryStock, predictFuture
from ..DAO.ComanyDAO import find_company
from ..Utils.utils import Util
from datetime import datetime
from ..Utils import login_util
from ..DAO.RedisDAO import Redis
import json



def chart(request, symbol):
    data = getChartList(symbol)
    return HttpResponse(json.dumps(data))

#get stock's profile
def profile(request):
    symbol = request.data['symbol']
    result = find_company(symbol)
    return result


#predict sotck price
def predictHistory(request, symbol):
    predictedData = predictHistoryStock(symbol)
    return HttpResponse(predictedData)


def predictFutureRquest(request, symbol):
    predictedData = predictFuture(symbol)
    return HttpResponse(predictedData)

#insert stock into watchlist
def add(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        key = login_util.getKey(user['username'])
        body = request.body
        body = json.loads(body)
        symbol = body['symbol']
        date = body['date']
        score = date[0:4] + date[5: 7] + date[8:]
        r = Redis()
        r.add(key, symbol, score)
        data = addSymbol(symbol)
        return HttpResponse(data)
    else:
        pass


#remove stock from watchlist
def remove(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        key = login_util.getKey(user['username'])
        body = request.body
        body = json.loads(body)
        symbol = body['symbol']
        deleteAllSymbolHolding(symbol)
        r = Redis()
        r.remove(key, symbol)
        return HttpResponse(json.dumps({"symbol": symbol}))
    else:
        pass


#purchase the stock
def purchase(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        username = user['username']
        body = request.body
        body = json.loads(body)
        symbol = body['symbol']
        shares = float(body['shares'])
        date = body['date']
        price = float(body['price'])
        action = int(body['action'])
        # holding_id = purchaseStock(symbol, shares, username, date)
        holding_id = purchaseStock(username, symbol, date, shares, price, action)
        return HttpResponse(json.dumps({"id": holding_id, "symbol": symbol, "tradeDate": date, "shares": shares, "price": price, "action": action}))
    else:
        pass


# delete stock
def delete(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        body = request.body
        body = json.loads(body)
        symbol_id = int(body['symbol_id'])
        deleteStock(symbol_id)
        return HttpResponse("delete success")
    else:
        pass

# update stock
def update(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        body = request.body
        body = json.loads(body)
        symbol_id = int(body['symbol_id'])
        shares = int(body['shares'])
        action = int(body['action'])
        date = body['date']
        price = float(body['price'])
        updateStock(symbol_id, date, shares, price, action)
        return HttpResponse("update success")
    else:
        pass

# show portfolio
def profolio(request):
    http_token = request.META['HTTP_AUTHORIZATION']
    http_token = http_token.split(" ")[1]
    if login_util.isLogin(http_token):
        user = login_util.getInfor(http_token)
        username = user['username']
        key = login_util.getKey(user['username'])
        profolios = show_profolio(username, key)
        if profolios is None:
            return HttpResponse("you have not have any holdings")
        return HttpResponse(profolios)
    else:
        pass









        
