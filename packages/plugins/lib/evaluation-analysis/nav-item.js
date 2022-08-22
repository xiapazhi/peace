import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { AuthorizationCode, LOCAL_NAME } from '$utils';
import { Func } from '@peace/utils';

const { Comparison, Association, EvaluationAnalysis } = AuthorizationCode;

const { SubMenu } = Menu;
export function getNavItem(user, dispatch) {
  return (
    Func.judgeRightsContainsAdmin(EvaluationAnalysis)
      ? (
        <SubMenu key="evaluationAnalysis" icon={<BarChartOutlined />} title={LOCAL_NAME?.evaluationAnalysis?.menu?.evaluationAnalysis || '评估分析'}>
          {
            Func.judgeRightsContainsAdmin(Comparison) && (
              <Menu.Item key="analysis-comparison">
                <Link to="/analysis/comparison">{LOCAL_NAME?.evaluationAnalysis?.menu?.analysisComparison || '数据对比'}</Link>
              </Menu.Item>
            )
          }
          {
            Func.judgeRightsContainsAdmin(Association) && (
              <Menu.Item key="analysis-association">
                <Link to="/analysis/association">{LOCAL_NAME?.evaluationAnalysis?.menu?.analysisAssociation || '数据关联'}</Link>
              </Menu.Item>
            )
          }
        </SubMenu>
      ) : null
  );
}
