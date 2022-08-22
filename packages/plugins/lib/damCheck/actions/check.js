import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

export function getCheckItems() {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    query: {},
    actionType: 'GET_CHECKITEMS',
    url: ApiTable.getCheckItems,
    msg: {
      error: '获取检查项列表信息失败',
    },
    reducer: {
      name: 'checkitems',
    },
  });
}

export function addCheckItem(params) {
  return (dispatch) => basicAction({
    type: 'post',
    data: params,
    dispatch,
    actionType: 'ADD_CHECKITEM',
    url: ApiTable.createCheckItem,
    msg: {
      option: '新增检查项',
    },
  });
}

export function deleteCheckItem(id) {
  return (dispatch) => basicAction({
    type: 'del',
    dispatch,
    actionType: 'DELETE_CHECKITEM',
    url: ApiTable.modifyCheckItem.replace('{id}', id),
    msg: {
      option: '删除检查项',
    },
  });
}

export function modifyCheckItem(id, params) {
  return (dispatch) => basicAction({
    type: 'put',
    data: params,
    dispatch,
    actionType: 'MODIFY_CHECKITEM',
    url: ApiTable.modifyCheckItem.replace('{id}', id),
    msg: {
      option: '编辑检查项',
    },
  });
}

export function getAuthorList(orgId, user) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_DAM_AUTHOR_LIST',
    url: ApiTable.getEnterprisesMembers.replace('{enterpriseId}', orgId),
    msg: {
      error: '获取部门用户信息失败',
    },
    reducer: {
      name: 'damAuthorData',
      params: {
        noClear: true,
      },
    },
    callback: ((res) => {
      if (user && user.departmentName && user.departmentName != '默认') {
        return res.filter((m) => m.departmentName == user.departmentName);
      }
      if (res.length && res[0].departmentName != '默认') {
        const defaultIndex = res.findIndex((r) => r.departmentName == '默认');
        if (defaultIndex > 0) {
          const defaultDep = res[defaultIndex];
          res.splice(defaultIndex, 1);
          res.unshift(defaultDep);
        }
      }
      return res;
    }),
  });
}

export function getMyStructList(orgId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: 'GET_DAM_MY_STRUCT_LIST',
    url: `${ApiTable.getStructsList.replace('{organizationId}', orgId)}`,
    msg: { error: '获取结构物列表失败' },
    reducer: { name: 'myDamStructList' },
  });
}

export default {
  getCheckItems,
  addCheckItem,
  deleteCheckItem,
  modifyCheckItem,
  getAuthorList,
  getMyStructList,
};
