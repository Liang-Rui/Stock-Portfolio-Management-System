from ..Model.models import Company
import requests


#search stock's profile
def insert_company(symbol):
    detail = requests.get(
        'https://cloud.iexapis.com/v1/stock/%s/company?token=pk_31fcf86b343d49269bb965ad718fbec6' % symbol)
    detail = detail.json()
    companyName = detail['companyName']
    industry = detail['industry']
    website = detail['website']
    CEO = detail['CEO']
    sector = detail['sector']
    country = detail['country']
    company = Company()
    company.symbol = symbol
    company.company = companyName
    company.industry = industry
    company.website = website
    company.CEO = CEO
    company.sector = sector
    company.country = country
    company.save()



def find_company(symbol):
    result = Company.objects.get(symbol=symbol)
    content = {'symbol', result.symbol,
                   'company', result.company,
                   'industry', result.industry,
                   'website', result.website,
                   'CEO', result.CEO,
                   'sector', result.sector,
                   'country', result.country}
    return content