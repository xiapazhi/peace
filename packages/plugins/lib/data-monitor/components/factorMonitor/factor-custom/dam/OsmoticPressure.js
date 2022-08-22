import React, { useState, useEffect, useMemo } from 'react';
import SlPressureChart from '../charts/sl-pressure';
import './style.less';
import CustomChart from '../generic-chart';
import { useFsRequest, ApiTable } from '$utils';
import { damFactors } from '../constant';
import { Select } from 'antd';
import moment from 'moment';

const { waterLevelFactorName, osmoticePressure } = damFactors;

function OsmoticPressure(props) {
  const {
    data, struct, factorId, selectSensorId, stations, station,
  } = props;
  const [stationId, setStationId] = useState(null);

  const [groupId, setGroupId] = useState(null);
  const [groupStations, setGroupStations] = useState(null);// 当前选择的分组下测点

  let pressure = ''; let
    key = null;
  if (data.stations && data.stations.find((s) => s.id == selectSensorId)) {
    Object.keys(data.items).forEach((i) => {
      if (!key) key = i;
    });
    const stationData = data.stations.find((s) => s.id == selectSensorId).data;
    if (stationData.length > 0) {
      pressure = stationData[stationData.length - 1][key];
    }
  }

  const {
    data: themeData = [],
  } = useFsRequest({
    url: ApiTable.getStationData,
    query: {
      limit: 1,
      stations: stationId,
    },
    refreshDeps: [stationId],
    ready: !!(stationId),
  });

  const {
    data: groupData = [],
  } = useFsRequest({
    url: ApiTable.getStationData,
    query: {
      // limit: 1,
      stations: groupStations,
      begin: moment().startOf('D').valueOf(),
      end: moment().valueOf(),
      orderDirection: 'DESC',
    },
    refreshDeps: [groupStations],
    ready: !!(groupStations),
  });

  const groups = useMemo(() => {
    let rslt = [];
    if (stations.length > 0) {
      rslt = stations.find((x) => x.factorName == osmoticePressure)?.groups || [];
    }
    return rslt;
  }, [stations]);

  useEffect(() => {
    if (groupId) {
      const staionsFilter = groups.find((s) => s.id == groupId)?.stations.map((x) => x.id);
      if (staionsFilter && staionsFilter.length > 0) setGroupStations(staionsFilter.toString());
    }
  }, [groupId]);

  useEffect(() => {
    if (groups.length > 0) {
      const curGroup = groups.find((f) => f.stations.find((s) => s.id === station.id));
      if (curGroup) {
        setGroupId(curGroup.id);
      }
    }
  }, [station, groups]);

  useEffect(() => {
    let stationIdTemp = null;
    if (stations.length > 0) {
      const station = stations.find((x) => x.factorName == waterLevelFactorName);
      if (station && station?.groups?.length > 0 && station?.groups[0]?.stations.length > 0) {
        stationIdTemp = station?.groups[0]?.stations[0]?.id;
      }
      if (stations.find((x) => x.factorName == osmoticePressure) && !groupId) {
        setGroupId(stations.find((x) => x.factorName == osmoticePressure).groups[0].id);
      }
    }
    setStationId(stationIdTemp);
  }, [stations]);

  const waterLevel = themeData.length > 0 && themeData[0].stations.length > 0 && themeData[0].stations[0].data.length > 0 ? themeData[0].stations[0].data[0].values?.waterLevel : null;
  const dataArr = [];// 渗流压力数据 [[50,12]] 横坐标分组参数 纵坐标采集值

  if (groupData.length > 0) {
    groupData[0].stations.map((x) => {
      if (x.data.length > 0) {
        const groupFilter = groups.find((s) => s.id == groupId)?.stations;
        const staionsFilter = groupFilter.find((s) => s.id == x.id);
        const xData = staionsFilter?.groupParams?.height;
        xData && dataArr.push({ data: [xData, x.data[x.data.length - 1].values[key]], stationName: x.name });
      }
    });
  }

  const {
    struct: {
      extraInfo: {
        damHeight, designFloodLevel, ssw, reservoirLength, damTop, jhhsw, hbgd,
      },
    },
  } = props;
  const hasOption = damHeight && designFloodLevel && ssw && reservoirLength && damTop && jhhsw && hbgd;

  return (
    <div>
      <div className="btn-container">
        <div className="btn-item blue">
          实时水位：
          {pressure}
          {key && data?.items[key] ? data?.items[key]?.unit : ''}
        </div>
        <div className="btn-item blue-dark">
          测点：
          {station?.name}
        </div>
        <Select
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          className="select"
          value={groupId}
          onChange={(e) => { setGroupId(e); }}
        >
          {groups && groups.map((s) => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
        </Select>
      </div>

      {hasOption ? (
        <SlPressureChart
          height={300}
          DOMID="realtime-chart-sl"
          grids={['7%', '3%', '3%', '7%']}
          type="value"
          overflow="visible"
          struct={struct}
          waterLevel={waterLevel}
          slData={dataArr}
        />
      ) : <div className="no-data">水库大坝信息缺失,请配置相关参数</div>}
      <CustomChart {...props} />
    </div>
  );
}

export default OsmoticPressure;
