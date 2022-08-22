import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal } from 'antd';
import './style.less';
import RealTimeData from '../../components/factorMonitor/realtime-data';
import RealTimeChart from '../../components/factorMonitor/realtime-chart';
import HistoryDataContainer from '../../../data-service/containers/data-check';

const interval = null;
function RealTime({ ...props }) {
  const {
    dispatch, actions, realtimeData, stations, selectSensorId, myStructList,
    myStationList, realtimeAlarms, factorName, thresholdBatch, structId, factorId, factorProto,
  } = props;
  const [arr, setArr] = useState(null); // 最新12条数据
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (selectSensorId) {
      setArr({});
      if (interval) clearInterval(interval);
      dispatch(actions.dataMonitor.getRealTimeData(selectSensorId));

      // interval = setInterval(() => {
      //     dispatch(actions.dataMonitor.getRealTimeData(selectSensorId));
      // }, 1000)
    }
  }, [selectSensorId]);

  useEffect(() => {
    if (structId) {
      setArr({});
    }
  }, [structId]);

  useEffect(() => componentWillUnmount, []);

  const componentWillUnmount = () => {
    if (interval) clearInterval(interval);
  };

  useEffect(() => {
    if (realtimeData && realtimeData.stations) {
      if (JSON.stringify(realtimeData) != JSON.stringify(arr)) {
        setArr(realtimeData);
      }
    }
  }, [realtimeData]);

  const onClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <div style={{ marginTop: 20 }}>
        <Row>
          <Col span={12}><span className="monitor-header-title">实时监测</span></Col>
          <Col span={12} style={{ textAlign: 'right', color: '#2F53EA' }}>
            <a onClick={() => { setVisible(true); }}>历史数据</a>
          </Col>

          <Modal
            width="80%"
            visible={visible}
            title="历史数据"
            onCancel={() => { onClose(); }}
            onOk={() => {
              onClose();
            }}
            destroyOnClose
          >
            <HistoryDataContainer
              myStationList={myStationList}
              factorId={factorId}
              factorProto={factorProto}
              selectSensorId={selectSensorId}
            />
          </Modal>
        </Row>

        <Row>
          <Col span={15} style={{ paddingRight: 24 }}>
            <RealTimeChart
              factorProto={factorProto}
              factorId={parseInt(factorId)}
              factorName={factorName}
              selectSensorId={selectSensorId}
              data={arr}
              struct={myStructList && structId ? myStructList.find((s) => s.id == structId) : null}
              station={stations && selectSensorId ? stations.find((s) => s.id == selectSensorId) : {}}
              stations={myStationList}
            />
          </Col>

          <Col span={9}>
            <RealTimeData
              realtimeData={arr}
              factorName={factorName}
              location={stations && selectSensorId ? stations.find((s) => s.id == selectSensorId)?.name : '-'}
              thresholdBatch={thresholdBatch}
              selectSensorId={selectSensorId}
              realtimeAlarms={realtimeAlarms}
            />
          </Col>
        </Row>

      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { auth, global, realtimeData } = state;
  return {
    loading: realtimeData.isRequesting,
    user: auth.user,
    actions: global.actions,
    realtimeData: realtimeData.data || {},
  };
}

export default connect(mapStateToProps)(RealTime);
