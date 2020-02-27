from django.db import models


# stock data model
class Stocks(models.Model):
    symbol = models.CharField('symbol', max_length=15, null=False)
    # date = models.DateTimeField('date')
    date = models.CharField('date', max_length=50, null=False)
    start = models.FloatField('start')
    high = models.FloatField('high')
    low = models.FloatField('low')
    close = models.FloatField('close')
    volume = models.BigIntegerField('volume', default=0)
    split = models.FloatField('split')
    dividend = models.FloatField('dividend')
    aChange = models.FloatField('aChange')
    pChange = models.FloatField('pChange')

    class Meta:
        db_table = 'stocks'
        ordering = ['-date']


# for future extension
class Company(models.Model):
    website = models.URLField('website')
    sector = models.CharField('sector', max_length=50, null=True)
    country = models.CharField('country', max_length=50, null=True)
    symbol = models.CharField('symbol', max_length=50, null=True)
    company = models.CharField('company', max_length=50, null=True)
    industry = models.CharField('industry', max_length=50, null=True)
    CEO = models.CharField('CEO', max_length=50, null=True)

    class Meta:
        db_table = 'company'


# symbol data
class Symbols(models.Model):
    symbol = models.CharField('symbol', max_length=50, null=True)
    name = models.CharField('name', max_length=500, null=True)

    class Meta:
        db_table = 'symbols'

# for future extension
class Sectors(models.Model):
    symbol = models.CharField('symbol', max_length=50, null=True)
    sector = models.CharField('sector', max_length=50, null=True)

    class Meta:
        db_table = 'sectors'


# holding list model
class Holding(models.Model):
    symbol = models.CharField('symbol', max_length=15, null=False)
    userName = models.CharField('userName', max_length=50, null=False)
    shares = models.FloatField('shares')
    status = models.IntegerField("status", default=0)
    date = models.CharField('date', max_length=50, null=False)
    price = models.FloatField('price')
    action = models.IntegerField("action")

    class Meta:
        db_table = 'holding'


# history validation prediction data model
class HistoryPrediction(models.Model):
    symbol = models.CharField(max_length=15, null=False, primary_key=True)
    insample = models.TextField()
    outsample = models.TextField()
    result = models.TextField()
    insampleMse = models.FloatField()
    insampleR2 = models.FloatField()
    outsampleMse = models.FloatField()
    outsampleR2 = models.FloatField()


    class Meta:
        db_table = 'historyPrediction'

# future prediction data model
class FuturePrediction(models.Model):
    symbol = models.CharField(max_length=15, null=False, primary_key=True)
    insample = models.TextField()
    outsample = models.TextField()
    result = models.TextField()
    insampleMse = models.FloatField()
    insampleR2 = models.FloatField()

    class Meta:
        db_table = 'futurePrediction'


# user profile model
class UserProfile(models.Model):
    userName = models.TextField(null=False, primary_key=True)
    lastName = models.TextField()
    firstName = models.TextField()
    birthday = models.TextField()
    budget = models.FloatField()













