import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { Func } from '@peace/utils';

const {
  systemLogSearch,
  MemberManagement,
  AddDepartment,
  ModifyDepartmentName,
  DeleteDepartment,
  AddMember,
  ModifyMember,
  DeleteMember,
  EnableMember,
  DisableMember,
  AddRole,
  ModifyRoleName,
  DeleteRole,
  EnterpriseManagement,

} = AuthorizationCode;

const { SubMenu } = Menu;

export function getNavItem(user, dispatch, localName) {
  return (
    Func.judgeRightsContainsAdmin(MemberManagement)
    && (
      <SubMenu key="system" icon={<SettingOutlined />} title={localName?.system?.menu?.system || '系统管理'}>
        {
          (Func.judgeRightsContainsAdmin(AddDepartment)
            || Func.judgeRightsContainsAdmin(ModifyDepartmentName)
            || Func.judgeRightsContainsAdmin(DeleteDepartment)) && (
            <Menu.Item key="system-organization">
              <Link to="/system/organization">{localName?.system?.menu?.systemOrganization || '组织管理'}</Link>
            </Menu.Item>
          )
        }
        {

          (Func.judgeRightsContainsAdmin(AddMember)
            || Func.judgeRightsContainsAdmin(ModifyMember)
            || Func.judgeRightsContainsAdmin(DeleteMember)
            || Func.judgeRightsContainsAdmin(EnableMember)
            || Func.judgeRightsContainsAdmin(DisableMember)) && (
            <Menu.Item key="system-members">
              <Link to="/system/members">{localName?.system?.menu?.systemMembers || '用户管理'}</Link>
            </Menu.Item>
          )
        }

        {
          (Func.judgeRightsContainsAdmin(AddRole)
            || Func.judgeRightsContainsAdmin(ModifyRoleName)
            || Func.judgeRightsContainsAdmin(DeleteRole)) && (
            <Menu.Item key="system-roles">
              <Link to="/system/roles">{localName?.system?.menu?.systemRoles || '角色管理'}</Link>
            </Menu.Item>
          )
        }

        {
          Func.judgeRightsContainsAdmin(systemLogSearch) && (
            <Menu.Item key="system-log">
              <Link to="/system/log">{localName?.system?.menu?.systemLog || '系统日志'}</Link>
            </Menu.Item>
          )
        }
        {
          Func.judgeRightsContainsAdmin(EnterpriseManagement) && (
            <Menu.Item key="system-company">
              <Link to="/system/company">{localName?.system?.menu?.company || '企业设置'}</Link>
            </Menu.Item>
          )
        }

      </SubMenu>
    )
  );
}
