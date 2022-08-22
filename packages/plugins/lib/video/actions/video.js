'use strict';

import { basicAction } from '@peace/utils'
import { ApiTable } from '$utils'
import { Request } from '@peace/utils'
//videoList
export const VIDEO_LIST_REQUEST = 'VIDEO_LIST_REQUEST';
export const VIDEO_LIST_SUCCESS = 'VIDEO_LIST_SUCCESS';
export const VIDEO_LIST_FAILURE = "VIDEO_LIST_FAILURE";
function requestVideoList() {
    return {
        type: VIDEO_LIST_REQUEST
    }
}
function receiveVideoList(items) {
    return {
        type: VIDEO_LIST_SUCCESS,
        payload: { items }
    }
}
function failVideoList(error) {
    return {
        type: VIDEO_LIST_FAILURE,
        payload: { error: error },
        error: '获取视频列表失败'
    }
}
export function getVideoList(structureId) {
    return dispatch => {
        dispatch(requestVideoList());
        const url = ApiTable.getVideoList.replace('{structureId}', structureId);
        return Request.get(url).then(res =>
            dispatch(receiveVideoList(res))
            , error => dispatch(failVideoList(error)));
    }
}

//stationVideoInfo
export const STATION_VIDEO_INFO_REQUEST = 'STATION_VIDEO_INFO_REQUEST';
export const STATION_VIDEO_INFO_SUCCESS = 'STATION_VIDEO_INFO_SUCCESS';
export const STATION_VIDEO_INFO_FAILURE = "STATION_VIDEO_INFO_FAILURE";
function requestStationVideoInfo() {
    return {
        type: STATION_VIDEO_INFO_REQUEST
    }
}
function receiveStationVideoInfo(items) {
    return {
        type: STATION_VIDEO_INFO_SUCCESS,
        payload: { items }
    }
}
function failStationVideoInfo(error) {
    return {
        type: STATION_VIDEO_INFO_FAILURE,
        payload: { error: error },
        error: '获取测点关联视频信息失败'
    }
}
export function getStationVideoInfo(stationIds) {
    return (dispatch) => {
        if (stationIds.length == 1 && stationIds[0] == undefined) {
            return
        }
        dispatch(requestStationVideoInfo());
        const url = ApiTable.getStationVideoInfo.replace('{stationIds}', stationIds);
        return Request.get(url).then(res =>
            dispatch(receiveStationVideoInfo(res))
            , error => dispatch(failStationVideoInfo(error)));

    }
}

export const VIDEO_AccessToken_REQUEST = 'VIDEO_AccessToken_REQUEST';
export const VIDEO_AccessToken_SUCCESS = 'VIDEO_AccessToken_SUCCESS';
export const VIDEO_AccessToken_FAILURE = "VIDEO_AccessToken_FAILURE";
function requestVideoAccessToken() {
    return {
        type: VIDEO_AccessToken_REQUEST
    }
}
function receiveVideoAccessToken(items) {
    return {
        type: VIDEO_AccessToken_SUCCESS,
        payload: { items }
    }
}
function failVideoAccessToken(error) {
    return {
        type: VIDEO_AccessToken_FAILURE,
        payload: { error: error },
        error: '获取平台视频AccessToken失败'
    }
}
export function getVideoAccessToken() {
    return (dispatch) => {
        dispatch(requestVideoAccessToken());
        const url = ApiTable.getVideoAccessToken;
        return Request.get(url).then(res =>
            dispatch(receiveVideoAccessToken(res))
            , error => dispatch(failVideoAccessToken(error)));
    }
}
export default {
    getVideoList,
    getStationVideoInfo,
    getVideoAccessToken
}