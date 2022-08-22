import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

export function getCheckPlans() {
    return (dispatch) => basicAction({
        type: 'get',
        dispatch,
        query: {},
        actionType: 'GET_CHECKPLANS',
        url: ApiTable.getCheckPlans,
        msg: {
            error: '获取计划列表信息失败',
        },
        reducer: {
            name: 'checkplans',
        },
    });
}

export function addCheckPlan(params) {
    return (dispatch) => basicAction({
        type: 'post',
        data: params,
        dispatch,
        actionType: 'ADD_CHECKPLAN',
        url: ApiTable.createCheckPlan,
        msg: {
            option: '新增计划',
        },
    });
}

export function deleteCheckPlan(id) {
    return (dispatch) => basicAction({
        type: 'del',
        dispatch,
        actionType: 'DELETE_CHECKPLAN',
        url: ApiTable.modifyCheckPlan.replace('{id}', id),
        msg: {
            option: '删除计划',
        },
    });
}

export function modifyCheckPlan(id, params) {
    return (dispatch) => basicAction({
        type: 'put',
        data: params,
        dispatch,
        actionType: 'MODIFY_CHECKPLAN',
        url: ApiTable.modifyCheckPlan.replace('{id}', id),
        msg: {
            option: '编辑计划',
        },
    });
}

export function getStructUsers(id) {
    return (dispatch) => basicAction({
        type: 'get',
        dispatch,
        query: {},
        actionType: 'GET_STRUCTURE_USER',
        url: ApiTable.getStructUsers.replace('{id}', id),
        msg: {
            error: '获取计划列表信息失败',
        },
        reducer: {
            name: 'structUsers',
        },
    });
}


export default {
    getCheckPlans,
    addCheckPlan,
    deleteCheckPlan,
    modifyCheckPlan,
    getStructUsers
};
