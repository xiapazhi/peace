'use strict';
import { ProjectOverview, } from './containers';

export default [{
    type: 'home',
    route: {
        path: '/video',
        key: 'video',
        breadcrumb: '视频监控',
        component: ProjectOverview,
        // 不设置 component 则面包屑禁止跳转
    }
}];