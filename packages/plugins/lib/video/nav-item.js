import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';

const SubMenu = Menu.SubMenu;

export function getNavItem(user, dispatch, localName) {
  return (
      <Menu.Item key="video" icon={<VideoCameraOutlined />}>
          <Link to="/video">{localName?.video?.menu?.videoMonitor || '视频监控'}</Link>
      </Menu.Item>
  );
}