import React, { useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { useFsRequest, useMockRequest, ApiTable } from '$utils';
import RightTop from '../components/shuiku/right-top';
import RightMiddle from '../components/shuiku/right-middle';
import RightBottom from '../components/shuiku/right-bottom';
import LeftTop from '../components/shuiku/left-top';
import LeftMiddle from '../components/shuiku/left-middle';
import LeftBottom from '../components/shuiku/left-bottom';
import Gis from '../components/shuiku/gis';

function ShuikuContainer({ user, dispatch, actions }) {
  // 获取结构物列表

  const { data: structs = [], loading } = useFsRequest({ url: ApiTable.getStructuresByOrganizations.replace('{id}', user?.orgId) });

  const {
    data: userAlarmsInfo = {
      data: [],
    },
  } = useFsRequest({
    url: ApiTable.getAlarms.replace('{userId}', user?.id),
    method: 'post',
    query: {
      limit: 999,
      offset: 0,
    },
    body: {
      status: 'new', // {string, optional} 告警状态，{"new":新告警, "history":历史告警}
      levels: [1, 2, 3, 4], // {array[int], optional} 告警等级数组
      types: [1],
    },
    // pollingInterval: 10000,
  });
  return (
    <div className="main-container">
      <div style={{ width: '100%', height: '100%', background: 'grey' }}>
        <Gis
          loading={loading}
          gisStructures={structs}
          userAlarmsInfo={userAlarmsInfo}
        />
      </div>
      <div className="left-container">
        <LeftTop structs={structs} />
        <LeftMiddle structs={structs} />
        <LeftBottom structs={structs} user={user} />
      </div>
      <div className="right-container">
        <RightTop structs={structs} dispatch={dispatch} actions={actions} />
        <RightMiddle structs={structs} user={user} />
        <RightBottom structs={structs} dispatch={dispatch} />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { auth, global } = state;

  return {
    user: auth.user,
    error: auth.error,
    sections: global.sections,
    resourceRoot: global.apiRoot,
    actions: global.actions,
  };
}

export default connect(mapStateToProps)(ShuikuContainer);
