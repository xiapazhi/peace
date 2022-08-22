import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

export const StructuresGetTypes = 'GET_THESHOLD_STRUCTURE';
export const ReportFactorsGetTypes = 'GET_REPORT_FACTORS';
// 查询报表配置
export const ReportConfigGetTypes = 'GET_REPORT_CONFIG';
// 获取报表监测因素模板配置
export const ReportTemplateGetType = 'GET_REPORT_TEMPLATE';
// 报表立即生成
export const ReportGenerateTypes = 'REPORT_GENERATE';
// 新增报表配置
export const ReportConfigPostTypes = 'POST_REPORT_CONFIG';
// 修改报表配置
export const ReportConfigPutTypes = 'PUT_REPORT_CONFIG';
// 删除报表配置
export const ReportConfigDelTypes = 'DEL_REPORT_CONFIG';

export function getReportFactors(structId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: ReportFactorsGetTypes,
    url: ApiTable.getStructFactorList.replace('{structureId}', structId),
    msg: {
      error: '查询结构物监测因素失败',
    },
    reducer: {
      name: 'reportFactors',
    },
  });
}
export function getReportConfig(structId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: ReportConfigGetTypes,
    url: ApiTable.getReportStrategy.replace('{structureId}', structId),
    msg: {
      error: '查询报表配置失败',
    },
    reducer: {
      name: 'reportConfig',
    },
  });
}

export function getReportTemplate(type) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: ReportTemplateGetType,
    url: ApiTable.getReportTemplate.replace('{typeId}', type && type.id),
    msg: {
      error: '查询报表监测因素模板配置失败',
    },
    reducer: {
      name: 'reportTemplate',
    },
  });
}
export function reportGenerate(data) {
  return (dispatch) => basicAction({
    type: 'put',
    dispatch,
    actionType: ReportGenerateTypes,
    url: ApiTable.reportGenerate,
    data,
    msg: {
      success: '立即生成成功',
      error: '立即生成失败',
    },
  });
}
export function postReportConfig(structId, config) {
  return (dispatch) => basicAction({
    type: 'post',
    dispatch,
    actionType: ReportConfigPostTypes,
    url: ApiTable.addReportStrategy.replace('{structureId}', structId),
    data: config,
    msg: {
      success: '新增配置成功',
      error: '新增配置失败',
    },
  });
}
export function putReportConfig(id, config, structId) {
  return (dispatch) => basicAction({
    type: 'put',
    dispatch,
    actionType: ReportConfigPutTypes,
    url: ApiTable.modifyReportStrategy.replace('{strategyId}', id).replace('{structId}', structId),
    data: config,
    msg: {
      option: '编辑配置',
    },
  });
}
export function delReportConfig(id) {
  return (dispatch) => basicAction({
    type: 'del',
    dispatch,
    actionType: ReportConfigDelTypes,
    url: ApiTable.deleteReportStrategy.replace('{strategyId}', id),
    msg: {
      option: '删除配置',
    },
  });
}

export default {
  getReportFactors,
  getReportConfig,
  getReportTemplate,
};
