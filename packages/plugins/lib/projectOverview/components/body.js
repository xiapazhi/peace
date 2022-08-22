import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Tabs, Select, Row, Col, Spin, Empty,
} from 'antd';
import '../style.less';
import { push } from 'react-router-redux';
import ProCard from '@ant-design/pro-card';
import { PinyinHelper } from '@peace/utils';
import PerfectScrollbar from 'perfect-scrollbar';
import { Func } from '$utils';
import Gis from './Gis';
import MoreStructSensorAlarm from './moreStructSensorAlarm';
import StructSensorAlarm from './structSensorAlarm';

const { TabPane } = Tabs;
const { Option } = Select;

function Body(props) {
  const {
    dispatch, actions, user, clientWidth, structuresList, location, isRequesting, clientHeight,
  } = props;
  const { structId } = location.state || {};

  const [structureSelected, setStructureSelected] = useState(structId || null);
  const [windowClientWidth, setWindowClientWidth] = useState(1720);
  let scrollbar = null;

  useEffect(() => {
    dispatch(actions.projectOverview.getUserAlarmsInfo(user.id));
    dispatch(actions.projectOverview.getStructuresByOrganizations(user.orgId));
    window.onresize = () => {
      setWindowClientWidth(document.body.clientWidth);
    };
    scrollbar = new PerfectScrollbar('#card-content', { suppressScrollX: true });
  }, []);

  useEffect(() => {
    const dom = document.getElementById('card-content');
    if (dom && scrollbar) {
      scrollbar.update();
      dom.scrollTop = 0;
    }
  }, [clientHeight]);

  const projectSelect = (value) => {
    // if (structuresList && structuresList.length > 0) {
    //   let hasStruct = false;
    //   structuresList.map((s) => {
    //     if (s.id == value) {
    //       setStructure(s);
    //       hasStruct = true;
    //     }
    //   });
    //   if (!hasStruct) {
    //     setStructure({ id: -1 });
    //   }
    // }
    setStructureSelected(value);
  };

  const structClick = (id) => {
    // todo 单个结构物功能需完善
    dispatch(push({ pathname: '/singleProjectOverview', state: { structId: id } }));
  };

  const searchSelect = () => (
    <Select
      style={{ marginRight: (windowClientWidth > 1400 ? windowClientWidth * 0.6 : windowClientWidth * 0.4), width: 256 }}
      showSearch
      placeholder="可以选择或者搜索结构物"
      onSelect={(value) => projectSelect(value)}
      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        || PinyinHelper.isPinyinMatched(option.children, input)}
      value={structureSelected || -1}
    >
      <Option key={-1} value={-1}>全部</Option>
      {
        structuresList.map((st) => (<Option key={st.id} value={st.id}>{st.name}</Option>))
      }
    </Select>
  );

  const getStructImg = (portrait) => Func.downloadFile(portrait);

  const filterStructures = structureSelected > 0 ? structuresList.filter((f) => f.id === structureSelected) : structuresList;

  const renderStructCards = () => {
    if (filterStructures.length > 0) {
      const colSpan = filterStructures.length > 1 ? { colSpan: { xxl: 8, xl: 12 } } : {};
      const wrapProps = filterStructures.length > 1 ? { ghost: true, gutter: 10, wrap: true } : {};
      return (
        <div className="contentBody">
          <ProCard {...wrapProps}>
            {
              filterStructures.map((s) => (
                <ProCard key={s.id} style={{ marginBottom: 10 }} {...colSpan}>
                  <Row
                    className="structName"
                    onClick={() => structClick(s.id)} // todo
                    style={{ cursor: 'pointer' }}
                  >
                    {s.name || ''}
                  </Row>
                  <Row className={filterStructures.length > 1 ? 'structImg' : 'structImgSingle'}>
                    <img src={getStructImg(s.portrait)} />
                  </Row>
                  {
                    filterStructures.length > 1 ? <MoreStructSensorAlarm structureSelected={s.id} /> : (
                      <StructSensorAlarm
                        structureSelected={s.id}
                      />
                    )
                  }

                </ProCard>
              ))
            }
          </ProCard>
        </div>
      );
    }
    return <Empty />;
  };
  return (
    <Spin spinning={isRequesting}>
      <Tabs
        defaultActiveKey="card"
        tabBarExtraContent={searchSelect()}
      >
        <TabPane tab="卡片" key="card">
          <div className="content" id="card-content" style={{ height: Func.getContentHeight(clientHeight) - 46, position: 'relative' }}>
            {
              renderStructCards()
            }
          </div>

        </TabPane>
        <TabPane tab="GIS" key="gis">
          {
            filterStructures.length > 0 ? <Gis gisStructures={filterStructures} />
              : <Empty />
          }
        </TabPane>
      </Tabs>
    </Spin>
  );
}

function mapStateToProps(state) {
  const { global, auth, structuresList } = state;
  return {
    loading: structuresList.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientHeight: global.clientHeight,
    clientWidth: global.clientWidth,
    structuresList: structuresList.data || [],
    isRequesting: structuresList.isRequesting,
  };
}

export default connect(mapStateToProps)(Body);
