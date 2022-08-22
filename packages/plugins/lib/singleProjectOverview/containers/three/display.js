import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Spin, Card, Result, Row, Col,
} from 'antd';
import { clearData } from '@peace/utils';
import { Func } from '$utils';
// import { getHeatMap } from '../../actions/threeHeatMap';
// import { getstationsDeployed } from '../../actions/integrationInfo';
import ThreeRender from '../../components/three/render';

function ThreeDisplay({
  location, dispatch, stationsDeployed, isRequesting, heatMap, user, actions, threeStaionsList, clientHeight,

}) {
  const structId = location?.state?.structId;
  const initContext = () => {
    if (structId) {
      dispatch(actions.singleProjectOverview.getStructStationList(structId));
      dispatch(actions.singleProjectOverview.getHeatMap(structId, '3D'))
        .then((res) => {
          if (res.payload.data) {
            const heatmapId = res.payload.data.filter((s) => s.type.id === 3);
            if (heatmapId.length > 0) {
              dispatch(actions.singleProjectOverview.getstationsDeployed(heatmapId[0].id));
            }
          }
        });
    }
  };

  useEffect(() => {
    initContext();
    return () => {
      clearData(dispatch, { actionType: 'GET_THREE_STATIONS_DEPLOYED_STATE' });
    };
  }, []);

  if (isRequesting) {
    return (<Spin />);
  }
  return (
    <Card style={{ height: Func.getContentHeight(clientHeight) - 46 }}>
      {
        stationsDeployed?.portrait ? (
          <ThreeRender
            threeStaionsList={threeStaionsList}
            heatMap={{ ...stationsDeployed, model: heatMap.find((f) => f.id === stationsDeployed.heatmapId) }}
            user={user}
            sectionItems={heatMap.filter((s) => s.type.id === 4)}
            onReLoad={initContext}
          />
        ) : (
          <Row style={{ marginTop: '200px' }}>
            <Col span="8" />
            <Col span="8" style={{ textAlign: 'center' }}><h3>未配置三维热点图，不提供热点拓扑功能</h3></Col>
            <Col span="8" />
          </Row>
        )
      }
    </Card>
  );
}

function mapStateToProps(state) {
  const {
    global, threeHeatMap, threeStaionsDeployedList, auth, threeStaionsList,
  } = state;
  const isRequesting = threeStaionsList.isRequesting || threeHeatMap.isRequesting || threeStaionsDeployedList.isRequesting;
  return {
    user: auth.user,
    isRequesting,
    heatMap: threeHeatMap.data || [],
    stationsDeployed: threeStaionsDeployedList.data || null,
    threeStaionsList: threeStaionsList.data || [],
    clientHeight: global.clientHeight,
    clientWidth: global.clientWidth,
  };
}

export default connect(mapStateToProps)(ThreeDisplay);
