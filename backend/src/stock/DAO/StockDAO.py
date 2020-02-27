from ..Model.models import Stocks, Holding, Symbols, HistoryPrediction, FuturePrediction
import requests
import json
from ..DAO.RedisDAO import Redis
import datetime
import statistics
from os import listdir
from os.path import isfile, join
import csv

import pandas as pd
import numpy as np
# from fbprophet import Prophet
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

import os 


#used to provide the latest data of the symbol
def getLatestData(symbol):
        stock = Stocks.objects.filter(symbol=symbol).order_by("date")[0]
        return stock


def getChartList(symbol):
    stocks = Stocks.objects.filter(symbol=symbol).order_by('date')
    result = []
    for i in stocks:
        stock = {}
        stock['date'] = i.date
        stock['close'] = i.close
        stock['volume'] = i.volume
        stock['symbol'] = symbol
        stock['id'] = i.id
        stock['open'] = i.start
        stock['high'] = i.high
        stock['low'] = i.low
        stock['split'] = i.split
        stock['dividend'] = i.dividend
        stock['aChange'] = i.aChange
        stock['pChange'] = i.pChange
        result.append(stock)
    return result




#insert all data of a symbol
def insertStock(symbol):
    data = requests.get(
        'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=%s'
        '&outputsize=full&apikey=WEN3PK76IWAH33LW' % symbol)
    data = data.json()

    data2 = data['Time Series (Daily)']
    index = 0
    for d, p in data2.items():
        if index > 3000:
            break
        stock = Stocks()
        stock.date = d
        stock.start = float(p['1. open'])
        stock.high = float(p['2. high'])
        stock.low = float(p['3. low'])
        stock.close = float(p['4. close'])
        stock.volume = int(p['6. volume'])
        stock.dividend = float(p['7. dividend amount'])
        stock.split = float(p['8. split coefficient'])
        stock.symbol = symbol
        aChange = stock.high - stock.low
        pChange = aChange / stock.low
        stock.aChange = aChange
        stock.pChange = pChange
        stock.save()
        index += 1


# insert stock data into database
def updateStockCsv():
    dir_path = os.path.abspath('../../')

    files = [f for f in listdir(dir_path + '/backend/src/stockDB') if isfile(join(dir_path + '/backend/src/stockDB', f))]

    for file in files:
        if file[-3:] == 'csv':
            input_file = csv.DictReader(open(dir_path + "/backend/src/stockDB/" + file))
            symbol = file[:-4]
            oldData = Stocks.objects.filter(symbol=symbol).order_by('-date')
            if len(oldData) == 0:
                oldDate = '0000-00-00'
            else:
                oldDate = oldData[0].date
            print("inserting " + symbol)
            for row in input_file:
                row = dict(row)
                if (row['timestamp'] > oldDate):
                    print(".", end='')
                    stock = Stocks()
                    stock.date = row['timestamp']
                    stock.start = float(row['open'])
                    stock.high = float(row['high'])
                    stock.low = float(row['low'])
                    stock.close = float(row['close'])
                    stock.volume = int(row['volume'])
                    stock.dividend = float(row['dividend_amount'])
                    stock.split = float(row['split_coefficient'])
                    stock.symbol = symbol
                    aChange = stock.close - stock.start
                    pChange = aChange / stock.start
                    stock.aChange = aChange
                    stock.pChange = pChange
                    stock.save()
                    
                else:
                    break
            print("end inserting " + symbol)



# create a transaction
def purchaseStock(username, symbol, date, shares, price, action):
    # creating a new record for purchasing
    holding = Holding()
    holding.symbol = symbol
    holding.userName = username
    holding.shares = shares
    holding.date = date
    holding.price = price
    holding.action = action
    holding.save()
    return holding.id



# delete a transaction
def deleteStock(holdingId):
    holding = Holding.objects.get(id=holdingId)
    holding.status = 1
    holding.save()



# update a transaction
def updateStock(holdingId, date, shares, price, action):
    holding = Holding.objects.get(id=holdingId)
    holding.date = date
    holding.shares = shares
    holding.price = price
    holding.action = action
    holding.save()



# show all stocks that a person holds
def showHolding(userName):
    holdings = Holding.objects.filter(userName=userName)
    if not holdings.exists():
        return []
    else:
        results = []
        for i in holdings:
            if i.status == 1:
                continue
            hold = {}
            hold['symbol'] = i.symbol
            hold['userName'] = i.userName
            hold['shares'] = i.shares
            hold['date'] = i.date
            hold['id'] = i.id
            hold['price'] = i.price
            hold['action'] = i.action
            results.append(hold)
        return results



# get complete stock list
def get_stocks():
    symbols = Symbols.objects.all()
    symbolDic = {x.symbol: x.name for x in symbols}
    result = {}
    # a convinent way to get the latest data for each symbol, but still have bug:
    # if some symbol last date is not the same as other symbols, then this will loss that symbol
    # need to redesign database to get data faster
    stocks = Stocks.objects.all().order_by("-date")
    for stock in stocks[:len(symbols)]:
        if (stock.symbol not in result.keys()) and stock.symbol in symbolDic.keys():
            tmp = {}
            tmp["date"] = stock.date
            tmp["lastPrice"] = str(round(stock.close,2))
            tmp["volume"] = '{:,}'.format(stock.volume)
            tmp["name"] = stock.symbol
            tmp["symbolName"] = symbolDic[stock.symbol]
            tmp["id"] = stock.id
            tmp["start"] = str(round(stock.start,2))
            tmp["high"] = str(round(stock.high,2))
            tmp["low"] = str(round(stock.low,2))
            tmp["split"] = stock.split
            tmp["dividend"] = stock.dividend
            tmp["change"] = "+" + str(round(stock.close - stock.start,2)) if round(stock.close - stock.start,2) > 0 else str(round(stock.close - stock.start,2))
            tmp["changePercent"] = "+" + str(round((stock.close - stock.start) * 100 / stock.start, 2)) + "%" if round((stock.close - stock.start) * 100 / stock.start, 2) > 0 else str(round((stock.close - stock.start) * 100 / stock.start, 2)) + "%"
            result[stock.symbol] = tmp

    return [result[x] for x in sorted(result.keys())]



# show user portfolio
def show_profolio(user_name, key):
    holdings = Holding.objects.filter(userName=user_name)

    results = {}
    # get transaction for each symbol
    transactions = {}
    for transaction in holdings:
        if transaction.status == 1:
            continue
        symbol = transaction.symbol
        date = transaction.date
        shares = transaction.shares
        price = transaction.price
        action = transaction.action
        transactionId = transaction.id
        if symbol not in transactions.keys():
            transactionList = [{"tradeDate": date, "shares": shares, "price": price, "action": action, "id": transactionId}]
            transactions[symbol] = transactionList
        else:
            transactions[symbol].append({"tradeDate": date, "shares": shares, "price": price, "action": action, "id": transactionId})
    
    # sort each transaction by date
    for symbol in transactions.keys():
        transactions[symbol] = sorted(transactions[symbol], key=lambda x: x["tradeDate"])

    symbolData = {}

    # get all the symbols in transaction and calculate daily gain, total gain, martket value
    for symbol in transactions.keys():
        firstDate = transactions[symbol][0]["tradeDate"]
        stocks = Stocks.objects.filter(symbol=symbol, date__gte=firstDate).order_by('date')
        for stock in stocks:
            totalShares = 0
            spending = 0
            sellingGain = 0
            for data in transactions[symbol]:
                if data["tradeDate"] <= stock.date:
                    totalShares += data["shares"] * data["action"]
                    if data["action"] == 1:
                        spending += data["shares"] * data["price"]
                    if data["action"] == -1:
                        sellingGain += data["shares"] * data["price"]


            dailyGain = (stock.close - stock.start) * totalShares

            if totalShares != 0:
                totalDailyGain = totalShares * stock.close + sellingGain - spending
                dailyCostBasis = (spending - sellingGain) / totalShares
            else:
                totalDailyGain = sellingGain - spending
                dailyCostBasis = 0

            marketValue = totalShares * stock.close / 100



            # get symbol price data
            if symbol not in symbolData.keys():
                symbolData[symbol] = [{
                                        "date": stock.date, 
                                        "dg": round(dailyGain,2), 
                                        "tg": round(totalDailyGain,2), 
                                        # "accumulatedProfit": round(accumulatedProfit,2), 
                                        "mv": round(marketValue,2), 
                                        "open": stock.start, 
                                        "close": stock.close,
                                        "dailyCostBasis": round(dailyCostBasis,2)
                                      }]
            else:
                symbolData[symbol].append({
                                        "date": stock.date, 
                                        "dg": round(dailyGain,2), 
                                        "tg": round(totalDailyGain,2), 
                                        "mv": round(marketValue, 2), 
                                        "open": stock.start, 
                                        "close": stock.close,
                                        "dailyCostBasis": round(dailyCostBasis,2)
                                      })
    holdingList = []
    # construct the holding list data
    for symbol in transactions.keys():
        holding = {}
        stock = Stocks.objects.filter(symbol=symbol).order_by('-date')[0]
        holding["name"] = symbol
        holding["lastPrice"] = stock.close
        holding["change"] = round(stock.close - stock.start, 2)
        holding["changePercent"] = round(holding["change"] / stock.start * 100, 2)

        holding["shares"] = sum(map(lambda x: x["shares"] * x["action"], transactions[symbol]))
        if holding["shares"] != 0:
            holding["costBasis"] = round(sum(map(lambda x: x["shares"] * x["action"] * x["price"], transactions[symbol])) / holding["shares"], 2)
        else:
            holding["costBasis"] = 0
        holding["marketValue"] = round(holding["shares"] * stock.close / 100, 2)
        holding["dailyGain"] = symbolData[symbol][-1]["dg"]
        holding["totalGain"] = symbolData[symbol][-1]["tg"]
        holding["noLots"] = len(transactions[symbol])


        holding["lastPrice"] = str(holding["lastPrice"])
        holding["change"] = "+" + str(holding["change"]) if holding["change"] > 0 else str(holding["change"])
        holding["changePercent"] = "+" + str(holding["changePercent"]) + "%" if holding["changePercent"] > 0 else str(holding["changePercent"]) + "%"
        holding["costBasis"] = str(holding["costBasis"])
        holding["marketValue"] = str(holding["marketValue"])
        holding["dailyGain"] = "+" + str(holding["dailyGain"]) if holding["dailyGain"] >0 else str(holding["dailyGain"])
        holding["totalGain"] = "+" + str(holding["totalGain"]) if holding["totalGain"] >0 else str(holding["totalGain"])
        holding["noLots"] = str(holding["noLots"])
        holdingList.append(holding)

    r = Redis()
    records = r.getList(key)
    # get transaction data from redis
    for record in records:
        if record["Symbol"] not in transactions.keys():
            holding = {}
            holding["name"] = record["Symbol"]
            holding["lastPrice"] = str(record['Last price'])
            holding["change"] = "+" + str(round(record['Change'], 2)) if record['Change'] > 0 else str(round(record['Change'], 2))
            holding["changePercent"] = "+" + str(round(record['Chg%'], 2)) + "%" if record['Chg%'] > 0 else str(round(record['Chg%'], 2)) + "%" 
            holding["shares"] = "0"
            holding["costBasis"] = "0"
            holding["marketValue"] = "0"
            holding["dailyGain"] = "0"
            holding["totalGain"] = "0"
            holding["noLots"] = "0"
            holdingList.append(holding)
            transactions[record["Symbol"]] = []
            symbolData[record["Symbol"]] = []
    composedChart = {}
    # calculate and construct data for composed chart
    for symbol in symbolData.keys():
        for record in symbolData[symbol]:
            if record["date"] not in composedChart:
                composedChart[record["date"]] = {
                                                "dg": record["dg"], 
                                                "tg": record["tg"], 
                                                # "accumulatedProfit": record["accumulatedProfit"], 
                                                "mv": record["mv"], 
                                                }
            else:
                composedChart[record["date"]] = {
                                                "dg": record["dg"] + composedChart[record["date"]]["dg"], 
                                                "tg": record["tg"] + composedChart[record["date"]]["tg"], 
                                                # "accumulatedProfit": record["accumulatedProfit"] + composedChart[record["date"]]["accumulatedProfit"], 
                                                "mv": record["mv"] + composedChart[record["date"]]["mv"], 
                                                }
    composedChartList = [{ 
                        "date": date,
                        "dg": round(composedChart[date]["dg"],2), 
                        "tg": round(composedChart[date]["tg"],2), 
                        # "accumulatedProfit": round(composedChart[date]["accumulatedProfit"],2), 
                        "mv": round(composedChart[date]["mv"],2), 
                        } for date in sorted(composedChart.keys())]

    for record in holdingList:
        stock = Stocks.objects.filter(symbol=record["name"]).order_by('-date')
        priceList = [i.close for i in stock]
        std = statistics.stdev(priceList)
        record["std"] = round(std,2)

                                              
    return json.dumps({"holdingList": holdingList, "transactions": transactions, "symbolData": symbolData, "composedChartList": composedChartList})



# add a symbol to holding list
def addSymbol(symbol):
    stock = Stocks.objects.filter(symbol=symbol).order_by('-date')[0]
    data = {"symbol": symbol, "lastPrice": stock.close, "change": stock.close - stock.start, "pchg": (stock.close - stock.start) / stock.start * 100}
    return json.dumps(data)


# delete a symbol to holding list
def deleteAllSymbolHolding(symbol):
    holdings = Holding.objects.filter(symbol=symbol)
    for holding in holdings:
        holding.status = 1
        holding.save()



# get validation prediction data
def predictHistoryStock(symbol):
    data = HistoryPrediction.objects.filter(symbol=symbol)
    future = FuturePrediction.objects.filter(symbol=symbol)
    if len(data) != 0 and len(future) != 0:
        historyErrors = [
        {
        'name': 'insample',
        'mse': data[0].insampleMse, 
        'r2': data[0].insampleR2
        },
        {
        'name': 'outsample',
        'mse': data[0].outsampleMse, 
        'r2': data[0].outsampleR2
        }]
        futureErrors = [
        {
        'name': 'insample',
        'mse': future[0].insampleMse, 
        'r2': future[0].insampleR2
        }]
        return json.dumps({
            'result': json.loads(data[0].result), 
            'historyErrors': historyErrors,
            'futureErrors': futureErrors,
            'symbol': data[0].symbol
            })

# get future prediction data
def predictFuture(symbol):
    data = FuturePrediction.objects.filter(symbol=symbol)
    if len(data) != 0:
        return json.dumps({
            'result': json.loads(data[0].result), 
            'insampleMse': data[0].insampleMse, 
            'insampleR2': data[0].insampleR2
            })



# build prediction data and insert to database
# Note: this part is for prediction analysis, which we have already save our model into the
# database, uncommand the following function if you want to preciton all the data again yourself,
# but make sure you have already installed Prophet python package!
def buildPredictionModel():
    pass
# def buildPredictionModel():
#     dir_path = os.path.abspath('../../')
#     stockList = get_stocks()
#     stockList = list(map(lambda x: x['name'], stockList))
#     for symbol in stockList:
#         inputPath = dir_path + '/backend/src/stockDB/' + symbol + '.csv'
#         market_df = pd.read_csv(inputPath, index_col='timestamp', parse_dates=True)
#         market_df = market_df[['close']]
#         df = market_df.reset_index().rename(columns={'timestamp':'ds', 'close':'y'})
#         df['y'] = np.log(df['y'])
#         model = Prophet()
#         train=df[int(len(df)*0.05):]
#         test=df[:int(len(df)*0.05)]
#         model.fit(train);
#         future = model.make_future_dataframe(periods=(df.iloc[1]['ds'] - train.iloc[1]['ds']).days)
#         forecast = model.predict(future)
#         insample = forecast.set_index('ds').join(train.set_index('ds'))
#         insample = insample[['y', 'yhat', 'yhat_upper', 'yhat_lower']].dropna()  
#         outsample = forecast.set_index('ds').join(test.set_index('ds'))
#         outsample = outsample[['y', 'yhat', 'yhat_upper', 'yhat_lower']].dropna()
#         insample = insample.apply(np.exp)
#         outsample = outsample.apply(np.exp)
#         insample.rename(columns={'y': 'insample_y', 'yhat_upper': 'insample_yhat_upper', 'yhat_lower': 'insample_yhat_lower', 'yhat': 'insample_yhat'}, inplace=True)
#         outsample.rename(columns={'y': 'outsample_y', 'yhat_upper': 'outsample_yhat_upper', 'yhat_lower': 'outsample_yhat_lower', 'yhat': 'outsample_yhat'}, inplace=True)
#         insampleMse = mean_squared_error(insample['insample_y'], insample['insample_yhat'])
#         insampleR2 = r2_score(insample['insample_y'], insample['insample_yhat'])
#         outsampleMse = mean_squared_error(outsample['outsample_y'], outsample['outsample_yhat'])
#         outsampleR2 = r2_score(outsample['outsample_y'], outsample['outsample_yhat'])
#         insample["date"]=insample.index
#         outsample["date"]=outsample.index
#         insample['date']=insample['date'].apply(lambda x: str(x.date()))
#         result1 = list(insample.to_dict(orient='index').values())
#         outsample['date']=outsample['date'].apply(lambda x: str(x.date()))
#         result2 = list(outsample.to_dict(orient='index').values())
#         result = result1[-len(result2)*2:] + result2

#         oldData = HistoryPrediction.objects.filter(symbol=symbol)

#         if len(oldData) == 0:
#             newModel = HistoryPrediction()
#             newModel.symbol = symbol
#             newModel.insample = json.dumps(result1)
#             newModel.outsample = json.dumps(result2)
#             newModel.result = json.dumps(result)
#             newModel.insampleMse = insampleMse
#             newModel.outsampleMse = outsampleMse
#             newModel.insampleR2 = insampleR2
#             newModel.outsampleR2 = outsampleR2
#             newModel.save()
#         else:
#             newModel = oldData[0]
#             newModel.insample = json.dumps(result1)
#             newModel.outsample = json.dumps(result2)
#             newModel.result = json.dumps(result)
#             newModel.insampleMse = insampleMse
#             newModel.outsampleMse = outsampleMse
#             newModel.insampleR2 = insampleR2
#             newModel.outsampleR2 = outsampleR2
#             newModel.save()



# build future prediction data and insert to database
# Note: this part is for prediction analysis, which we have already save our model into the
# database, uncommand the following function if you want to preciton all the data again yourself,
# but make sure you have already installed Prophet python package!
def buildFuturePredictionModel():
    pass
# def buildFuturePredictionModel():
#     dir_path = os.path.abspath('../../')
#     stockList = get_stocks()
#     stockList = list(map(lambda x: x['name'], stockList))
#     for symbol in stockList:
#         inputPath = dir_path + '/backend/src/stockDB/' + symbol + '.csv'
#         market_df = pd.read_csv(inputPath, index_col='timestamp', parse_dates=True)
#         market_df = market_df[['close']]
#         df = market_df.reset_index().rename(columns={'timestamp':'ds', 'close':'y'})
#         df['y'] = np.log(df['y'])
#         model = Prophet(daily_seasonality=True)
#         train=df
#         model.fit(train);
#         future = model.make_future_dataframe(periods=400)
#         forecast = model.predict(future)
#         insample = forecast.set_index('ds').join(train.set_index('ds'))
#         insample = insample[['y', 'yhat', 'yhat_upper', 'yhat_lower']].dropna()  
#         outsample = forecast.set_index('ds').join(train.set_index('ds'))
#         outsample = outsample[outsample.isnull().any(axis=1)]
#         outsample = outsample[['yhat', 'yhat_upper', 'yhat_lower']].dropna()
#         insample = insample.apply(np.exp)
#         outsample = outsample.apply(np.exp)
#         insample.rename(columns={'y': 'insample_y', 'yhat_upper': 'insample_yhat_upper', 'yhat_lower': 'insample_yhat_lower', 'yhat': 'insample_yhat'}, inplace=True)
#         outsample.rename(columns={'yhat_upper': 'outsample_yhat_upper', 'yhat_lower': 'outsample_yhat_lower', 'yhat': 'outsample_yhat'}, inplace=True)
#         insampleMse = mean_squared_error(insample['insample_y'], insample['insample_yhat'])
#         insampleR2 = r2_score(insample['insample_y'], insample['insample_yhat'])
#         insample["date"]=insample.index
#         outsample["date"]=outsample.index
#         insample['date']=insample['date'].apply(lambda x: str(x.date()))
#         result1 = list(insample.to_dict(orient='index').values())
#         outsample['date']=outsample['date'].apply(lambda x: str(x.date()))
#         result2 = list(outsample.to_dict(orient='index').values())
#         result = result1[-len(result2)*2:] + result2

#         oldData = FuturePrediction.objects.filter(symbol=symbol)

#         if len(oldData) == 0:
#             newModel = FuturePrediction()
#             newModel.symbol = symbol
#             newModel.insample = json.dumps(result1)
#             newModel.outsample = json.dumps(result2)
#             newModel.result = json.dumps(result)
#             newModel.insampleMse = insampleMse
#             newModel.insampleR2 = insampleR2
#             newModel.save()
#         else:
#             newModel = oldData[0]
#             newModel.insample = json.dumps(result1)
#             newModel.outsample = json.dumps(result2)
#             newModel.result = json.dumps(result)
#             newModel.insampleMse = insampleMse
#             newModel.insampleR2 = insampleR2
#             newModel.save()









