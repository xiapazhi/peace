import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { FlagOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils';

const { DamSuperScreen } = AuthorizationCode;

const { SubMenu } = Menu;

export function getNavItem(user, dispatch) {
  return (
    Func.judgeRightsContainsAdmin(DamSuperScreen) && (
      <Menu.Item key="superScreen" icon={<FlagOutlined />}>
        <Link to="/superScreen">数据大屏</Link>
      </Menu.Item>
    )
  );
}
