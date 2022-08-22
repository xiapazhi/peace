import {
  DataCheck, DataReport, DataDownload, ReportConfig, AbnPushCfg, DataCalc,
} from './containers';

export default [{
  type: 'inner',
  route: {
    path: '/dataService',
    key: 'dataService',
    breadcrumb: '数据服务',
    childRoutes: [{
      path: '/check',
      key: 'dataService-check',
      component: DataCheck,
      breadcrumb: '数据查询',
    },
    {
      key: 'dataService-report-config',
      breadcrumb: '报表生成',
      path: '/reportConfig',
      component: ReportConfig,
    }, {
      path: '/report',
      key: 'dataService-report',
      component: DataReport,
      breadcrumb: '报表',
    }, {
      path: '/download',
      key: 'dataService-download',
      component: DataDownload,
      breadcrumb: '数据下载',
    }, {
      breadcrumb: '异常推送配置',
      key: 'dataService-abnPushCfg',
      path: '/abnPushCfg',
      component: AbnPushCfg,
    }, {
      breadcrumb: '数据计算',
      path: '/calc',
      key: 'dataService-calc',
      component: DataCalc,
    }],
  },
}];
