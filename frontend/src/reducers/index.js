import * as ActionTypes from '../actions'
import { combineReducers } from 'redux'
import { authUser } from './userAuth'
import { portfolio } from './portfolioReducer'


// User profile reducer.
const userProfile = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.PROFILE_SUCCESS:
            return {
                ...state,
                ...action.response
            }
        default:
            return state
    }
}


// PostListView reducer.
const postListViewInitialState = {
    isFetching: false,
    nextPageUrl: null,
    pageCount: 0,
    items: [],
    currentOrdering: null
}

const postListView = (state = postListViewInitialState, action) => {
    switch (action.type) {
        case ActionTypes.POST_REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case ActionTypes.POST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                nextPageUrl: action.response.next,
                pageCount: state.pageCount + 1,
                items: [...state.items, ...action.response.results]
            };
        case ActionTypes.CHANGE_POST_LIST_ORDERING:
            return {
                ...state,
                nextPageUrl: null,
                pageCount: 0,
                items: [],
                currentOrdering: action.ordering
            };
        default:
            return state;
    }
}


// PostDetailView reducer.
const postDetailInitialState = {
    cache: {},
    currentPostDetail: null,
    postDetailLoading: false
}

const postDetailView = (state = postDetailInitialState, action) => {
    switch (action.type) {
        case ActionTypes.POST_DETAIL_REQUEST:
            return {
                ...state,
                currentPostDetail: null,
                postDetailLoading: true
            };
        case ActionTypes.POST_DETAIL_SUCCESS: {
            const newPostDetail = { postDetail: action.response, toc: null, headerPositionList: [] }
            return {
                ...state,
                cache: { ...state.cache, [action.response.slug]: newPostDetail },
                currentPostDetail: newPostDetail,
                postDetailLoading: false
            };
        }
        case ActionTypes.POST_DETAIL_FAILURE:
            return {
                ...state,
                currentPostDetail: null
            };
        case ActionTypes.RETRIEVE_CACHED_POST_DETAIL:
            return {
                ...state,
                currentPostDetail: state.cache[action.slug]
            }
        case ActionTypes.SAVE_POST_TOC:
            return {
                ...state,
                cache: { ...state.cache, [action.slug]: { ...state.cache[action.slug], toc: action.toc } },
                currentPostDetail: { ...state.currentPostDetail, toc: action.toc }
            }
        case ActionTypes.SAVE_POST_HEADER_LIST:
            return {
                ...state,
                cache: { ...state.cache, [action.slug]: { ...state.cache[action.slug], headerPositionList: action.headerPositionList } },
                currentPostDetail: { ...state.currentPostDetail, headerPositionList: action.headerPositionList }
            }
        default:
            return state;
    }
}


// RecommendPostView reducer.
const recommendPostViewInitialState = {
    isFetching: false,
    nextPageUrl: null,
    pageCount: 0,
    items: []
}

const recommendPostView = (state = recommendPostViewInitialState, action) => {
    switch (action.type) {
        case ActionTypes.RECOMMEND_POST_REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case ActionTypes.RECOMMEND_POST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                nextPageUrl: action.response.next,
                pageCount: state.pageCount + 1,
                items: [...state.items, ...action.response.results]
            };
        default:
            return state;
    }
}


// TopRecommendPost reducer.
const topRecommendPost = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.TOP_RECOMMEND_POST_SUCCESS: {
            if (action.response.length > 0) {
                return action.response[0]
            }
            return state
        }
        default:
            return state
    }
}


// Drawer reducer.
const drawerInitialState = {
    leftDrawerOpened: false,
    drawerCategoryGrouped: {},
    drawerCategory: {},
    selectedCategoryIndex: null
}

const leftDrawer = (state = drawerInitialState, action) => {
    switch (action.type) {
        case ActionTypes.DRAWER_CATEGORY_SUCCESS: {
            const newGroupByCategory = action.response.reduce((accu, obj) => {
                var key = obj['category'];
                if (!accu[key]) {
                    accu[key] = [];
                }
                accu[key].push(obj);
                return accu;
            }, {})
            const categoryList = Object.assign({}, ...action.response.map(item => ({ [item['category']]: false })));
            return {
                ...state,
                drawerCategory: categoryList,
                drawerCategoryGrouped: { ...state.drawerCategoryGrouped, ...newGroupByCategory }
            }
        }
        case ActionTypes.TOGGLE_DRAWER:
            return {
                ...state,
                leftDrawerOpened: !state.leftDrawerOpened
            }
        case ActionTypes.TOGGLE_DRAWER_CATEGORY_COLLAPSE:
            return {
                ...state,
                drawerCategory: { ...state.drawerCategory, [action.item]: !state.drawerCategory[action.item] }
            }
        case ActionTypes.DRAWER_CATEGORY_SELECT_POST:
            return {
                ...state,
                selectedCategoryIndex: action.index,
                leftDrawerOpened: false
            }
        case ActionTypes.RESET_CATEGORY_SELECT_POST:
            return {
                ...state,
                selectedCategoryIndex: null
            }
        case ActionTypes.SELECT_ONE_CATEGORY_FROM_DRAWER: {
            const categoryList = Object.keys(state.drawerCategory).map((item) => {
                if (item === action.category) {
                    return { [item]: true }
                }
                return { [item]: false }
            })
            return {
                ...state,
                drawerCategory: Object.assign({}, ...categoryList),
                leftDrawerOpened: true
            }
        }
        default:
            return state
    }

}


// Scorll postition reducer, save previous path scroll position or retrieve previous visited page position.
const scrollPositionCache = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.SAVE_SCROLL_POSITION: {
            return {
                ...state,
                [action.path]: action.position
            }
        }
        default:
            return state
    }
}


// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
    const { type, error } = action

    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
        return null
    } else if (error) {
        return error
    }

    return state
}



const rootReducer = combineReducers({
    scrollPositionCache,
    userProfile,
    leftDrawer,
    topRecommendPost,
    recommendPostView,
    postListView,
    postDetailView,
    errorMessage,
    authUser,
    portfolio

})

export default rootReducer
