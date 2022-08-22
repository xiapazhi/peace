import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils';

const {
  ReportManagement, PanManagement, AbnormalPush, DataMath,
} = AuthorizationCode;
const { SubMenu } = Menu;
export function getNavItem(user, dispatch, localName) {
  return (

    <SubMenu key="dataService" icon={<BarChartOutlined />} title={localName?.dataService?.menu?.dataService || '数据服务'}>
      <Menu.Item key="dataService-check">
        <Link to="/dataService/check">{localName?.dataService?.menu?.check || '数据查询'}</Link>
      </Menu.Item>
      {
        Func.judgeRightsContainsAdmin(ReportManagement) && (
          <Menu.Item key="dataService-report-config">
            <Link to="/dataService/reportConfig">{localName?.dataService?.menu?.reportConfig || '报表生成'}</Link>
          </Menu.Item>
        )
      }
      {/* {
        Func.judgeRightsContainsAdmin(PanManagement) && (
          <Menu.Item key="dataService-report">
            <Link to="/dataService/report">{localName?.dataService?.menu?.report || '报表'}</Link>
          </Menu.Item>
        )
      } */}
      {
        Func.judgeRightsContainsAdmin(PanManagement) && (
          <Menu.Item key="dataService-download">
            <Link to="/dataService/download">{localName?.dataService?.menu?.download || '数据下载'}</Link>
          </Menu.Item>
        )
      }
      {

        Func.judgeRightsContainsAdmin(AbnormalPush)
          ? (
            <Menu.Item key="dataService-abnPushCfg">
              <Link to="/dataService/abnPushCfg">{localName?.dataService?.menu?.abnPushCfg || '异常推送配置'}</Link>
            </Menu.Item>
          )
          : ''
      }
      {
        Func.judgeRightsContainsAdmin(DataMath)
          ? (
            <Menu.Item key="dataService-calc">
              <Link to="/dataService/calc">{localName?.dataService?.menu?.calc || '数据计算'}</Link>
            </Menu.Item>
          )
          : ''
      }
    </SubMenu>
  );
}

export default {
  getNavItem,
};
