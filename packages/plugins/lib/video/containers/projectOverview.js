import React, { useState, useEffect } from 'react';
import '../style.less';
import { LayoutContent } from '@peace/components';
import { Spin, Select, Tree } from 'antd';
import { connect } from 'react-redux';
import Video from './video';

function ProjectOverview(props) {
  const {
    dispatch, actions, user, loading, myStructList, clientHeight, myStationList,
  } = props;
  const [selectStructure, setSelectStructure] = useState(null);

  useEffect(() => {
    dispatch(actions?.dataMonitor?.getMyStructList(user?.orgId));
  }, []);

  const sturctureChange = (value) => {
    setSelectStructure(value);
  };

  useEffect(() => {
    if (myStructList?.length > 0) {
      setSelectStructure(myStructList[0]?.id);
    }
  }, [myStructList]);

  return (
    <LayoutContent hasTabs perfectScroll={false}>
      <div style={{ padding: 20 }}>
        <Select
          allowClear={false}
          placeholder="选择结构物"
          style={{ width: 220, marginBottom: 24 }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          value={selectStructure}
          onChange={sturctureChange}
        >
          {myStructList.map((v) => <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>)}
        </Select>

        {selectStructure
          ? (
            <div key={selectStructure}>
              <Video params={{ jump: false, structId: selectStructure }} />
            </div>
          )
          : []}
      </div>
    </LayoutContent>
  );
}

function mapStateToProps(state) {
  const { auth, global, myStructList } = state;
  return {
    loading: myStructList.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    myStructList: myStructList.data || [],
  };
}

export default connect(mapStateToProps)(ProjectOverview);
