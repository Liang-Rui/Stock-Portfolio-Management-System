from ..Model.models import Stocks, Holding
import requests
from django.http import HttpResponse
import json

# for test extension
def test(request):
    body = request.body
    body = json.loads(body)
    symbol = body['symbol']
    stock = Stocks.objects.filter(symbol=symbol).order_by('-date')[:5]
    results = []
    for i in stock:
        results.append([i.symbol, i.date])
        results.append("   ")
    return HttpResponse(results)