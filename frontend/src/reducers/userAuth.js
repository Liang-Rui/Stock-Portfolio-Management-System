import {
    AUTHUSER_REQUEST,
    AUTHUSER_SUCCESS,
    AUTHUSER_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUTUSER,
    CHANGEPASSWORD_REQUEST,
    CHANGEPASSWORD_SUCCESS,
    CHANGEPASSWORD_FAILURE,
    CLEARCHANGEPASSWORD
} from '../actions/userAuth'


const authUserInitialState = {
    token: localStorage.getItem('stockMasterUserToken'),
    isFetching: false,
    user: JSON.parse(localStorage.getItem('stockMasterUser')),
    loginError: false,
    registerFetching: false,
    registerError: false,
    changePasswordFetching: false,
    changePasswordSuccess: false,
    changePasswordFailed: false

}

export const authUser = (state = authUserInitialState, action) => {
    switch (action.type) {
        case AUTHUSER_REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case AUTHUSER_SUCCESS:
            localStorage.setItem('stockMasterUserToken', action.response.token)
            localStorage.setItem('stockMasterUser', JSON.stringify(action.response.user))
            return {
                ...state,
                isFetching: false,
                token: action.response.token,
                user: action.response.user,
            };
        case AUTHUSER_FAILURE:
            return {
                ...state,
                loginError: true,
                isFetching: false
            };
        case REGISTER_REQUEST:
            return {
                ...state,
                registerFetching: true
            };
        case REGISTER_SUCCESS:
            localStorage.setItem('stockMasterUserToken', action.response.token)
            localStorage.setItem('stockMasterUser', JSON.stringify(action.response.user))
            return {
                ...state,
                token: action.response.token,
                user: action.response.user,
                registerFetching: false,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                registerFetching: false,
                registerError: true
            };
        case LOGOUTUSER:
            localStorage.removeItem('stockMasterUserToken')
            localStorage.removeItem('stockMasterUser')
            return {
                ...state,
                token: null,
                isFetching: false,
                user: null,
                loginError: false,
                registerFetching: false,
                registerError: false,
            };
        case CHANGEPASSWORD_REQUEST:
            return {
                ...state,
                changePasswordFetching: true
            }
        case CHANGEPASSWORD_SUCCESS:
            return {
                ...state,
                changePasswordFetching: false,
                changePasswordSuccess: true
            }
        case CHANGEPASSWORD_FAILURE:
            return {
                ...state,
                changePasswordFetching: false,
                changePasswordSuccess: false,
                changePasswordFailed: true
            }
        case CLEARCHANGEPASSWORD:
            return {
                ...state,
                changePasswordFetching: false,
                changePasswordSuccess: false,
                changePasswordFailed: false
            }
        default:
            return state;
    }
}

