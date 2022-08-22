import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

export function getCheckRecords() {
    return (dispatch) => basicAction({
        type: 'get',
        dispatch,
        query: {},
        actionType: 'GET_CHECKRECORDS',
        url: ApiTable.getCheckRecords,
        msg: {
            error: '获取计划列表信息失败',
        },
        reducer: {
            name: 'checkrecords',
        },
    });
}

export default {
    getCheckRecords,
};
