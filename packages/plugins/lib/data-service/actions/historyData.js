import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

export function getHistoryData(stations, begin, end, aggtype) {
  const url = ApiTable.getStationData;
  const query = {
    stations,
    begin,
    end,
    orderDirection: 'DESC',
  };
  if (aggtype) query.aggtype = aggtype;
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    query,
    actionType: 'STATION_HISTTORY_DATA',
    url,
    msg: {
      error: '获取实时数据失败',
    },
    reducer: {
      name: 'historyData',
    },
  });
}

export function getWindRoseData(stationId, startTime, endTime) {
  const url = ApiTable.getWindRose.replace('{stationId}', stationId);
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    query: {
      startTime, endTime,
    },
    actionType: 'WIND_ROSE_DATA',
    url,
    msg: {
      error: '获取实时数据失败',
    },
    reducer: {
      name: 'windroseData',
    },
  });
}

export const REQUEST_VIBERATION_RAWS_DATA = 'REQUEST_VIBERATION_RAWS_DATA';
export const GET_VIBERATION_RAWS_DATA_SUCCESS = 'GET_VIBERATION_RAWS_DATA_SUCCESS';
export const GET_VIBERATION_RAWS_DATA_ERROR = 'GET_VIBERATION_RAWS_DATA_ERROR';
export const CLEAR_BLASTVIB_RAWS_DATA = 'CLEAR_BLASTVIB_RAWS_DATA';
export function getVibrationRawsData(data, factorProto) {
  return (dispatch) => basicAction({
    type: 'post',
    data: {
      collectTimesWithStationId: data,
      factorProto,
    },
    dispatch,
    actionType: 'GET_VIBERATION_RAWS_DATA',
    url: ApiTable.getVibrationRawsData,
    msg: {
      error: '获取振动时域数据失败',
    },
    reducer: {
      name: 'vibrationRawsData',
    },
  });
}

export const REQUEST_VIBERATION_FFTS_DATA = 'REQUEST_VIBERATION_FFTS_DATA';
export const GET_VIBERATION_FFTS_DATA_SUCCESS = 'GET_VIBERATION_FFTS_DATA_SUCCESS';
export const GET_VIBERATION_FFTS_DATA_ERROR = 'GET_VIBERATION_FFTS_DATA_ERROR';
export const CLEAR_BLASTVIB_FFTS_DATA = 'CLEAR_BLASTVIB_FFTS_DATA';
export function getVibrationFftsData(data, factorProto) {
  return (dispatch) => basicAction({
    type: 'post',
    data: {
      collectTimesWithStationId: data,
      factorProto,
    },
    dispatch,
    actionType: 'GET_VIBERATION_FFTS_DATA',
    url: ApiTable.getVibrationFftsData,
    msg: {
      error: '获取振动频谱数据失败',
    },
    reducer: {
      name: 'vibrationFftsData',
    },
  });
}

export default {
  getHistoryData, getWindRoseData, getVibrationRawsData, getVibrationFftsData,
};
