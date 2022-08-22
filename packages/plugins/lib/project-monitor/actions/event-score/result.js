import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

const EventScoreLatestGetTypes = {
  Requesting: 'GET_EVENT_SCORE_LATEST_REQUEST',
  RequestSuccess: 'GET_EVENT_SCORE_LATEST_SUCCESS',
  RequestError: 'GET_EVENT_SCORE_LATEST_ERROR',
};
function getEventScoreLatest(ids) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_EVENT_SCORE_LATEST',
    url: `${ApiTable.getEventScoreLatest}?structures=${ids}`,
    msg: {
      error: '结构物最新事件评分查询失败',
    },
    reducer: {
      name: 'eventScoreLatest',
    },
    callback: (res) => res && res.length && res.reduce((p, c) => {
      p[`${c.structId}`] = c;
      return p;
    }, {}) || null,
  });
}

const EventScoreHistoryGetTypes = {
  Requesting: 'GET_EVENT_SCORE_HISTORY_REQUEST',
  RequestSuccess: 'GET_EVENT_SCORE_HISTORY_SUCCESS',
  RequestError: 'GET_EVENT_SCORE_HISTORY_ERROR',
};
function getEventScoreHistory(id, start, end) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_EVENT_SCORE_HISTORY',
    url: `${ApiTable.getEventScoreHistory.replace('{id}', id)}?start=${start}&end=${end}`,
    msg: {
      error: '结构物最新事件评分查询失败',
    },
    reducer: {
      name: 'eventScoreHistory',
    },
  });
}

const RainfallYearlyGetTypes = {
  Requesting: 'GET_RAINFALL_YEARLY_REQUEST',
  RequestSuccess: 'GET_RAINFALL_YEARLY_SUCCESS',
  RequestError: 'GET_RAINFALL_YEARLY_ERROR',
};
function getRainfallYearly(id) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_RAINFALL_YEARLY',
    url: ApiTable.getRainfallYearly.replace('{id}', id),
    msg: {
      error: '结构物年平均降雨量查询失败',
    },
    reducer: {
      name: 'rainfallYearly',
    },
  });
}

const RainfallYearlyAddTypes = {
  Requesting: 'ADD_RAINFALL_YEARLY_REQUEST',
  RequestSuccess: 'ADD_RAINFALL_YEARLY_SUCCESS',
  RequestError: 'ADD_RAINFALL_YEARLY_ERROR',
};
function addRainfallYearly(id, data) {
  return (dispatch) => basicAction({
    type: 'post',
    data,
    dispatch,
    actionType: 'ADD_RAINFALL_YEARLY',
    url: ApiTable.addRainfallYearly.replace('{id}', id),
    msg: {
      option: '结构物年平均降雨量新增',
    },
  });
}

export {
  getEventScoreLatest,
  getEventScoreHistory,
  getRainfallYearly,
  addRainfallYearly,
  EventScoreLatestGetTypes,
  EventScoreHistoryGetTypes,
  RainfallYearlyGetTypes,
  RainfallYearlyAddTypes,
};
