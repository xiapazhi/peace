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
      <SubMenu key="damCheck" icon={<ShopOutlined />} title="巡视检查">
        <Menu.Item key="damCheck/plan">
          <Link to="/damCheck/plan">巡检计划制定</Link>
        </Menu.Item>
        <Menu.Item key="damCheck/record">
          <Link to="/damCheck/record">巡检计划查看</Link>
        </Menu.Item>
        <Menu.Item key="damCheck/item">
          <Link to="/damCheck/item">检查项设置</Link>
        </Menu.Item>
      </SubMenu>
    )
  );
}

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Menu } from 'antd';
// import { ShopOutlined } from '@ant-design/icons';
// import { AuthorizationCode } from '$utils';
// import { Func } from '$utils';
// const {
//     DamCheck
// } = AuthorizationCode

// const SubMenu = Menu.SubMenu;

// export function getNavItem(user, dispatch) {
//     return (
//         Func.judgeRights(DamCheck) &&
//         <SubMenu key="damCheck" icon={<ShopOutlined />} title={'巡视检查'}>
//             {Func.judgeRights(DamCheckPlan) && <Menu.Item key="damCheck/plan">
//                 <Link to="/damCheck/plan">巡检计划制定</Link>
//             </Menu.Item>}
//             {Func.judgeRights(DamCheckRecord) && <Menu.Item key="damCheck/record">
//                 <Link to="/damCheck/record">巡检计划查看</Link>
//             </Menu.Item>}
//             {Func.judgeRights(DamCheckItem) && <Menu.Item key="damCheck/item">
//                 <Link to="/damCheck/item">检查项设置</Link>
//             </Menu.Item>}
//         </SubMenu>
//     );
// }
