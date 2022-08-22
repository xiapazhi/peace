import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

export function getHeatMap(structureId, modelType) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_HEATMAP_LIST',
    url: ApiTable.getHeatmaps.replace('{structureId}', structureId).replace('{modelType}', modelType),
    msg: {
      error: '获取三维热点图失败',
    },
    reducer: {
      name: 'threeHeatMap',
    },
  });
}

export function getstationsDeployed(heatmapId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_THREE_STATIONS_DEPLOYED_STATE',
    url: ApiTable.getstationsDeployed.replace('{heatmapId}', heatmapId),
    msg: {
      error: '获取三维布点失败',
    },
    reducer: {
      name: 'threeStaionsDeployedList',
    },
  });
}

export function getStructStationList(structureId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_THREE_STRUCT_STATIONS_LIST',
    url: ApiTable.getStations.replace('{structureId}', structureId),
    msg: {
      error: '获取结构物测点失败',
    },
    reducer: {
      name: 'threeStaionsList',
    },
  });
}

export function getLastStationData(ids) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_THREE_STRUCT_STATIONS_DATA',
    url: ApiTable.getStationThemesData,
    query: {
      stations: ids,
      limit: 1,
    },
    msg: {
      error: '获取测点最新数据失败',
    },
    reducer: {
      name: 'threeStaionsData',
    },
  });
}
