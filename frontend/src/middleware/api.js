// backend api call root
const API_ROOT = 'http://localhost:8000/'

const callApi = (endpoint, options) => {
    const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

    return fetch(fullUrl, options).then(response => {
        if (!response.ok) {
            return Promise.reject(response)
        }
        return response.json()
    })
}


// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { endpoint, options } = callAPI
    const { types } = callAPI

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }

    if (typeof options !== 'object') {
        throw new Error('Specify an options object.')
    }

    if (options.method === undefined) {
        throw new Error('Specify a method in options object.')
    }

    if (options.headers === undefined) {
        throw new Error('Specify a header in options object.')
    }

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.')
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.')
    }


    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }

    const [requestType, successType, failureType] = types
    next(actionWith({ type: requestType }))

    return callApi(endpoint, options).then(
        response => next(actionWith({
            response,
            type: successType
        })),
        error => next(actionWith({
            type: failureType,
            error: error.message || 'Something bad happened'
        }))
    )
}
