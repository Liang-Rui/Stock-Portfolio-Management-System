import { CALL_API } from '../middleware/api'


// defining global variable for api calls
const POST_LIST_LOADING_SIZE = 10
const RECOMMEND_POST_LIST_LOADING_SIZE = 2
const API_CALL_OPTIONS = {
    GET: {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
}
const MY_PROFILE_URL_ENDPOINT = 'user-profile/liangrui00@gmail.com/'


export const PROFILE_REQUEST = 'PROFILE_REQUEST'
export const PROFILE_SUCCESS = 'PROFILE_SUCCESS'
export const PROFILE_FAILURE = 'PROFILE_FAILURE'

// Fetches user profile from backend Django API
const fetchProfile = () => ({
    [CALL_API]: {
        types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
        endpoint: MY_PROFILE_URL_ENDPOINT,
        options: API_CALL_OPTIONS.GET
    }
})
export const loadProfile = () => (dispatch, getState) => {
    if (Object.keys(getState().userProfile).length > 0) {
        return null
    }
    return dispatch(fetchProfile())
}


export const POST_REQUEST = 'POST_REQUEST'
export const POST_SUCCESS = 'POST_SUCCESS'
export const POST_FAILURE = 'POST_FAILURE'
export const CHANGE_POST_LIST_ORDERING = 'RESET_POST_LIST_ORDERING'

// Fetches a list of posts from backend Django API
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPosts = (page, size, ordering) => ({
    [CALL_API]: {
        types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
        endpoint: 'posts/?page=' + page + '&size=' + size + '&ordering=' + ordering,
        options: API_CALL_OPTIONS.GET
    }
})

// Fetches a list of posts from backend Django API unless it is cached(postlist_length > 0).
// Relies on Redux Thunk middleware.
export const loadPosts = (ordering = null) => (dispatch) => {
    if (ordering !== null) {
        dispatch({ type: CHANGE_POST_LIST_ORDERING, ordering })
        return dispatch(fetchPosts(1, POST_LIST_LOADING_SIZE, ordering))
    }
}

// Load more posts from backend Django API.
export const loadMorePost = () => (dispatch, getState) => {
    const { nextPageUrl, pageCount, currentOrdering } = getState().postListView
    if (nextPageUrl !== null) {
        dispatch(fetchPosts(pageCount + 1, POST_LIST_LOADING_SIZE, currentOrdering))
    }
}


export const POST_DETAIL_REQUEST = 'POST_DETAIL_REQUEST'
export const POST_DETAIL_SUCCESS = 'POST_DETAIL_SUCCESS'
export const POST_DETAIL_FAILURE = 'POST_DETAIL_FAILURE'
export const RETRIEVE_CACHED_POST_DETAIL = 'RETRIEVE_CACHED_POST_DETAIL'
export const SAVE_POST_TOC = 'SAVE_POST_TOC'
export const SAVE_POST_HEADER_LIST = 'SAVE_POST_HEADER_LIST'

// Fetches a single detail of post from backend Django API
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchPostDetail = (slug) => ({
    [CALL_API]: {
        types: [POST_DETAIL_REQUEST, POST_DETAIL_SUCCESS, POST_DETAIL_FAILURE],
        endpoint: 'posts/' + slug,
        options: API_CALL_OPTIONS.GET
    }
})

// Fetches  a single detail of post from backend Django API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadPostDetail = (slug) => (dispatch, getState) => {
    if (getState().postDetailView.cache[slug]) {
        return dispatch({ type: RETRIEVE_CACHED_POST_DETAIL, slug: slug })
    }
    return dispatch(fetchPostDetail(slug))
}

export const savePostToc = (slug, toc) => ({
    type: SAVE_POST_TOC,
    slug,
    toc
})

// Save postDetail headerList action.
export const savePostHeaderList = (slug, headerPositionList) => ({
    type: SAVE_POST_HEADER_LIST,
    slug,
    headerPositionList
})


export const RECOMMEND_POST_REQUEST = 'RECOMMEND_POST_REQUEST'
export const RECOMMEND_POST_SUCCESS = 'RECOMMEND_POST_SUCCESS'
export const RECOMMEND_POST_FAILURE = 'RECOMMEND_POST_FAILURE'

// Fetches a list of recommend posts from backend Django API
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchRecommendPost = (page, size) => ({
    [CALL_API]: {
        types: [RECOMMEND_POST_REQUEST, RECOMMEND_POST_SUCCESS, RECOMMEND_POST_FAILURE],
        endpoint: 'recommended-posts/?page=' + page + '&size=' + size,
        options: API_CALL_OPTIONS.GET
    }
})

// Fetches a list of recommend posts from backend Django API unless it is cached(page > 0).
// Relies on Redux Thunk middleware.
export const loadRecommendPost = (type = null) => (dispatch, getState) => {
    if (type === 'force') {
        const { nextPageUrl, pageCount } = getState().recommendPostView
        if (nextPageUrl !== null) {
            return dispatch(fetchRecommendPost(pageCount + 1, RECOMMEND_POST_LIST_LOADING_SIZE))
        } else {
            return null
        }
    }
    if (getState().recommendPostView.pageCount > 0) {
        return null
    } else {
        return dispatch(fetchRecommendPost(1, RECOMMEND_POST_LIST_LOADING_SIZE))
    }
}


export const TOP_RECOMMEND_POST_REQUEST = 'TOP_RECOMMEND_POST_REQUEST'
export const TOP_RECOMMEND_POST_SUCCESS = 'TOP_RECOMMEND_POST_SUCCESS'
export const PTOP_RECOMMEND_POST_FAILURE = 'TOP_RECOMMEND_POST_FAILURE'

// Fetches a single top recommend post from backend Django API
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchTopRecommendPost = () => ({
    [CALL_API]: {
        types: [TOP_RECOMMEND_POST_REQUEST, TOP_RECOMMEND_POST_SUCCESS, PTOP_RECOMMEND_POST_FAILURE],
        endpoint: 'top-recommended-post/',
        options: API_CALL_OPTIONS.GET
    }
})

// Fetches a single top recommend post from backend Django API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadTopRecommendPost = (type = null) => (dispatch, getState) => {

    if (type === 'force') {
        return dispatch(fetchTopRecommendPost())
    }

    if (Object.keys(getState().topRecommendPost).length > 0) {
        return null
    }
    return dispatch(fetchTopRecommendPost())
}


export const DRAWER_CATEGORY_REQUEST = 'DRAWER_CATEGORY_REQUEST'
export const DRAWER_CATEGORY_SUCCESS = 'DRAWER_CATEGORY_SUCCESS'
export const DRAWER_CATEGORY_FAILURE = 'DRAWER_CATEGORY_FAILURE'

// Fetches a list of post category from backend Django API unless it is cached.
// Relies on Redux Thunk middleware.
const fetchSidebarCategory = () => ({
    [CALL_API]: {
        types: [DRAWER_CATEGORY_REQUEST, DRAWER_CATEGORY_SUCCESS, DRAWER_CATEGORY_FAILURE],
        endpoint: 'posts-category/',
        options: API_CALL_OPTIONS.GET
    }
})

export const loadSidebarCategory = (type = null) => (dispatch, getState) => {
    if (type === 'force') {
        return dispatch(fetchSidebarCategory())
    }
    if (getState().sideBarCategory !== undefined) {
        return null
    }
    return dispatch(fetchSidebarCategory())
}


// Toggle drawer action.
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER'
export const toggleDrawer = () => ({ type: TOGGLE_DRAWER })


// Handle drawer category collapse.
export const TOGGLE_DRAWER_CATEGORY_COLLAPSE = 'TOGGLE_DRAWER_CATEGORY_COLLAPSE'
export const collapDrawerCategory = (item) => ({
    type: TOGGLE_DRAWER_CATEGORY_COLLAPSE,
    item
})

// Handle drawer category selection.
export const DRAWER_CATEGORY_SELECT_POST = 'DRAWER_CATEGORY_SELECT_POST'
export const selectDrawerCategoryArticle = (index) => ({
    type: DRAWER_CATEGORY_SELECT_POST,
    index
})

// reset all selected post in the drawer
export const RESET_CATEGORY_SELECT_POST = 'RESET_CATEGORY_SELECT_POST'
export const resetCategorySelectPost = () => ({
    type: RESET_CATEGORY_SELECT_POST
})

// select and open only one category from drawer and close all others
export const SELECT_ONE_CATEGORY_FROM_DRAWER = 'SELECT_ONE_CATEGORY_FROM_DRAWER'
export const selectOneCategoryFromDrawer = (category) => ({
    type: SELECT_ONE_CATEGORY_FROM_DRAWER,
    category
})

// Reset global api error message.
export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})


// Scorll postition action, save previous path scroll position.
export const SAVE_SCROLL_POSITION = 'SAVE_SCROLL_POSITION'
export const saveScrollPosition = (path, position) => ({
    type: SAVE_SCROLL_POSITION,
    path,
    position
})

