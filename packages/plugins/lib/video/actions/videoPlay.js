'use strict'
import request from 'superagent';
import { RouteTable } from '$utils'
import { RouteRequest } from '@peace/utils'
//realtimeVideo
export const REALTIME_VIDEO_REQUEST = 'REALTIME_VIDEO_REQUEST';
export const REALTIME_VIDEO_SUCCESS = 'REALTIME_VIDEO_SUCCESS';
export const REALTIME_VIDEO_FAILURE = "REALTIME_VIDEO_FAILURE";
function requestRealTimeVideo() {
    return {
        type: REALTIME_VIDEO_REQUEST,
    }
}
function receiveRealTimeVideo(res) {
    return {
        type: REALTIME_VIDEO_SUCCESS,
        payload: { items: res, error: null },
    }
}
function failRealTimeVideo(error) {
    return {
        type: REALTIME_VIDEO_FAILURE,
        payload: { items: null, error: '获取实时视频' + error },
    }
}
export function getRealTimeVideo(nvrInfo) {
    return dispatch => {
        dispatch(requestRealTimeVideo());
        return RouteRequest.post(RouteTable.realtimeVideo, nvrInfo)
            .then(res => dispatch(receiveRealTimeVideo(res))
            , error => dispatch(failRealTimeVideo(error)));
    }
}

//historyVideo
export const HISTORY_VIDEO_REQUEST = 'HISTORY_VIDEO_REQUEST';
export const HISTORY_VIDEO_SUCCESS = 'HISTORY_VIDEO_SUCCESS';
export const HISTORY_VIDEO_FAILURE = "HISTORY_VIDEO_FAILURE";
function requestHistoryVideo() {
    return {
        type: HISTORY_VIDEO_REQUEST,
    }
}
function receiveHistoryVideo(res) {
    return {
        type: HISTORY_VIDEO_SUCCESS,
        payload: { items: res, error: null },
    }
}
function failHistoryVideo(error) {
    return {
        type: HISTORY_VIDEO_FAILURE,
        payload: { items: null, error: '获取历史视频' + error },
    }
}
export function getHistoryVideo(nvrInfo) {
    return dispatch => {
        dispatch(requestHistoryVideo());
        return RouteRequest.post(RouteTable.videoPlayback, nvrInfo)
            .then(res => dispatch(receiveHistoryVideo(res))
            , error => dispatch(failHistoryVideo(error)));
    }
}

//curTime
export const CURRENT_TIME_HISTORY_VIDEO_REQUEST = 'CURRENT_TIME_HISTORY_VIDEO_REQUEST';
export const CURRENT_TIME_HISTORY_VIDEO_SUCCESS = 'CURRENT_TIME_HISTORY_VIDEO_SUCCESS';
export const CURRENT_TIME_HISTORY_VIDEO_FAILURE = "CURRENT_TIME_HISTORY_VIDEO_FAILURE";
function requestCurrentTimeHistoryVideo() {
    return {
        type: CURRENT_TIME_HISTORY_VIDEO_REQUEST,
    }
}
function receiveCurrentTimeHistoryVideo(res) {
    return {
        type: CURRENT_TIME_HISTORY_VIDEO_SUCCESS,
        payload: { items: res, error: null },
    }
}
function failCurrentTimeHistoryVideo(error) {
    return {
        type: CURRENT_TIME_HISTORY_VIDEO_FAILURE,
        payload: { items: null, error: '获取当前时间段的历史视频' + error },
    }
}
export function getCurrentTimeHistoryVideo(currentPlayHandle) {
    return dispatch => {
        dispatch(requestCurrentTimeHistoryVideo());
        return RouteRequest.post(RouteTable.currentTimeVideoPlayback, currentPlayHandle)
            .then(res => dispatch(receiveCurrentTimeHistoryVideo(res))
            , error => dispatch(failCurrentTimeHistoryVideo(error)));
    }
}

//PTZControl
export const PTZ_CONTROL_VIDEO_REQUEST = 'PTZ_CONTROL_VIDEO_REQUEST';
export const PTZ_CONTROL_VIDEO_SUCCESS = 'PTZ_CONTROL_VIDEO_SUCCESS';
export const PTZ_CONTROL_VIDEO_FAILURE = "PTZ_CONTROL_VIDEO_FAILURE";
function requestPTZControlVideo() {
    return {
        type: PTZ_CONTROL_VIDEO_REQUEST,
    }
}
function receivePTZControlVideo(res) {
    return {
        type: PTZ_CONTROL_VIDEO_SUCCESS,
        payload: { items: res, error: null },
    }
}
function failPTZControlVideo(error) {
    return {
        type: PTZ_CONTROL_VIDEO_FAILURE,
        payload: { items: null, error: '当前摄像头云控失败' + error },
    }
}
export function getPTZControlVideo(controlType) {
    return dispatch => {
        console.log(controlType)
        dispatch(requestPTZControlVideo());
        return RouteRequest.post(RouteTable.videoControl, controlType)
            .then(res => dispatch(receivePTZControlVideo(res))
            , error => dispatch(failPTZControlVideo(error)));
    }
}

//萤石云台控制
export const YINGSHI_CONTROL_REQUEST = 'YINGSHI_CONTROL_REQUEST';
export const YINGSHI_CONTROL_SUCCESS = 'YINGSHI_CONTROL_SUCCESS';
export const YINGSHI_CONTROL_FAILURE = "YINGSHI_CONTROL_FAILURE";

const yingshiControl = 'https://open.ys7.com/api/lapp/device/ptz/start';
export function getYingshiControl(controlParam) {
    return dispatch => {
        dispatch({ type: YINGSHI_CONTROL_REQUEST });
        return request
            .post(yingshiControl)
            .send(controlParam)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(res => dispatch({
                type: YINGSHI_CONTROL_SUCCESS,
                payload: { items: res }
            })
                , error => dispatch({
                    type: YINGSHI_CONTROL_FAILURE,
                    payload: { items: error }
                }));
    }
}
//停止萤石云台控制
export const STOP_YINGSHI_REQUEST = 'STOP_YINGSHI_REQUEST';
export const STOP_YINGSHI_SUCCESS = 'STOP_YINGSHI_SUCCESS';
export const STOP_YINGSHI_FAILURE = "STOP_YINGSHI_FAILURE";
const stopYingshi = 'https://open.ys7.com/api/lapp/device/ptz/stop';
export function stopYingshiControl(param) {
    return dispatch => {
        dispatch({ type: STOP_YINGSHI_REQUEST });
        return request
            .post(stopYingshi)
            .send(param)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(res => dispatch({
                type: STOP_YINGSHI_SUCCESS,
                payload: { items: res }
            })
                , error => dispatch({
                    type: STOP_YINGSHI_FAILURE,
                    payload: { items: error }
                }));
    }
}

//heartBeat
export const HEART_BEAT_VIDEO_REQUEST = 'HEART_BEAT_VIDEO_REQUEST';
export const HEART_BEAT_VIDEO_SUCCESS = 'HEART_BEAT_VIDEO_SUCCESS';
export const HEART_BEAT_VIDEO_FAILURE = "HEART_BEAT_VIDEO_FAILURE";
function requestHeartBeatVideo() {
    return {
        type: HEART_BEAT_VIDEO_REQUEST,
    }
}
function receiveHeartBeatVideo(res) {
    return {
        type: HEART_BEAT_VIDEO_SUCCESS,
        payload: { items: res, error: null },
    }
}
function failHeartBeatVideo(error) {
    return {
        type: HEART_BEAT_VIDEO_FAILURE,
        payload: { items: null, error: '获取视频心跳失败' + error },
    }
}
export function getHeartBeatVideo(post_data) {
    return dispatch => {
        dispatch(requestHeartBeatVideo());
        return RouteRequest.post(RouteTable.heartBeat, post_data)
            .then(res => dispatch(receiveHeartBeatVideo(res))
            , error => dispatch(failHeartBeatVideo(error)));
    }
}

//stopVideo
export const STOP_VIDEO_REQUEST = 'STOP_VIDEO_REQUEST';
export const STOP_VIDEO_SUCCESS = 'STOP_VIDEO_SUCCESS';
export const STOP_VIDEO_FAILURE = "STOP_VIDEO_FAILURE";
function requestStopVideo() {
    return {
        type: STOP_VIDEO_REQUEST,
    }
}
function receiveStopVideo(res) {
    return {
        type: STOP_VIDEO_SUCCESS,
        payload: { items: '视频停止播放成功', error: null },
    }
}
function failStopVideo(error) {
    return {
        type: STOP_VIDEO_FAILURE,
        payload: { items: null, error: '视频停止播放失败' + error },
    }
}
export function stopVideo(post_data) {
    return dispatch => {
        dispatch(requestStopVideo());
        return RouteRequest.post(stopvideo, post_data)
            .then(res => dispatch(receiveStopVideo(res))
                , error => dispatch(failStopVideo(error)));
    }
}

export default {
    getRealTimeVideo,
    getHistoryVideo,
    getCurrentTimeHistoryVideo,
    getPTZControlVideo,
    getHeartBeatVideo,
    stopVideo
}
