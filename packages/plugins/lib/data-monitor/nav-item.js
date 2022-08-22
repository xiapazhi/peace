import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { FundViewOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils';

const { DataMonitor, FactorMonitor, DeviceMonitor } = AuthorizationCode;

const { SubMenu } = Menu;
export function getNavItem(user, dispatch, localName) {
  return (
    Func.judgeRightsContainsAdmin(DataMonitor)
      ? (
        <SubMenu key="dataMonitor" icon={<FundViewOutlined />} title={localName?.dataMonitor?.menu?.dataMonitor || '实时监控'}>
          {
            Func.judgeRightsContainsAdmin(FactorMonitor) && (
              <Menu.Item key="dataMonitor-factor">
                <Link to="/dataMonitor/factor">{localName?.dataMonitor?.menu?.factor || '数据监控'}</Link>
              </Menu.Item>
            )
          }
          {
            Func.judgeRightsContainsAdmin(DeviceMonitor) && (
              <Menu.Item key="dataMonitor-device">
                <Link to="/dataMonitor/device">{localName?.dataMonitor?.menu?.device || '设备监控'}</Link>
              </Menu.Item>
            )
          }

        </SubMenu>
      ) : null
  );
}
