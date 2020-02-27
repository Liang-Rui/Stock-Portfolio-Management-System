import { CALL_API } from '../middleware/api'




export const AUTHUSER_REQUEST = 'AUTHUSER_REQUEST'
export const AUTHUSER_SUCCESS = 'AUTHUSER_SUCCESS'
export const AUTHUSER_FAILURE = 'AUTHUSER_FAILURE'

// Fetches user profile from backend Django API
const authUser = (postWithBody) => ({
    [CALL_API]: {
        types: [AUTHUSER_REQUEST, AUTHUSER_SUCCESS, AUTHUSER_FAILURE],
        endpoint: 'api/auth/login',
        options: postWithBody
    }
})
export const loginUser = (userName, userPassword) => dispatch => {
    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: userName, password: userPassword })
    }

    return dispatch(authUser(apiOption))
}


export const REGISTER_REQUEST = 'REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'REGISTER_FAILURE'

// Fetches user profile from backend Django API
const registerUserApiCall = (postWithBody) => ({
    [CALL_API]: {
        types: [REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE],
        endpoint: 'api/auth/register',
        options: postWithBody
    }
})
export const registerUser = (userName, userEmail, userPassword) => dispatch => {
    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: userName, email: userEmail, password: userPassword })
    }

    return dispatch(registerUserApiCall(apiOption))
}

export const LOGOUTUSER = 'LOGOUTUSER'
const logoutUserApi = (postWithToken) => ({
    [CALL_API]: {
        types: [LOGOUTUSER, LOGOUTUSER, LOGOUTUSER],
        endpoint: 'api/auth/logout',
        options: postWithToken
    }
})

export const logoutUser = () => (dispatch) => {
    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
    }
    return dispatch(logoutUserApi(apiOption))
}

// change password for user action

export const CHANGEPASSWORD_REQUEST = 'CHANGEPASSWORD_REQUEST'
export const CHANGEPASSWORD_SUCCESS = 'CHANGEPASSWORD_SUCCESS'
export const CHANGEPASSWORD_FAILURE = 'CHANGEPASSWORD_FAILURE'
const changeUserPasswordApi = (postWithToken) => ({
    [CALL_API]: {
        types: [CHANGEPASSWORD_REQUEST, CHANGEPASSWORD_SUCCESS, CHANGEPASSWORD_FAILURE],
        endpoint: 'api/auth/user/password/change',
        options: postWithToken
    }
})

export const changeUserPassword = (oldPassword, newPassword) => dispatch => {
    const apiOption = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    }
    return dispatch(changeUserPasswordApi(apiOption))
}

export const CLEARCHANGEPASSWORD = 'CLEARCHANGEPASSWORD'
export const clearChangePassword = () => ({ type: CLEARCHANGEPASSWORD })

