import React from 'react';
import moment from 'moment';
import LineChart from './charts/line-chart';

function CustomChart(props) {
  const {
    data, selectSensorId,
  } = props;

  const renderCharts = () => {
    if (data && data.stations && selectSensorId && data.stations.find((s) => s.id == selectSensorId)) {
      const dataSource = data.stations.find((s) => s.id == selectSensorId)?.data;
      if (dataSource.length > 0) {
        return Object.keys(data.items).map((key) => {
          const arr = {
            xAxisData: dataSource.map((s) => moment(s.time).format('MM-DD HH:mm')),
            seriesData: [
              { name: data.items[key].name, data: dataSource.map((s) => s[key]) },
            ],
          };
          return (
            <div style={{ marginTop: 20 }}>
              <LineChart
                xAxisData={arr.xAxisData}
                seriesData={arr.seriesData}
                height={200}
                DOMID={`realtime-chart-${key}`}
                unit={data.items[key].unit}
                configs={{ unit: data?.items[key]?.unit, yAxis: { name: data?.items[key]?.name }, xAxis: { name: '时间' } }}
                smooth
                grids={['15%', '7%', '3%', '7%']}
                type="value"
                overflow="visible"
              />
            </div>
          );
        });
      }
      return <div className="no-data">暂无图表数据</div>;
    }
    return <div className="no-data">暂无图表数据</div>;
  };

  return (
    renderCharts()
  );
}

export default CustomChart;
