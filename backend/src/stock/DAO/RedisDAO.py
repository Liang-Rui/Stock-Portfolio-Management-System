import redis
from django.http import HttpResponse
from ..Utils.utils import Util
from datetime import datetime
from ..Model.models import Stocks


class Redis:
    host = '127.0.0.1'
    port = 6379
    r = redis.Redis(host=host, port=port)
    util = Util()

    #add interested symbol to watch-list
    def add(self, key, symbol, score):
        self.r.zadd(key, {symbol: score})


    #remove the symbol in the watch-list
    def remove(self, key, symbol):
        self.r.zrem(key, symbol)


    #display the watch-list and sort it by date
    def getList(self, key):
        # print(key)
        symbols = self.r.zrevrange(key, 0, -1)

        results = []
        # print(symbols)
        for i in symbols:
            stock = Stocks.objects.filter(symbol=i.decode()).order_by('-date')[0]
            symbol = {}
            symbol['Symbol'] = stock.symbol
            symbol['Last price'] = stock.close
            symbol['Change'] = stock.close - stock.start
            symbol['Chg%'] = (stock.close - stock.start) / stock.start * 100
            symbol["id"] = stock.id
            symbol['Volume(M)'] = stock.volume / 1000000
            results.append(symbol)
        return results



