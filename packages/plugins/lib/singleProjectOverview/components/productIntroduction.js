import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Spin, Card, Row, Col, Text, Button,
} from 'antd';
import { Func } from '$utils';

function ProductIntroduction(props) {
  const {
    dispatch, actions, user, loading, clientWidth, structureInfo, location,
  } = props;

  const { structId } = location.state;
  useEffect(async () => {
    dispatch(actions.projectOverview.getStructureByStructureId(structId));
  }, []);

  const basicInfoList = [
    {
      key: 1,
      name: '项目名称',
      value: structureInfo.name,
    },
    {
      key: 2,
      name: '项目地点',
      value: structureInfo.address,
    },
    {
      key: 3,
      name: '项目状态',
      value: '', // 字段未确定
    },
    {
      key: 4,
      name: '建设单位',
      value: structureInfo.extraInfo ? structureInfo.extraInfo.DevelopmentOrganization : '',
    },
    {
      key: 5,
      name: '设计单位',
      value: structureInfo.extraInfo ? structureInfo.extraInfo.DesignOrganization : '',
    },
    {
      key: 6,
      name: '施工单位',
      value: structureInfo.extraInfo ? structureInfo.extraInfo.ManagementOrganization : '',
    },
  ];

  return (
    <div className="content">
      <Spin spinning={loading}>
        <div className="contentBody">
          <Row className="structName">
            <Col span={22}>{structureInfo.name}</Col>

          </Row>
          <Row className="structImg">
            <Col span={8}>
              <img src={structureInfo && Func.downloadFile(structureInfo?.portrait) || ''} />
            </Col>
            <Col span={16}>
              <div className="structIntruduction">{structureInfo.desc}</div>
            </Col>
          </Row>
          <Row className="basicInfo">
            <Col span={2} style={{ marginLeft: 20 }}>
              基本信息
            </Col>
          </Row>
          <Row className="infoDesc">
            {basicInfoList.map((v) => (
              <Col className="cell" key={v.key} span={8}>
                <Row>
                  <Col className="cellName" span={8}>
                    <div>
                      {v.name}
                      ：
                    </div>
                  </Col>
                  <Col className="cellValue" span={16}><div className="text---">{v.value}</div></Col>
                </Row>
              </Col>
            ))}

          </Row>
        </div>
      </Spin>

    </div>
  );
}

function mapStateToProps(state) {
  const {
    global, auth, structure, structuresList,
  } = state;

  return {
    loading: structure.isRequesting || structuresList.isRequesting,
    user: auth.user,
    actions: global.actions,
    structureInfo: structure.data || {},
    clientWidth: global.clientWidth,
  };
}

export default connect(mapStateToProps)(ProductIntroduction);
