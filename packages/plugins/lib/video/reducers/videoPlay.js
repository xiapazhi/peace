'use strict'
import * as actionTypes from '../actions/videoPlay';

const initRealTimeVideoState = {
    items: null,
    isRequesting: false,
    error: null
}
function realTimeVideo(state = initRealTimeVideoState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.REALTIME_VIDEO_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: null, error: null });
        case actionTypes.REALTIME_VIDEO_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.REALTIME_VIDEO_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}

const initHistoryVideoState = {
    items: null,
    isRequesting: false,
    error: null
}
function historyVideo(state = initHistoryVideoState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.HISTORY_VIDEO_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: null, error: null });
        case actionTypes.HISTORY_VIDEO_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.HISTORY_VIDEO_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}

const initCurrentTimeHistoryVideoState = {
    items: null,
    isRequesting: false,
    error: null
}
function currentTimeHistoryVideo(state = initCurrentTimeHistoryVideoState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.CURRENT_TIME_HISTORY_VIDEO_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: null, error: null });
        case actionTypes.CURRENT_TIME_HISTORY_VIDEO_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.CURRENT_TIME_HISTORY_VIDEO_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}

const initPTZControlVideoState = {
    items: null,
    isRequesting: false,
    error: null
}
function ptzControlVideo(state = initPTZControlVideoState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.PTZ_CONTROL_VIDEO_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: null, error: null });
        case actionTypes.PTZ_CONTROL_VIDEO_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.PTZ_CONTROL_VIDEO_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}
const initHeartBeatVideoState = {
    items: null,
    isRequesting: false,
    error: null
}
function heartBeatVideo(state = initHeartBeatVideoState, action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.HEART_BEAT_VIDEO_REQUEST:
            return Object.assign({}, state, { isRequesting: true, items: null, error: null });
        case actionTypes.HEART_BEAT_VIDEO_SUCCESS:
            return Object.assign({}, state, { isRequesting: false, items: payload.items });
        case actionTypes.HEART_BEAT_VIDEO_FAILURE:
            return Object.assign({}, state, { isRequesting: false, error: payload.error });
        default:
            return state;

    }
}
export {
    realTimeVideo,
    historyVideo,
    currentTimeHistoryVideo,
    ptzControlVideo,
    heartBeatVideo
}