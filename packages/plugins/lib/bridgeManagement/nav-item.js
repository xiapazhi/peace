import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils';

const {
  BridgeManage,
} = AuthorizationCode;

const { SubMenu } = Menu;

export function getNavItem(user, dispatch, localName) {
  return (
    Func.judgeRightsContainsAdmin(BridgeManage)
    && (
      <SubMenu key="bridge" icon={<ShopOutlined />} title={localName?.bridgeManagement?.menu?.bridge || '桥梁管理'}>
        <Menu.Item key="bridge-info">
          <Link to="/bridge/info">{localName?.bridgeManagement?.menu?.info || '桥梁信息管理'}</Link>
        </Menu.Item>
      </SubMenu>
    )
  );
}
