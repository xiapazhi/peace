'use strict';
import { CheckItem, CheckPlan, CheckRecord, RecordDetail } from './containers';

export default [{
    type: 'inner',
    route: {
        path: '/damCheck',
        key: 'damCheck',
        breadcrumb: '巡视检查',
        childRoutes: [{
            path: '/plan',
            key: 'plan',
            component: CheckPlan,
            breadcrumb: '巡检计划制定',
        },
        {
            path: '/record',
            key: 'record',
            component: CheckRecord,
            breadcrumb: '巡检计划查看',
            childRoutes: [
                {
                    path: '/:id',
                    key: 'detail',
                    component: RecordDetail,
                    breadcrumb: '记录详情',
                }
            ]
        }, {
            path: '/item',
            key: 'item',
            component: CheckItem,
            breadcrumb: '检查项设置',

        }
        ]
    }
}];