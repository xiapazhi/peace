import { BridgeInfo, Detail } from './containers';

export default [{
  type: 'inner',
  route: {
    path: '/dam',
    key: 'dam',
    breadcrumb: '大坝管理',
    childRoutes: [{
      path: '/info',
      key: 'dam-info',
      component: BridgeInfo,
      breadcrumb: '大坝信息管理',
      childRoutes: [{
        path: '/:id',
        key: 'dam-info-config',
        component: Detail,
        breadcrumb: '大坝详情',
      }],
    }],
  },
}];
