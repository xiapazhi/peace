/**
 * Created by yuanfenghua on 2018/6/1.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Row, Col, Tabs } from 'antd';
import { Func } from '$utils';
import Style from './style.css';

const { TabPane } = Tabs;

class StructureDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'station',
      curStruct: {},
    };
  }

  static height = 90;

  UNSAFE_componentWillMount() {
    const { match: { params }, structList, activeKey } = this.props;
    const curStruct = structList.find((s) => s.id == params.id);
    this.setState({
      curStruct, activeKey,
    });
  }

  callback = (key) => {
    const {
      match: { params }, dispatch, currentPage, searchVal, filterType,
    } = this.props;
    this.setState({ activeKey: key });
    dispatch(push(`/project-monitor/things/struct/${params.id}/configuration/${key}?currentPage=${currentPage}&searchVal=${searchVal}&filterType=${filterType}`));
  };

  render() {
    const curStruct = this.state.curStruct || this.props.structure || {};
    const {
      id, name, portrait, type,
    } = curStruct;
    const {
      pathname, currentPage, searchVal, filterType,
    } = this.props;
    return (
      <Row type="flex" className="wrapper-background" style={{ padding: 20 }}>
        <Row type="flex">
          <div className={Style.logo}>
            <img src={portrait ? Func.downloadFile(portrait) : ''} />
          </div>
          <div>
            <h1 className="text-primary-color" style={{ fontSize: 20, fontWeight: 500 }}>
              {name}
              <Link
                style={{ marginLeft: 10, fontSize: 14, fontWeight: 'normal' }}
                to={`/project-monitor/structure?currentPage=${currentPage}&searchVal=${searchVal}&filterType=${filterType}`}
              >
                返回
              </Link>
            </h1>
          </div>
        </Row>
        {
          pathname.indexOf('equipment') > -1 ? null : (
            <Col span="24">
              <div id="structureTabWrapper" style={{ textAlign: 'left' }}>
                <Tabs
                  defaultActiveKey={this.props.activeKey}
                  style={{ marginBottom: -17, marginLeft: -8, fontSize: 14 }}
                  activeKey={this.state.activeKey}
                  onChange={this.callback}
                >
                  <TabPane tab="测点管理" key="station" />
                  <TabPane tab="阈值配置" key="threshold" />
                  <TabPane tab="2D布设" key="2d" />
                  <TabPane tab="3D布设" key="3d" />
                  <TabPane tab="BIM模型" key="glbim" />
                  <TabPane tab="组合计算" key="combCalc" />
                  <TabPane tab="视频监控" key="video" />
                  <TabPane tab="动态采集" key="collection" />
                  <TabPane tab="聚集配置" key="aggregate" />
                </Tabs>
              </div>
            </Col>
          )
        }
      </Row>
    );
  }
}

function mapStateToProps(state) {
  const { auth, singleStructState, structList } = state;
  return {
    user: auth.user,
    structure: singleStructState.data,
    structList: structList.data || [],
  };
}

export default connect(mapStateToProps)(StructureDetails);
