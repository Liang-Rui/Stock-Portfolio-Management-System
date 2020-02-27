import { CALL_API } from '../middleware/api'


// get portfolio statistic pannel action
export const GETSTATISTICSPENEL_REQUEST = 'GETSTATISTICSPENEL_REQUEST'
export const GETSTATISTICSPENEL_SUCCESS = 'GETSTATISTICSPENEL_SUCCESS'
export const GETSTATISTICSPENEL_FAILURE = 'GETSTATISTICSPENEL_FAILURE'

const getStatisticPanelApi = (getWithToken) => ({
    [CALL_API]: {
        types: [GETSTATISTICSPENEL_REQUEST, GETSTATISTICSPENEL_SUCCESS, GETSTATISTICSPENEL_FAILURE],
        endpoint: '',
        options: getWithToken
    }
})

export const getStatisticPanel = () => dispatch => {
    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }

    return dispatch(getStatisticPanelApi(apiOption))
}


// add transaction action

export const ADDTRANSACTION_REQUEST = 'ADDTRANSACTION_REQUEST'
export const ADDTRANSACTION_SUCCESS = 'ADDTRANSACTION_SUCCESS'
export const ADDTRANSACTION_FAILURE = 'ADDTRANSACTION_FAILURE'
export const ADDTRANSACTION_INTERNAL_REQUEST = 'ADDTRANSACTION_INTERNAL_REQUEST'


const addTransactionApi = (withToken) => ({
    [CALL_API]: {
        types: [ADDTRANSACTION_REQUEST, ADDTRANSACTION_SUCCESS, ADDTRANSACTION_FAILURE],
        endpoint: 'purchase/',
        options: withToken,
    }
})


export const addTransaction = (symbol, data) => (dispatch) => {


    data.tradeDate = data.tradeDate.toISOString().substring(0, 10)

    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
        body: JSON.stringify({ symbol: symbol, date: data.tradeDate, shares: data.shares, price: data.price, action: data.action})
    }
    return dispatch(addTransactionApi(apiOption))
}



// edit transaction action

export const EDITTRANSACTION_REQUEST = 'EDITTRANSACTION_REQUEST'
export const EDITTRANSACTION_SUCCESS = 'EDITTRANSACTION_SUCCESS'
export const EDITTRANSACTION_FAILURE = 'EDITTRANSACTION_FAILURE'
export const EDITTRANSACTION_INTERNAL_REQUEST = 'EDITTRANSACTION_INTERNAL_REQUEST'

const editTransactionApi = (withToken) => ({
    [CALL_API]: {
        types: [ADDTRANSACTION_REQUEST, ADDTRANSACTION_SUCCESS, ADDTRANSACTION_FAILURE],
        endpoint: 'update/',
        options: withToken,
    }
})


export const editTransaction = (symbol, oldData, newData) => (dispatch, getState) => {
    let editTransactionData = getState().portfolio.transactionData[symbol];
    if (typeof(newData.tradeDate) === 'object') {
        const today = new Date()

        if (newData.tradeDate.toISOString().substring(0, 10) === today.toISOString().substring(0, 10) && Number(newData.tradeDate.toISOString().substring(8, 10)) !== newData.tradeDate.getDate()) {
            newData.tradeDate.setDate(newData.tradeDate.getDate() + 1)
        }
        newData.tradeDate = newData.tradeDate.toISOString().substring(0, 10)
    }
 
    const apiOption = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
        body: JSON.stringify({ symbol_id: oldData.id, date: newData.tradeDate, shares: newData.shares, price: newData.price, action: newData.action})
    }
    dispatch({ type: EDITTRANSACTION_INTERNAL_REQUEST, symbol, oldData, newData })
    return dispatch(editTransactionApi(apiOption))
}



// delete transaction action

export const DELETETRANSACTION_REQUEST = 'DELETETRANSACTION_REQUEST'
export const DELETETRANSACTION_SUCCESS = 'DELETETRANSACTION_SUCCESS'
export const DELETETRANSACTION_FAILURE = 'DELETETRANSACTION_FAILURE'
export const DELETETRANSACTION_INTERNAL_REQUEST = 'DELETETRANSACTION_INTERNAL_REQUEST'

const deleteTransactionApi = (withToken) => ({
    [CALL_API]: {
        types: [ADDTRANSACTION_REQUEST, ADDTRANSACTION_SUCCESS, ADDTRANSACTION_FAILURE],
        endpoint: 'delete/',
        options: withToken,
    }
})

export const deleteTransaction = (symbol, oldData) => (dispatch) => {

    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
        body: JSON.stringify({ symbol_id: oldData.id})
    }
    dispatch({ type: DELETETRANSACTION_INTERNAL_REQUEST, symbol, oldData })
    return dispatch(deleteTransactionApi(apiOption))
}


// add stock symbol to holding list


export const ADDSYMBOL_REQUEST = 'ADDSYMBOL_REQUEST'
export const ADDSYMBOL_SUCCESS = 'ADDSYMBOL_SUCCESS'
export const ADDSYMBOL_FAILURE = 'ADDSYMBOL_FAILURE'

const addSymbolApi = (withToken) => ({
    [CALL_API]: {
        types: [ADDSYMBOL_REQUEST, ADDSYMBOL_SUCCESS, ADDSYMBOL_FAILURE],
        endpoint: 'add/',
        options: withToken
    }
})

export const addSymbol = (symbol) => dispatch => {
    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
        body: JSON.stringify({ symbol: symbol, date: new Date().toISOString().substring(0, 10)})
    }

    return dispatch(addSymbolApi(apiOption))
}


// delete stock symbol on holding list

export const DELETESYMBOL_REQUEST = 'DELETESYMBOL_REQUEST'
export const DELETESYMBOL_SUCCESS = 'DELETESYMBOL_SUCCESS'
export const DELETESYMBOL_FAILURE = 'DELETESYMBOL_FAILURE'
export const DELETESYMBOL_INTERNAL_REQUEST = 'DELETESYMBOL_INTERNAL_REQUEST'

const deleteSymbolApi = (withToken) => ({
    [CALL_API]: {
        types: [DELETESYMBOL_REQUEST, DELETESYMBOL_SUCCESS, DELETESYMBOL_FAILURE],
        endpoint: 'remove/',
        options: withToken
    }
})

export const deleteSymbol = (oldData) => (dispatch) => {
    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
        body: JSON.stringify({ symbol: oldData.name })
    }
    dispatch({ type: DELETESYMBOL_INTERNAL_REQUEST, oldData })
    return dispatch(deleteSymbolApi(apiOption))
}


// get portfolio data action
export const GETPORTFOLIO_REQUEST = 'GETPORTFOLIO_REQUEST'
export const GETPORTFOLIO_SUCCESS = 'GETPORTFOLIO_SUCCESS'
export const GETPORTFOLIO_FAILURE = 'GETPORTFOLIO_FAILURE'


const getPortfolioApi = (withToken) => ({
    [CALL_API]: {
        types: [GETPORTFOLIO_REQUEST, GETPORTFOLIO_SUCCESS, GETPORTFOLIO_FAILURE],
        endpoint: 'profolio/',
        options: withToken
    }
})

export const getPortfolio = () => (dispatch) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }

    return dispatch(getPortfolioApi(apiOption))
}

export const SETCURRENTTRANSACTION = (symbol) => ({
    type: SETCURRENTTRANSACTION,
    symbol,
})


// get stock list action
export const GETSTOCKLIST_REQUEST = 'GETSTOCKLIST_REQUEST'
export const GETSTOCKLIST_SUCCESS = 'GETSTOCKLIST_SUCCESS'
export const GETSTOCKLIST_FAILURE = 'GETSTOCKLIST_FAILURE'

const getStockListApi = (withToken) => ({
    [CALL_API]: {
        types: [GETSTOCKLIST_REQUEST, GETSTOCKLIST_SUCCESS, GETSTOCKLIST_FAILURE],
        endpoint: 'stocks/',
        options: withToken
    }
})

export const getStockList = () => (dispatch) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }

    return dispatch(getStockListApi(apiOption))
}

// get single stock action
export const GETSTOCK_REQUEST = 'GETSTOCK_REQUEST'
export const GETSTOCK_SUCCESS = 'GETSTOCK_SUCCESS'
export const GETSTOCK_FAILURE = 'GETSTOCK_FAILURE'
export const SETSTOCKSYMBOLNAME = 'SETSTOCKSYMBOLNAME'

const getStockApi = (withToken, symbol) => ({
    [CALL_API]: {
        types: [GETSTOCK_REQUEST, GETSTOCK_SUCCESS, GETSTOCK_FAILURE],
        endpoint: 'stocks/' + symbol + '/chart/',
        options: withToken
    }
})

export const getStock = (symbol) => (dispatch, getState) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
    const symbolDic = getState().portfolio.completeStockList.reduce((c,x) => ({...c, [x.name]: x.symbolName}), {})
    const companyName = symbolDic[symbol]
    dispatch({ type: SETSTOCKSYMBOLNAME,  companyName, symbol})
    return dispatch(getStockApi(apiOption, symbol))
}


// get stock prediction history action
export const PREDICTHISTORY_REQUEST = 'PREDICTHISTORY_REQUEST'
export const PREDICTHISTORY_SUCCESS = 'PREDICTHISTORY_SUCCESS'
export const PREDICTHISTORY_FAILURE = 'PREDICTHISTORY_FAILURE'

const predictHistoryApi = (withToken, symbol) => ({
    [CALL_API]: {
        types: [PREDICTHISTORY_REQUEST, PREDICTHISTORY_SUCCESS, PREDICTHISTORY_FAILURE],
        endpoint: 'stocks/' + symbol + '/predict/history',
        options: withToken
    }
})

export const predictHistory = (symbol) => (dispatch) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
    
    return dispatch(predictHistoryApi(apiOption, symbol))
    
}

// get stock prediction future action

export const PREDICTFUTURE_REQUEST = 'PREDICTFUTURE_REQUEST'
export const PREDICTFUTURE_SUCCESS = 'PREDICTFUTURE_SUCCESS'
export const PREDICTFUTURE_FAILURE = 'PREDICTFUTURE_FAILURE'

const predictFutureApi = (withToken, symbol) => ({
    [CALL_API]: {
        types: [PREDICTFUTURE_REQUEST, PREDICTFUTURE_SUCCESS, PREDICTFUTURE_FAILURE],
        endpoint: 'stocks/' + symbol + '/predict/future',
        options: withToken
    }
})

export const predictFuture = (symbol) => (dispatch) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
    
    return dispatch(predictFutureApi(apiOption, symbol))
    
}

// get news data action

export const GETNEWS_REQUEST = 'GETNEWS_REQUEST'
export const GETNEWS_SUCCESS = 'GETNEWS_SUCCESS'
export const GETNEWS_FAILURE = 'GETNEWS_FAILURE'

const getNewsApi = (withToken, symbol, page) => ({
    [CALL_API]: {
        types: [GETNEWS_REQUEST, GETNEWS_SUCCESS, GETNEWS_FAILURE],
        endpoint: 'news/' + symbol + '/' + page,
        options: withToken
    }
})

export const getNews = (symbol, page) => (dispatch) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
    
    return dispatch(getNewsApi(apiOption, symbol, page))
    
}

export const loadMoreNews = () => (dispatch, getState) => {
    const symbol = getState().portfolio.currentStockDetailSymbolShort
    const page = getState().portfolio.newsPage
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
    return dispatch(getNewsApi(apiOption, symbol, page))
}


// search news data action
export const SEARCHNEWS_REQUEST = 'SEARCHNEWS_REQUEST'
export const SEARCHNEWS_SUCCESS = 'SEARCHNEWS_SUCCESS'
export const SEARCHNEWS_FAILURE = 'SEARCHNEWS_FAILURE'

const searchNewsApi = (withToken, symbol, keyword, page) => ({
    [CALL_API]: {
        types: [SEARCHNEWS_REQUEST, SEARCHNEWS_SUCCESS, SEARCHNEWS_FAILURE],
        endpoint: 'news/' + 'search/' + symbol + '/' + keyword + '/' + page,
        options: withToken
    }
})

export const searchNews = (symbol, keyword, page) => (dispatch) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
  
    
    return dispatch(searchNewsApi(apiOption, symbol, keyword, page))
    
}

export const loadMoreSearchNews = () => (dispatch, getState) => {
    
    const symbol = getState().portfolio.currentStockDetailSymbolShort.trim()
    const keyword = encodeURIComponent(getState().portfolio.searchNewsKeyword.trim())
    const page = getState().portfolio.searchNewsPage
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
 
    return dispatch(searchNewsApi(apiOption, symbol, keyword, page))
}




// get recommended stock action

export const GETRECOMMENDEDSTOCK_REQUEST = 'GETRECOMMENDEDSTOCK_REQUEST'
export const GETRECOMMENDEDSTOCK_SUCCESS = 'GETRECOMMENDEDSTOCK_SUCCESS'
export const GETRECOMMENDEDSTOCK_FAILURE = 'GETRECOMMENDEDSTOCK_FAILURE'

const getRecommendedStockApi = (withToken) => ({
    [CALL_API]: {
        types: [GETRECOMMENDEDSTOCK_REQUEST, GETRECOMMENDEDSTOCK_SUCCESS, GETRECOMMENDEDSTOCK_FAILURE],
        endpoint: 'recommendedStocks/',
        options: withToken
    }
})

export const getRecommendedStock = () => (dispatch) => {
    const apiOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
    
    return dispatch(getRecommendedStockApi(apiOption))
    
}
