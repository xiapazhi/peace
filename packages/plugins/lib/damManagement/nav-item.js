import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils';

const {
  DamManagement,
} = AuthorizationCode;

const { SubMenu } = Menu;

export function getNavItem(user, dispatch) {
  return (
    Func.judgeRightsContainsAdmin(DamManagement)
    && (
      <SubMenu key="dam" icon={<ShopOutlined />} title="大坝管理">
        <Menu.Item key="dam-info">
          <Link to="/dam/info">大坝信息管理</Link>
        </Menu.Item>
      </SubMenu>
    )
  );
}
