import React, { useMemo } from 'react';
import moment from 'moment';

function RealTimeData(props) {
  const {
    realtimeData, selectSensorId, factorName, location, realtimeAlarms, thresholdBatch: batch,
  } = props;
  const thresholdBatch = useMemo(() => batch.reduce((pre, cur) => {
    pre = [].concat(pre, [cur]);
    return pre;
  }, []), [batch]);

  const alarms = useMemo(() => {
    if (realtimeAlarms?.alarms && realtimeAlarms.alarms.length > 0) {
      return realtimeAlarms.alarms[0].alarms;
    }
    return [];
  }, [realtimeAlarms]);

  const renderData = () => {
    let str = ''; let
      time = '';
    if (realtimeData && selectSensorId && realtimeData.stations && realtimeData.stations.find((s) => s.id == selectSensorId)) {
      const dataSource = realtimeData.stations.find((s) => s.id == selectSensorId).data;
      if (dataSource.length > 0) {
        Object.keys(realtimeData.items).forEach((key) => {
          str += `${realtimeData.items[key].name}:${dataSource[dataSource.length - 1][key]}${realtimeData.items[key].unit}  `;
        });
        time = moment(dataSource[dataSource.length - 1].time).format('YYYY-MM-DD HH:mm:ss');
      } else {
        str = '-';
      }
    } else {
      str = '-';
    }
    return [str, time];
  };

  const getThresData = () => {
    const thres = [null, null, null];
    if (thresholdBatch && thresholdBatch.length > 0) {
      thresholdBatch.map((s) => {
        if (s?.data?.stations.find((x) => x.id == selectSensorId)) {
          let thres1 = ''; let thres2 = ''; let
            thres3 = '';
          s?.data?.items.map((v) => {
            const arr = v.config[0]?.thresholds;
            arr.map((t, index) => {
              index == 0 ? thres1 += `${v.name} : ${t.value}       `
                : index == 1 ? thres2 += `${v.name} : ${t.value}       `
                  : index == 2 ? thres3 += `${v.name} : ${t.value}       `
                    : '';
            });
            thres1 != '' ? thres[0] = thres1 : '';
            thres2 != '' ? thres[1] = thres2 : '';
            thres3 != '' ? thres[2] = thres3 : '';
          });
        }
      });
    }
    return thres;
  };

  let alarmText = renderData()[0] == '-' ? '-' : '正常'; let
    color = renderData()[0] == '-' ? 'grey' : '#52c41a';
  if (alarms.length > 0) {
    const alarm = alarms.find((s) => s?.source?.id == selectSensorId);
    if (alarm && alarm.level) {
      const { level } = alarm;
      switch (level) {
        case 1:
          alarmText = '一级告警';
          color = '#ff2a00';
          break;
        case 2:
          alarmText = '二级告警';
          color = '#ff9600';
          break;
        case 3:
          alarmText = '三级告警';
          color = '#fcff00';
          break;
      }
      alarmText = level == 1 ? '一级告警' : level == 2 ? '二级告警' : '三级告警';
    }
  }
  return (
    <div className="realtime-data-text" style={{ height: 374, border: '1px solid rgba(47, 83, 234, 0.08)', marginTop: 20 }}>
      <div>
        监测因素：
        {factorName}
      </div>
      <div>
        测点名称：
        {location}
      </div>
      <div>
        实时数据：
        <span style={{ background: color, padding: 5, borderRadius: 5 }}>
          {renderData()[0]}
          /
          {alarmText}
        </span>
      </div>
      <div>
        采集时间：
        {renderData()[1]}
      </div>
      <div>
        一级阈值：
        {getThresData() && getThresData()[0] ? getThresData()[0] : '未设置'}
      </div>
      <div>
        二级阈值：
        {getThresData() && getThresData()[1] ? getThresData()[1] : '未设置'}
      </div>
      <div>
        三级阈值：
        {getThresData() && getThresData()[2] ? getThresData()[2] : '未设置'}
      </div>
    </div>
  );
}

export default RealTimeData;
