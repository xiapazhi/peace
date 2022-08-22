import dataFiles from './dataFiles';
import panFiles from './panFiles';
import historyData from './historyData';
import reportConfig from './reportConfig';
import { getPushList } from './abnPushCfg';
import commonActions from './common';
import { getProjectList as getDataDownloadProjectList, getReceiverList, getStructsList } from './alarm-strategy-modal';
import {
  getAbnMethods,
  getAbnParamList,
  getAbnTaskResult,
  getItemAbnResultInt, getItemAbnResultBurr, getItemAbnResultTr,
} from './abnParamCfg';
import { getAbnFilterMethods, getAbnFilterCfgs, getAbnFilterTaskResult } from './abnFilterCfg';
import { getRecalList, issueRecalcRequest, getIssueRecalcResult } from './recal';

export default {
  ...dataFiles,
  ...panFiles,
  ...historyData,
  ...reportConfig,
  ...commonActions,
  getPushList,
  getDataDownloadProjectList,
  getReceiverList,
  getStructsList,
  getAbnMethods,
  getAbnParamList,
  getAbnTaskResult,
  getItemAbnResultInt,
  getItemAbnResultBurr,
  getItemAbnResultTr,
  getAbnFilterMethods,
  getAbnFilterCfgs,
  getAbnFilterTaskResult,
  getRecalList,
  issueRecalcRequest,
  getIssueRecalcResult,
};
