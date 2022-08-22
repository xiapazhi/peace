import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils';

const { AlarmManagement, AlarmStrategyManagement } = AuthorizationCode;
const { SubMenu } = Menu;

export function getNavItem(user, dispatch, localName) {
  return (
    Func.judgeRightsContainsAdmin(AlarmManagement) || Func.judgeRightsContainsAdmin(AlarmStrategyManagement)
      ? (
        <SubMenu key="alarm" icon={<AlertOutlined />} title={localName?.alarm?.menu?.alarm || '告警管理'}>
          {
            Func.judgeRightsContainsAdmin(AlarmManagement) && (
              <Menu.Item key="alarm-list">
                <Link to="/alarm/list">{localName?.alarm?.menu?.list || '告警管理'}</Link>
              </Menu.Item>
            )
          }
          {
            Func.judgeRightsContainsAdmin(AlarmStrategyManagement) && (
              <Menu.Item key="alarm-strategy">
                <Link to="/alarm/strategy">{localName?.alarm?.menu?.strategy || '告警策略配置'}</Link>
              </Menu.Item>
            )
          }

        </SubMenu>
      ) : null
  );
}
