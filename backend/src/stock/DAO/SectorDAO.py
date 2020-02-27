from ..Model.models import Sectors
from django.http import HttpResponse
import requests
from ..Utils import utils
from ..DAO import SymbolDAO, StockDAO


#divide symbols to sectors
def insertSectors(request):
    result = SymbolDAO.getSymbol()
    for i in result:
        detail = requests.get(
            'https://cloud.iexapis.com/v1/stock/%s/company?token=pk_31fcf86b343d49269bb965ad718fbec6' % i.symbol)
        detail = detail.json()
        sector = detail['sector']
        newSector = Sectors()
        newSector.symbol = i.symbol
        newSector.sector = sector
        newSector.save()
    return HttpResponse("divided success")


#get all sectors
def getSectors():
    u = utils.Util()
    sectors = u.getSectors()
    return sectors


#return a list of symbols according to the sector
def getListSymbols(sector):
    result = Sectors.objects.filter(sector=sector)
    lists = []
    for i in result:
        symbols = {}
        stock = StockDAO.getDataList(i.symbol)
        symbols['Symbol'] = stock.symbol
        symbols['id'] = stock.id
        symbols['Last price'] = stock.close
        symbols['Change'] = stock.aChange
        symbols['Chg%'] = stock.pChange
        symbols['Volume(M)'] = stock.volume / 1000000
        lists.append(symbols)
    return lists











