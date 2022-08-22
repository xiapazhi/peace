import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  Spin, Card, Tabs, Button,
} from 'antd';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { ProductIntroduction } from '../components/index';
import ThreeDisplay from './three/display';

const { TabPane } = Tabs;

function SingleProjectOverview(props) {
  const { dispatch, actions, location } = props;
  const { structId } = location.state;

  const onNavigateBack = () => {
    dispatch(push({ pathname: '/projectOverview', state: { structId } }));
  };
  return (
    <div className="singleProjectOverViewHeaderBorderTop">
      <Tabs defaultActiveKey="productIntroduction" tabBarExtraContent={<Button size="small" onClick={onNavigateBack}>返回</Button>}>
        <TabPane tab="项目简介" key="productIntroduction">
          <ProductIntroduction {...props} />
        </TabPane>
        {/* <TabPane tab="VR" key="vr">
                    Content of Tab Pane 2
                </TabPane> */}
        <TabPane tab="三维展示" key="three">
          <ThreeDisplay {...props} />
        </TabPane>
        {/* <TabPane tab="BIM展示" key="bim">
                    Content of Tab Pane 4
                </TabPane> */}
      </Tabs>
    </div>
  );
}

function mapStateToProps(state) {
  const { auth, global } = state;
  return {
    user: auth.user,
    actions: global.actions,
  };
}

export default connect(mapStateToProps)(SingleProjectOverview);
