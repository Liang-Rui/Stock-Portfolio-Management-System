import {
    GETSTATISTICSPENEL_REQUEST,
    GETSTATISTICSPENEL_SUCCESS,
    GETSTATISTICSPENEL_FAILURE,
    ADDTRANSACTION_REQUEST,
    ADDTRANSACTION_SUCCESS,
    ADDTRANSACTION_FAILURE,
    ADDTRANSACTION_INTERNAL_REQUEST,
    EDITTRANSACTION_REQUEST,
    EDITTRANSACTION_SUCCESS,
    EDITTRANSACTION_FAILURE,
    EDITTRANSACTION_INTERNAL_REQUEST,
    DELETETRANSACTION_REQUEST,
    DELETETRANSACTION_SUCCESS,
    DELETETRANSACTION_FAILURE,
    DELETETRANSACTION_INTERNAL_REQUEST,
    ADDSYMBOL_REQUEST,
    ADDSYMBOL_SUCCESS,
    ADDSYMBOL_FAILURE,
    DELETESYMBOL_REQUEST,
    DELETESYMBOL_SUCCESS,
    DELETESYMBOL_FAILURE,
    DELETESYMBOL_INTERNAL_REQUEST,
    GETPORTFOLIO_REQUEST,
    GETPORTFOLIO_SUCCESS,
    GETPORTFOLIO_FAILURE,
    SETCURRENTTRANSACTION,
    GETSTOCKLIST_REQUEST,
    GETSTOCKLIST_SUCCESS,
    GETSTOCKLIST_FAILURE,
    GETSTOCK_REQUEST,
    GETSTOCK_SUCCESS,
    GETSTOCK_FAILURE,
    SETSTOCKSYMBOLNAME,
    PREDICTHISTORY_REQUEST,
    PREDICTHISTORY_SUCCESS,
    PREDICTFUTURE_REQUEST,
    PREDICTFUTURE_SUCCESS,
    GETNEWS_REQUEST,
    GETNEWS_SUCCESS,
    SEARCHNEWS_REQUEST,
    SEARCHNEWS_SUCCESS,
    GETRECOMMENDEDSTOCK_REQUEST,
    GETRECOMMENDEDSTOCK_SUCCESS

    

} from '../actions/portfolioActions'

import {
    LOGOUTUSER
} from '../actions/userAuth'

// generate blank data for charts
function generateDate() {
    var today = new Date()
    var n = 30
    var dateArray = []
    today.setDate(today.getDate() - n)
    while(n >= 0) {
        dateArray.push({date: today.toISOString().substring(0, 10), mv: 0, dg: 0, tg: 0, close: 0})
        today.setDate(today.getDate() + 1)
        n = n - 1
    }
    return dateArray
}

// format prediction error
function calculatePrediction(data) {
    const resultTemp = data.map((x) => (x.insample_y !== undefined ? {
        ...x, 
        "insample_confidence_region": [x.insample_yhat_lower.toFixed(0), x.insample_yhat_upper.toFixed(0)],
        'insample_y': x.insample_y.toFixed(0),
        'insample_yhat': x.insample_yhat.toFixed(0),

    } : {
        ...x, 
        "outsample_confidence_region": [x.outsample_yhat_lower.toFixed(0), x.outsample_yhat_upper.toFixed(0)],
        'outsample_yhat': x.outsample_yhat.toFixed(0),
    }))
    const result = resultTemp.map((x) => (x.outsample_y !== undefined ? {...x, 'outsample_y': x.outsample_y.toFixed(0)} : x))

    var dataWithoutWeekend=[];
    var i;
    var date;
    for (i=0;i<result.length;i++){
        date = new Date(result[i].date)
        if( date.getDay() !== 6 && date.getDay() !== 0){
            dataWithoutWeekend.push(result[i])
        }
    }
    return dataWithoutWeekend
}


// portfolio inital state

const portfolioInitialState = {
    statisticsPanel: {budget: 0, balance: 0, portfolioValue: 0, totalGain: 0, dailyGain: 0, totalProfit: 0},
    radarChart: [
        { subject: 'Market Value', 'New Symbol': 0, fullMark: 1 },
        { subject: 'No. Lots', 'New Symbol': 0, fullMark: 1 },
        { subject: 'Total Loss', 'New Symbol': 0, fullMark: 1 },
        { subject: 'Total Gain', 'New Symbol': 0, fullMark: 1 },
        { subject: 'Std', 'New Symbol': 0, fullMark: 1 },
    ],
    pieChart: [{name: 'New Symbol', value: 100}],
    portfolioComposedChart: generateDate(),
    holdingListData: [],
    transactionData: {},
    transactionComposedChart: {},
    currentTransactionData: [],
    currentTransactionSymbol: null,
    currentTransactionChart: generateDate(),
    completeStockList:[],
    fetchingPortfolio: false,
    fetchingStockList: false,
    currentStockDetailSymbolShort: null,
    currentStockDetailSymbol: null,
    currentStockDeatilData: [],
    predictHistory: [],
    predictFuture: [],
    predictionError: {},
    getStockRequest: false,
    predictHistoryRequest: false,
    predictFutureRequest: false,
    news: [],
    loadingNews: false,
    newsPage: 1,
    searchNewsKeyword: '',
    searchNews: [],
    loadingSearchNews: false,
    searchNewsPage: 1,
    previousStockDetailSymbolShort: null,
    searchView: false,
    recommendedStockList: [],
    fetchingRecommendedStockList: false


}

// reducer function
export const portfolio = (state = portfolioInitialState, action) => {
    switch (action.type) {
        case GETSTATISTICSPENEL_REQUEST:
            return {
                ...state,
            };
        case GETSTATISTICSPENEL_SUCCESS:
            return {
                ...state,
            };
        case GETSTATISTICSPENEL_FAILURE:
            return {
                ...state,
            };
        // edit transaction reducer
        case EDITTRANSACTION_INTERNAL_REQUEST:
            let editTransactionData = state.transactionData[action.symbol];
            editTransactionData[action.oldData.tableData.id] = action.newData;
            return {
                ...state,
                transactionData: {
                    ...state.transactionData,
                    [action.symbol]: editTransactionData
                }
            };
        // delete transaction reducer
        case DELETETRANSACTION_INTERNAL_REQUEST:
            let deleteTransactionData = state.transactionData[action.symbol];

            deleteTransactionData.splice(deleteTransactionData.indexOf(action.oldData), 1);
            return {
                ...state,
                transactionData: {
                    ...state.transactionData,
                    [action.symbol]: deleteTransactionData
                }
            }
        // add stock to holding list reducer
        case ADDSYMBOL_SUCCESS:
            const addSymbolSuccessData = {
                name: action.response.symbol,
                lastPrice: action.response.lastPrice.toString(),
                change: action.response.change > 0? "+" + action.response.change.toFixed(2).toString() : action.response.change.toFixed(2).toString(),
                changePercent: action.response.pchg > 0 ?  "+" + action.response.pchg.toFixed(2).toString() + "%" : action.response.pchg.toFixed(2).toString() + "%",
                accumulatedProfit: '0',
                shares: '0', 
                costBasis: '0', 
                marketValue: '0', 
                dailyGain: '0', 
                totalGain: '0', 
                noLots: '0'
            }
            return {
                ...state,
                holdingListData: [...state.holdingListData, addSymbolSuccessData],
                transactionData: {
                    ...state.transactionData,
                    [action.response.symbol]: []
                }
            }
        // delete stock to holding list reducer
        case DELETESYMBOL_INTERNAL_REQUEST:

            let data = state.holdingListData;
            const index = data.indexOf(action.oldData);
            data.splice(index, 1);
            return {
                ...state,
                holdingListData: data,
                transactionData: {
                    ...state.transactionData,
                    [action.oldData.name]: []
                }
            };
        // get portfolio data reducer
        case GETPORTFOLIO_REQUEST:
            return {
                ...state,
                fetchingPortfolio: true
            }
        case GETPORTFOLIO_SUCCESS:
            var portfolioStatisticsPanel = {portfolioValue: 0, totalGain: 0, dailyGain: 0}
            var portfolioRadarChart = [
                { subject: 'Market Value', 'New Symbol': 0, fullMark: 1 },
                { subject: 'No. Lots', 'New Symbol': 0, fullMark: 1 },
                { subject: 'Total Loss', 'New Symbol': 0, fullMark: 1 },
                { subject: 'Total Gain', 'New Symbol': 0, fullMark: 1 },
                { subject: 'Std', 'New Symbol': 0, fullMark: 1 },
            ]
            var pieChart = [{name: 'New Symbol', value: 100}]

            // calculate statistics pannel
            if (action.response.composedChartList.length === 0) {
                action.response.composedChartList = generateDate()
            } else {
                portfolioStatisticsPanel = {portfolioValue: (parseFloat(action.response.composedChartList[action.response.composedChartList.length-1].mv) * 100).toFixed(0), totalGain: parseFloat(action.response.composedChartList[action.response.composedChartList.length-1].tg).toFixed(0), dailyGain: parseFloat(action.response.composedChartList[action.response.composedChartList.length-1].dg).toFixed(0)}
            }

            // calculate radar chart and pie chart
            if (action.response.holdingList.length !== 0) {
                // calculate pie chart
                if (Math.max(...action.response.holdingList.map((x) => Number(x.marketValue))) !== 0){
                    pieChart = action.response.holdingList.map((x) => ({name: x.name, value: parseInt(parseFloat(x.marketValue) * 100)}))
                }

                // fill empty transaction data with 0 values
                action.response.symbolData = Object.keys(action.response.symbolData).reduce((c,x) => ({...c, [x]: action.response.symbolData[x].length === 0 || action.response.symbolData[x].length === undefined ? generateDate() : action.response.symbolData[x]}), action.response.symbolData)
                
                if (action.response.holdingList.length === 1) {
                    portfolioRadarChart = [
                        { subject: 'Market Value', [action.response.holdingList[0].name]: Number(action.response.holdingList[0].marketValue) !== 0 ? 1 : 0, fullMark: 1 },
                        { subject: 'No. Lots', [action.response.holdingList[0].name]: Number(action.response.holdingList[0].noLots) !== 0 ? 1 : 0, fullMark: 1 },
                        { subject: 'Total Loss', [action.response.holdingList[0].name]: Number(action.response.holdingList[0].totalGain) < 0 ?  1 : 0, fullMark: 1},
                        { subject: 'Total Gain', [action.response.holdingList[0].name]: Number(action.response.holdingList[0].totalGain) > 0 ?  1 : 0, fullMark: 1 },
                        { subject: 'Std', [action.response.holdingList[0].name]: 1, fullMark: 1},
                    ]
                } else {
                    
                    const maxMv = Math.max(...action.response.holdingList.map((x) => Number(x.marketValue)))
                    const maxLots = Math.max(...action.response.holdingList.map((x) => Number(x.noLots)))
                    const maxLoss = Math.min(...action.response.holdingList.map((x) => Number(x.totalGain)))
                    const maxGain = Math.max(...action.response.holdingList.map((x) => Number(x.totalGain)))
                    const maxStd = Math.max(...action.response.holdingList.map((x) => Number(x.std)))
                    portfolioRadarChart = ['Market Value', 'No. Lots', 'Total Loss', 'Total Gain', 'Std'].map((name) => {
                        var radar = {subject: name}
                        var i
                        // format data
                        for (i = 0; i < action.response.holdingList.length; i++) {
                            if (name === 'Market Value') {
                                radar = {
                                    ...radar,
                                    [action.response.holdingList[i].name]: (Number(action.response.holdingList[i].marketValue) / maxMv).toFixed(2),
                                   
                                }
                            } else if (name === 'No. Lots') {
                                radar = {
                                    ...radar,
                                    [action.response.holdingList[i].name]: (Number(action.response.holdingList[i].noLots) / maxLots).toFixed(2),
                                    
                                }
                            } else if (name === 'Total Loss') {
                                radar = {
                                    ...radar,
                                    [action.response.holdingList[i].name]: Number(action.response.holdingList[i].totalGain) < 0 ?  (Number(action.response.holdingList[i].totalGain) * (-1) / (maxLoss * (-1))).toFixed(2) : 0,
                                 
                                }
                            } else if (name === 'Total Gain') {
                                radar = {
                                    ...radar,
                                    [action.response.holdingList[i].name]: Number(action.response.holdingList[i].totalGain) > 0 ?  (Number(action.response.holdingList[i].totalGain) / (maxGain)).toFixed(2) : 0,
                               
                                }
                            } else if (name === 'Std') {
                                radar = {
                                    ...radar,
                                    [action.response.holdingList[i].name]: (Number(action.response.holdingList[i].std) / maxStd).toFixed(2),
                               
                                }
                            }
                            if (i === action.response.holdingList.length - 1) {
                                radar = {
                                    ...radar,
                                    fullMark: 1
                                }
                            }
                        }
                        return radar
                    })


                }
            }

            return {
                ...state,
                holdingListData: action.response.holdingList,
                transactionData: action.response.transactions,
                transactionComposedChart: action.response.symbolData,
                portfolioComposedChart: action.response.composedChartList,
                statisticsPanel: {...state.statisticsPanel, portfolioValue: portfolioStatisticsPanel.portfolioValue, totalGain: portfolioStatisticsPanel.totalGain, dailyGain: portfolioStatisticsPanel.dailyGain},
                radarChart: portfolioRadarChart,
                currentTransactionChart: state.currentTransactionSymbol === null ? state.currentTransactionChart : action.response.symbolData[state.currentTransactionSymbol],
                currentTransactionData: state.currentTransactionSymbol === null ? state.currentTransactionData : action.response.transactions[state.currentTransactionSymbol],
                pieChart: pieChart,
                fetchingPortfolio: false
            };
        // cache transaction reducer
        case SETCURRENTTRANSACTION:
            return {
                ...state,
                currentTransactionSymbol: action.symbol,
                currentTransactionData: state.transactionData[action.symbol],
                currentTransactionChart: state.transactionComposedChart[action.symbol]
            };
        // get stock list
        case GETSTOCKLIST_REQUEST:
            return {
                ...state,
                fetchingStockList: true
            }
        // get stock list
        case GETSTOCKLIST_SUCCESS:
            return {
                ...state,
                completeStockList: action.response,
                fetchingStockList: false

            }
        // logout reducer
        case LOGOUTUSER:
            return {
                statisticsPanel: {budget: 0, balance: 0, portfolioValue: 0, totalGain: 0, dailyGain: 0, totalProfit: 0},
                radarChart: [
                    { subject: 'Market Value', 'New Symbol': 0, fullMark: 1 },
                    { subject: 'No. Lots', 'New Symbol': 0, fullMark: 1 },
                    { subject: 'Total Loss', 'New Symbol': 0, fullMark: 1 },
                    { subject: 'Total Gain', 'New Symbol': 0, fullMark: 1 },
                    { subject: 'Std', 'New Symbol': 0, fullMark: 1 },
                ],
                pieChart: [{name: 'New Symbol', value: 100}],
                portfolioComposedChart: generateDate(),
                holdingListData: [],
                transactionData: {},
                transactionComposedChart: {},
                currentTransactionData: [],
                currentTransactionSymbol: null,
                currentTransactionChart: generateDate(),
                completeStockList:[],
                fetchingPortfolio: false,
                fetchingStockList: false,
                currentStockDetailSymbolShort: null,
                currentStockDetailSymbol: null,
                currentStockDeatilData: [],
                predictHistory: [],
                predictFuture: [],
                predictionError: {},
                getStockRequest: false,
                predictHistoryRequest: false,
                predictFutureRequest: false,
                news: [],
                loadingNews: false,
                newsPage: 1,
                searchNewsKeyword: '',
                searchNews: [],
                loadingSearchNews: false,
                searchNewsPage: 1,
                previousStockDetailSymbolShort: null,
                searchView: false,
                recommendedStockList: [],
                fetchingRecommendedStockList: false
            }
        // get single stock 
        case GETSTOCK_SUCCESS:
            const stockDetailData = action.response.map(x => ({...x, date: new Date(x.date)}))
            return {
                ...state,
                currentStockDeatilData: stockDetailData,
                getStockRequest: false

            }
        case GETSTOCK_REQUEST:
            return {
                ...state,
                getStockRequest: true
            }
        // cache stock data
        case SETSTOCKSYMBOLNAME:
            return {
                ...state,
                currentStockDetailSymbol: action.companyName === undefined ? null : action.companyName,
                currentStockDetailSymbolShort: action.symbol === undefined ? null : action.symbol
            }
        // predict history reducer
        case PREDICTHISTORY_SUCCESS:

            return {
                ...state,
                predictHistory: calculatePrediction(action.response.result),
                predictionError: {historyErrors: action.response.historyErrors, futureErrors: action.response.futureErrors},
                predictHistoryRequest: false
            }
        case PREDICTHISTORY_REQUEST:
            return {
                ...state,
                predictHistoryRequest: true
            }
        case PREDICTFUTURE_SUCCESS:
            return {
                ...state,
                predictFuture: calculatePrediction(action.response.result),
                predictFutureRequest: false
            }
        // predict future reducer
        case PREDICTFUTURE_REQUEST:
            return {
                ...state,
                predictFutureRequest: true
            }

        // get news data
        case GETNEWS_REQUEST:
            return {
                ...state,
                loadingNews: true,
                searchView: false
            }
        case GETNEWS_SUCCESS:
            if (action.response.symbol === state.previousStockDetailSymbolShort) {
                return {
                    ...state,
                    news: [...state.news, ...action.response.news],
                    loadingNews: false,
                    newsPage: state.newsPage + 1
    
                }
            } else {
                return {
                    ...state,
                    news: action.response.news,
                    loadingNews: false,
                    newsPage: 2,
                    previousStockDetailSymbolShort: action.response.symbol
                }
            }

        // search news reducer
        case SEARCHNEWS_REQUEST:
            return {
                ...state,
                loadingSearchNews: true,
                news: [],
                loadingNews: false,
                newsPage: 1,
                searchView: true

            }
        case SEARCHNEWS_SUCCESS:
            if (action.response.symbol === state.previousStockDetailSymbolShort && state.searchNewsKeyword === action.response.keyword) {
                return {
                    ...state,
                    loadingSearchNews: false,
                    searchNews: [...state.searchNews, ...action.response.news],
                    searchNewsPage: state.searchNewsPage + 1,
                }
            } else {
                return {
                    ...state,
                    loadingSearchNews: false,
                    searchNews: action.response.news,
                    searchNewsPage: 2,
                    searchNewsKeyword: action.response.keyword,
                }
            }

        // get recommended stock reducer
        case GETRECOMMENDEDSTOCK_REQUEST:
                return {
                    ...state,
                    fetchingRecommendedStockList: true
                }
        case GETRECOMMENDEDSTOCK_SUCCESS:
            const symbolDic = state.completeStockList.reduce((c, x) => ({...c, [x.name]: x.symbolName}), {})
            
            return {
                ...state,
                recommendedStockList: action.response.map(x => ({...x, 'symbolName': symbolDic[x.name]})),
                fetchingRecommendedStockList: false

            }


        default:
            return state;
    }
}

