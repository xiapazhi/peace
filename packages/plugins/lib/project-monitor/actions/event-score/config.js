import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

const EventScoreWeightGetTypes = {
  Requesting: 'GET_EVENT_SCORE_WEIGHT_REQUEST',
  RequestSuccess: 'GET_EVENT_SCORE_WEIGHT_SUCCESS',
  RequestError: 'GET_EVENT_SCORE_WEIGHT_ERROR',
};

function getEventScoreWeight(id) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_EVENT_SCORE_WEIGHT',
    url: ApiTable.getEventScoreWeight.replace('{id}', id),
    msg: {
      error: '结构物事件指标权重查询失败',
    },
    reducer: {
      name: 'eventScoreWeight',
    },
  });
}

const EventScoreWeightSetTypes = {
  Requesting: 'SET_EVENT_SCORE_WEIGHT_REQUEST',
  RequestSuccess: 'SET_EVENT_SCORE_WEIGHT_SUCCESS',
  RequestError: 'SET_EVENT_SCORE_WEIGHT_ERROR',
};
function setEventScoreWeight(id, data) {
  return (dispatch) => basicAction({
    type: 'post',
    data,
    dispatch,
    actionType: 'SET_EVENT_SCORE_WEIGHT',
    url: ApiTable.setEventScoreWeight.replace('{id}', id),
    msg: {
      option: '事件指标权重设置',
    },
  });
}

const EventScoreWeightDelTypes = {
  Requesting: 'DEL_EVENT_SCORE_WEIGHT_REQUEST',
  RequestSuccess: 'DEL_EVENT_SCORE_WEIGHT_SUCCESS',
  RequestError: 'DEL_EVENT_SCORE_WEIGHT_ERROR',
};

function delEventScoreWeight(id) {
  return (dispatch) => basicAction({
    type: 'del',
    dispatch,
    actionType: 'DEL_EVENT_SCORE_WEIGHT',
    url: ApiTable.delEventScoreWeight.replace('{id}', id),
    msg: {
      option: '事件指标权重删除',
    },
  });
}

export {
  getEventScoreWeight,
  setEventScoreWeight,
  delEventScoreWeight,
  EventScoreWeightGetTypes,
  EventScoreWeightSetTypes,
  EventScoreWeightDelTypes,
};
