import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Tabs, Row, Col, Button,
} from 'antd';
import { push } from 'react-router-redux';
import { LayoutContent } from '@peace/components';
import { Func } from '$utils';
import { getStructureByStructureId } from '../../projectOverview/actions/projectOverview';
import ProductIntroduction from '../components/detail-content';

const { TabPane } = Tabs;
const tabs = ['基础情况', '水位库容', '大坝信息', '溢洪道、渠底', '经济效益', '责任人信息', '应急预案'];
function Detail(props) {
  const { dispatch, structureInfo, match } = props;
  const [tab, setTab] = useState('1');
  const structId = match?.params?.id;

  useEffect(async () => {
    dispatch(getStructureByStructureId(structId));
  }, []);

  const onNavigateBack = () => {
    dispatch(push({ pathname: '/dam/info' }));
  };
  return (
    <LayoutContent>
      <div className="dam-detail">
        <Tabs
          onChange={(activeKey) => { setTab(activeKey); }}
          activeKey={tab}
          defaultActiveKey="1"
        >
          {tabs.map((s, index) => <TabPane tab={s} key={`${index + 1}`} />)}
        </Tabs>
        <Row className="goback">
          <Col span={22} />
          <Col span={2}><Button size="small" onClick={onNavigateBack}>返回</Button></Col>
        </Row>
        <Row>
          <Col span={8} className="overviewImg">
            <img src={Func.downloadFile(structureInfo?.portrait)} />
          </Col>
          <Col span={16}>
            <ProductIntroduction
              key={tab}
              {...props}
              tab={tab}
              tabs={tabs}
            />
          </Col>
        </Row>
      </div>
    </LayoutContent>
  );
}

function mapStateToProps(state) {
  const { auth, global, structure } = state;
  return {
    structureInfo: structure.data || {},
    user: auth.user,
    actions: global.actions,
  };
}

export default connect(mapStateToProps)(Detail);
