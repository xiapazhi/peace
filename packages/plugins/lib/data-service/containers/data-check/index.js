import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  Select, Row, Col, Checkbox, message, DatePicker,
} from 'antd';
import { useSafeState } from 'ahooks';
import { clearData } from '@peace/utils';
import moment from 'moment';
import DataTable from '../../components/data-check/data-table';
import FacotorModule from '../../components/data-check/factor';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

function HistoryDataContainer({ ...props }) {
  const {
    dispatch, actions, structId, myStationList, factorId, historyData, factorProto, windroseData, selectSensorId, vibrationRawsData, vibrationFftsData,
  } = props;
  const [stationId, setStationId] = useSafeState(selectSensorId ? [selectSensorId] : null);
  const [showChart, setShowChart] = useSafeState(true);
  const [showData, setShowData] = useSafeState(true);
  const [realData, setRealData] = useSafeState(true);
  const [begin, setBegin] = useSafeState(moment().subtract(1, 'd').valueOf());
  const [end, setEnd] = useSafeState(moment().valueOf());
  const [aggtype, setAggtype] = useSafeState('h');
  const [timeOption, setTimeOption] = useSafeState('day');
  const [rangeDate, setRangeDate] = useSafeState([moment(moment().subtract(1, 'day'), dateFormat), moment(moment(), dateFormat)]);

  useEffect(() => {
    if (selectSensorId) {
      const id = selectSensorId ? [selectSensorId] : null;
      setStationId(id);
    }
  }, [selectSensorId]);

  useEffect(() => {
    const hasStation = Array.isArray(stationId) ? stationId.length > 0 : stationId;
    if (hasStation) {
      dispatch(actions.dataService.getHistoryData(stationId.toString(), begin, end, realData ? null : aggtype));
    }
  }, [stationId, begin, end, aggtype, realData]);

  useEffect(() => {
    if (structId && factorId && myStationList) dispatch({ type: 'REQUEST_STATION_HISTTORY_DATA' }); // 判断条件可解决页面刷新异常问题
    if (myStationList?.length > 0) {
      const stations = [];
      myStationList.filter((x) => x.factorId == factorId).map((s) => s.groups.map((k) => k.stations.map((v) => {
        stations.push(v.id);
      })));
      selectSensorId ? '' : stations.length > 0 ? setStationId(stations[0]) : setStationId(null);
    }
  }, [myStationList, structId, factorId]);

  const onStationChange = (value) => {
    if (value.length === 0) {
      message.info('未选择传感器！');
    }
    setStationId(value);
  };

  // 风速风向测点
  const windDirecStations = useMemo(() => {
    if (myStationList?.length > 0) {
      return myStationList.filter((s) => s.factorProto == '1001').reduce((p, c) => p.concat(c.groups.reduce((pc, cc) => pc.concat(cc.stations), [])), []);
    }
    return [];
  }, [myStationList]);

  useEffect(() => {
    if (['5001', '5002', '5003', '5006'].some((f) => f === factorProto)) {
      const needData = [];
      historyData.forEach((e) => {
        e.stations.forEach((s) => {
          if (s?.data.length) {
            const groups = myStationList.find((f) => f.factorId === Number(factorId))?.groups || [];
            const stations = groups.reduce((p, c) => {
              p = p.concat(c.stations);
              return p;
            }, []);
            const station = stations.find((f) => f.id === s.id);
            if (station) {
              needData.push({ stationId: s.id, collectTime: s.data[0].time });
            }
          }
        });
      });
      if (needData.length) {
        dispatch(actions.dataService.getVibrationRawsData(needData, factorProto));
        dispatch(actions.dataService.getVibrationFftsData(needData, factorProto));
      } else {
        clearData(dispatch, { actionType: 'GET_VIBERATION_RAWS_DATA' });
        clearData(dispatch, { actionType: 'GET_VIBERATION_FFTS_DATA' });
      }
    }
  }, [factorProto, historyData]);

  useEffect(() => {
    if (factorProto && factorProto == '1001') {
      if (stationId && !Array.isArray(stationId) && windDirecStations?.find((x) => x.id === stationId)) {
        dispatch(actions.dataService.getWindRoseData(stationId.toString(), begin, end));
      } else {
        clearData(dispatch, { actionType: 'WIND_ROSE_DATA' });
      }
    }
  }, [factorProto, stationId, begin, end, aggtype, realData]);

  const onTimeChange = (value) => {
    setTimeOption(value);
    setRangeDate([moment(moment().subtract(1, value), dateFormat), moment(moment(), dateFormat)]);
    setBegin(moment().subtract(1, value).valueOf());
    setEnd(moment().valueOf());
  };

  const onDateRangeChange = (dates, dateStrings) => {
    setTimeOption(null);
    setRangeDate(dateStrings);
    setBegin(moment(dateStrings[0]).startOf('day').valueOf());
    setEnd(moment(dateStrings[1]).endOf('day').valueOf());
  };

  const onOk = (value) => {
    setRangeDate(value);
  };

  return (
    <div>
      <Row>
        <Select
          // allowClear
          placeholder="选择传感器"
          style={{ minWidth: 300, marginRight: 27 }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          value={stationId || []}
          onChange={onStationChange}
          mode={['5001', '5002', '5003', '5006', '1001', '1003'].includes(factorProto) ? '' : 'multiple'}
        >
          {
            myStationList?.length > 0 ? myStationList.filter((x) => x.factorId == factorId).map((s) => s.groups.map((k) => k.stations.map((v) => <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>))) : []
          }
        </Select>

        <RangePicker
          style={{ width: 250, marginLeft: 5, marginRight: 15 }}
          allowClear={false}
          showTime={false}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          format={dateFormat}
          value={rangeDate.length == 2 ? [moment(rangeDate[0], dateFormat), moment(rangeDate[1], dateFormat)] : []}
          onChange={onDateRangeChange}
          renderExtraFooter={() => (
            <div>
              <span style={{ cursor: 'pointer', color: timeOption == 'day' ? '#2F53EA' : 'black', marginRight: 15 }} onClick={() => { onTimeChange('day'); }}>最近一天</span>
              <span style={{ cursor: 'pointer', color: timeOption == 'week' ? '#2F53EA' : 'black', marginRight: 15 }} onClick={() => { onTimeChange('week'); }}>最近一周</span>
              <span style={{ cursor: 'pointer', color: timeOption == 'month' ? '#2F53EA' : 'black', marginRight: 15 }} onClick={() => { onTimeChange('month'); }}>最近一月</span>
              <span style={{ cursor: 'pointer', color: timeOption == 'year' ? '#2F53EA' : 'black', marginRight: 15 }} onClick={() => { onTimeChange('year'); }}>最近一年</span>
            </div>
          )}
          onOk={onOk}
        />

        {!realData ? <span style={{ lineHeight: '32px', marginRight: 15 }}>聚集粒度:</span> : ''}
        {!realData ? (
          <Select
            placeholder="选择聚集粒度"
            style={{ width: 80, marginRight: 27 }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            value={aggtype}
            onChange={(value) => { setAggtype(value); }}
          >
            <Select.Option key="h" value="h">时</Select.Option>
            <Select.Option key="d" value="d">天</Select.Option>
            <Select.Option key="w" value="w">周</Select.Option>
            <Select.Option key="m" value="m">月</Select.Option>
            {/* <Select.Option key={'y'} value={'y'}>年</Select.Option> */}
          </Select>
        ) : ''}

        <Checkbox checked={realData} onChange={(e) => { setRealData(!realData); }}><span className="video-span">实时数据</span></Checkbox>
        <Checkbox checked={showChart} onChange={(e) => { setShowChart(!showChart); }}><span className="video-span">趋势图</span></Checkbox>
        <Checkbox checked={showData} onChange={(e) => { setShowData(!showData); }}><span className="video-span">数据表格</span></Checkbox>
      </Row>
      {showChart
        ? (
          <FacotorModule vibrationRawsData={vibrationRawsData} vibrationFftsData={vibrationFftsData} factorProto={factorProto} data={historyData} windroseData={windroseData} />
        )
        : ''}
      {showData
        ? (
          <div style={{ marginTop: 20 }}>
            <DataTable data={historyData} />
          </div>
        )
        : ''}
    </div>
  );
}

function mapStateToProps(state) {
  const {
    auth, global, myStructList, historyData, windroseData, vibrationRawsData, vibrationFftsData,
  } = state;
  return {
    loading: myStructList.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    myStructList: myStructList.data || [],
    historyData: historyData.data || [],
    windroseData: windroseData.data || [],
    vibrationRawsData: vibrationRawsData.data || [],
    vibrationFftsData: vibrationFftsData.data || [],
  };
}

export default connect(mapStateToProps)(HistoryDataContainer);
