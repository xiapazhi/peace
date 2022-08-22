import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { AuthorizationCode } from '$utils';
import { SolutionOutlined } from '@ant-design/icons';
import { Func } from '@peace/utils';

const {
  EventScoreManagement, CommunicationState, ScheduleManagement,
} = AuthorizationCode;

export function getNavItem(user, dispatch, localName) {
  return (
    <Menu.SubMenu key="project-monitor" title={localName?.projectMonitor?.menu?.projectMonitor || '项目管理'} icon={<SolutionOutlined />}>
      <Menu.Item key="structure">
        <Link to="/project-monitor/structure">{localName?.projectMonitor?.menu?.structure || '结构物配置'}</Link>
      </Menu.Item>
      {
        Func.judgeRightsContainsAdmin(CommunicationState)
        && (
          <Menu.Item key="commuincation-state">
            <Link to="/project-monitor/commuincation-state">{localName?.projectMonitor?.menu?.commuincationState || '通信状态'}</Link>
          </Menu.Item>
        )
      }
      {
        Func.judgeRightsContainsAdmin(EventScoreManagement)
        && (
          <Menu.SubMenu key="event-score" title="事件评分">
            <Menu.Item key="event-score-config"><Link to="/project-monitor/event-score/config">{localName?.projectMonitor?.menu?.eventScoreConfig || '评分配置'}</Link></Menu.Item>
            <Menu.Item key="event-score-result"><Link to="/project-monitor/event-score/result">{localName?.projectMonitor?.menu?.eventScoreResult || '评分结果'}</Link></Menu.Item>
          </Menu.SubMenu>
        )
      }
      {
        Func.judgeRightsContainsAdmin(ScheduleManagement)
        && (
          <Menu.Item key="project-monitor-schedule">
            <Link to="/project-monitor/schedule">{localName?.projectMonitor?.menu?.schedule || '工程事记'}</Link>
          </Menu.Item>
        )
      }
    </Menu.SubMenu>
  );
}

export default getNavItem;
