from django.http import HttpResponse
from ..DAO.SectorDAO import getListSymbols


#according to the sector, return a list of stock's information
def sector(request, sector):
    symbols = getListSymbols(sector)
    return HttpResponse(symbols)