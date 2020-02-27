from ..Model.models import Symbols
import requests
from django.http import HttpResponse
import json
import os 

# insert all symbols into database (not use)
def insertAllSymbol(request):
    data = requests.get(
        'https://cloud.iexapis.com/v1/ref-data/symbols?token=pk_31fcf86b343d49269bb965ad718fbec6')
    data = data.json()
    index = 0
    for i in data:
        if index > 100:
            break
        symbol = i['symbol']
        newSymbol = Symbols()
        newSymbol.symbol = symbol
        newSymbol.save()
        index += 1
    return HttpResponse('data insertion success')

# get all the symbol in database
def getSymbol():
    symbols = Symbols.objects.all()
    return symbols

# update symbol data
def updateSymbol():
    dir_path = os.path.abspath('../../')
    with open(dir_path + "/backend/src/stockDB/allSymbols.json") as allSymbolFile:
        data = json.load(allSymbolFile)

    with open(dir_path + "/backend/src/stockDB/symbol.txt") as popularSymbolFile:
        popularSymbol = popularSymbolFile.read()
        popularSymbol = popularSymbol.split()

    for record in data:
        if record['type'] == 'cs' and record['region'] == 'US' and record["symbol"] in popularSymbol:
            print("saving " + record['symbol'])
            newSymbol = Symbols()
            newSymbol.symbol = record['symbol']
            newSymbol.name = record['name']
            newSymbol.save()


