import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';

const { SubMenu } = Menu;

export function getNavItem(user, dispatch, localName) {
  return (
    <Menu.Item key="projectOverview" icon={<ReadOutlined />}>
      <Link to="/projectOverview">{localName?.projectOverview?.menu?.projectOverview || '项目总览'}</Link>
    </Menu.Item>
  );
}
