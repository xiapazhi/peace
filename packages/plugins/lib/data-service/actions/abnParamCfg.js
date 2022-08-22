import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

function getAbnMethods() {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_ABN_METHODS',
    url: ApiTable.getAbnMethods,
    msg: {
      option: '查询异常识别算法',
    },
    reducer: {
      name: 'abnMethods',
    },
  });
}
function getAbnParamList(id) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_ABN_PARAMS',
    url: ApiTable.getAbnParamList.replace('{id}', id),
    msg: {
      option: '查询异常参数配置',
    },
    reducer: {
      name: 'abnParamList',
    },
  });
}
function addAbnParams(id, data) {
  return (dispatch) => basicAction({
    type: 'post',
    dispatch,
    actionType: 'ADD_ABN_PARAMS',
    url: ApiTable.getAbnParamList.replace('{id}', id),
    data,
    msg: {
      option: '新增异常参数配置',
    },
  });
}
function editAbnParams(id, pushData) {
  return (dispatch) => basicAction({
    type: 'put',
    dispatch,
    actionType: 'EDIT_ABN_PARAMS',
    url: ApiTable.editAbnParams.replace('{id}', id),
    data: pushData,
    msg: {
      option: '修改聚集配置',
    },
  });
}
function deleteAbnParams(id) {
  return (dispatch) => basicAction({
    type: 'del',
    dispatch,
    actionType: 'DELETE_ABN_PARAMS',
    url: ApiTable.deleteAbnParams.replace('{id}', id),
    msg: {
      option: '删除异常参数配置',
    },
  });
}
function getAbnTaskResult(structId, start, end, pushData) {
  return (dispatch) => basicAction({
    type: 'post',
    dispatch,
    actionType: 'GET_ABNORMAL_TASK_RESULT',
    url: ApiTable.getAbnTaskResult.replace('{structId}', structId).replace('{start}', start).replace('{end}', end),
    data: pushData,
    msg: {
      option: '异常数据对比',
    },
    msgSuccessShow: false,
    reducer: {
      name: 'abnCalcState',
    },
  });
}
function getItemAbnResultInt(structId, start, end, pushData) {
  return (dispatch) => basicAction({
    type: 'post',
    dispatch,
    actionType: 'GET_ITEM_ABN_TASK_RESULT_INT',
    url: ApiTable.getAbnTaskResult.replace('{structId}', structId).replace('{start}', start).replace('{end}', end),
    data: pushData,
    msg: {
      option: '中断数据对比',
    },
    msgSuccessShow: false,
    reducer: {
      name: 'abnItemStateInt',
    },
  });
}
function getItemAbnResultBurr(structId, start, end, pushData) {
  return (dispatch) => basicAction({
    type: 'post',
    dispatch,
    actionType: 'GET_ITEM_ABN_TASK_RESULT_BURR',
    url: ApiTable.getAbnTaskResult.replace('{structId}', structId).replace('{start}', start).replace('{end}', end),
    data: pushData,
    msg: {
      option: '毛刺数据对比',
    },
    msgSuccessShow: false,
    reducer: {
      name: 'abnItemStateBurr',
    },
  });
}
function getItemAbnResultTr(structId, start, end, pushData) {
  return (dispatch) => basicAction({
    type: 'post',
    dispatch,
    actionType: 'GET_ITEM_ABN_TASK_RESULT_TR',
    url: ApiTable.getAbnTaskResult.replace('{structId}', structId).replace('{start}', start).replace('{end}', end),
    data: pushData,
    msg: {
      option: '异常趋势数据对比',
    },
    msgSuccessShow: false,
    reducer: {
      name: 'abnItemStateTr',
    },
  });
}
function batchCfgAbnParams(ids, enable) {
  return (dispatch) => basicAction({
    type: 'put',
    dispatch,
    actionType: 'PUT_BATCH_SWITCH',
    url: ApiTable.batchSwitch.replace('{ids}', ids),
    data: enable,
    msg: {
      option: enable.enabled ? '批量启用异常参数配置' : '批量禁用异常参数配置',
    },
  });
}
export {
  getAbnMethods,
  getAbnParamList,
  addAbnParams, editAbnParams, deleteAbnParams,
  getAbnTaskResult, getItemAbnResultInt, getItemAbnResultBurr, getItemAbnResultTr,
  batchCfgAbnParams,
};
