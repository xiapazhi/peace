import {
  DefaultStructure,
  sturctureSet,
  GlBimSetup,
  StationDeploy2D,
  ThreeDeploy,
  DtuState,
  Schedule,
  EventScore,
} from './containers';

export default [{
  type: 'inner',
  route: {
    breadcrumb: '项目管理',
    path: '/project-monitor',
    component: null,
    key: 'project-monitor',
    childRoutes: [{
      breadcrumb: '结构物配置',
      path: '/structure',
      component: sturctureSet,
      key: 'project-monitor-structure',
      childRoutes: [{
        breadcrumb: '监测对象',
        path: '/things/:id',
        key: 'project-monitor-things',
        exact: false,
        component: DefaultStructure,
      }],
    }, {
      breadcrumb: '通信状态',
      key: 'commuincation-state',
      path: '/commuincation-state',
      component: DtuState,
    }, {
      breadcrumb: '事件评分',
      path: '/event-score',
      key: 'event-score',
      component: null,
      childRoutes: [
        {
          breadcrumb: '评分配置',
          path: '/config',
          key: 'event-score-config',
          component: EventScore.EventScoreConfig,
        },
        {
          breadcrumb: '评分结果',
          path: '/result',
          key: 'event-score-result',
          component: EventScore.EventScoreResult,
        },
      ],
    }, {
      breadcrumb: '工程事件',
      path: '/schedule',
      key: 'project-monitor-schedule',
      component: Schedule,
    }],
  },
}, {
  type: 'inner',
  route: {
    breadcrumb: '结构物配置',
    path: '/project-monitor/things/struct/:id/configuration',
    key: 'project-monitor-things-configuration',
    exact: false,
    component: DefaultStructure,
  },
}, {
  type: 'outer',
  route: {
    path: '/project-monitor/things/struct/:id/configuration/2d/deploy/:heatmapId',
    key: 'heatmap-2d',
    component: StationDeploy2D.Deploy,
  },
}, {
  type: 'outer',
  route: {
    path: '/project-monitor/things/struct/:id/configuration/3d/deploy',
    key: 'heatmap-3d',
    component: ThreeDeploy,
  },
}, {
  type: 'outer',
  route: {
    path: '/project-monitor/things/struct/:id/configuration/bim/glbimedit',
    key: 'glbimedit',
    component: GlBimSetup,
  },
}];
