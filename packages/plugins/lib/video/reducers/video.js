'use strict'
import * as actionTypes from '../actions/video';

const initVideoState = {
    items: [],
    isRequesting: false,
    error: null
}
function videoList(state = initVideoState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.VIDEO_LIST_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: [], error: null });
        case actionTypes.VIDEO_LIST_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.VIDEO_LIST_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}

const initStationVideoState = {
    items: [],
    isRequesting: false,
    error: null
}
function stationVideoInfo(state = initStationVideoState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.STATION_VIDEO_INFO_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: [], error: null });
        case actionTypes.STATION_VIDEO_INFO_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.VIDEO_LIST_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}

const initVideoAccessTokenState = {
    items: {},
    isRequesting: false,
    error: null
}
function videoAccessToken(state = initVideoAccessTokenState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.VIDEO_AccessToken_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: [], error: null });
        case actionTypes.VIDEO_AccessToken_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.VIDEO_AccessToken_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}

export { videoList, stationVideoInfo, videoAccessToken }