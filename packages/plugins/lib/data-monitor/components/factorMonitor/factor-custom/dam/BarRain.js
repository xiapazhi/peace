import React from 'react';
import './style.less';
import moment from 'moment';
import ColumnChart from '../charts/bar-chart';

function BarRain(props) {
  const {
    data, struct, factorId, selectSensorId, factorName, station,
  } = props;
  let rainfall = '';
  const rainData = { xAxis: [], data: [], designFloodLevel: null };

  if (data.stations && data.stations.find((s) => s.id == selectSensorId)) {
    const stationData = data.stations.find((s) => s.id == selectSensorId).data;
    if (stationData.length > 0) {
      rainfall = stationData[stationData.length - 1]?.rainfall;
    }

    stationData.map((s) => {
      rainData.xAxis.push(moment(s.time).format('HH:mm'));
      rainData.data.push(s?.rainfall || 0);
    });
  }

  return (
    <div>
      <div className="btn-container">
        <div className="btn-item blue">
          实时雨量：
          {rainfall}
          {data?.items?.rainfall?.unit}
        </div>
        <div className="btn-item blue-dark">
          测点：
          {station?.name}
        </div>
      </div>

      {rainData.data.length > 0 ? (
        <ColumnChart
          DOMID="shuiku-rain-column"
          xAxis={rainData.xAxis}
          data={rainData.data}
          serialName="雨量"
          config={{ yAxis: { name: data?.items?.rainfall?.name }, xAxis: { name: '时间' } }}
          height={240}
        />
      ) : <div className="no-data">暂无图表数据</div>}
    </div>
  );
}

export default BarRain;
