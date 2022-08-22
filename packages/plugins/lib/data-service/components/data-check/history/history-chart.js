import React, { Component } from 'react';
import moment from 'moment';
import { ProCard } from '@ant-design/pro-card';
import { Charts } from '@peace/components';
import StaticTable from './static-table';

const { TimeValueLineChart } = Charts;

class HistoryChart extends Component {
  // constructor(props) {

  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //     if (nextProps.data && (JSON.stringify(nextProps.data) != JSON.stringify(this.props.data))) {
  //         return true;
  //     }
  // }
  renderCharts = () => {
    const { data } = this.props;

    if (data && data.length > 0) {
      const dataSource = data[0].stations;
      if (dataSource.length > 0 && dataSource.find((x) => x.data.length > 0)) {
        return Object.keys(data[0].items).map((key) => {
          const arr = [];
          const staticData = dataSource.map((s) => {
            const newData = s.data.map((x) => {
              const obj = {
                name: s.name,
                value: Math.round(x.values[key] * 1000) / 1000,
                time: moment(x.time).format('YYYY-MM-DD HH:mm:ss'),
              };
              arr.push(obj);
              return {
                value: obj.value,
                time: obj.time,
              };
            });
            return {
              ...s,
              data: newData,
            };
          });
          return (
            <ProCard style={{ marginTop: 20 }} key={key} title={`${data[0]?.items[key]?.name || ''}趋势图`} hoverable bordered>
              <TimeValueLineChart
                key={`timeValueLineChart-${key}`}
                data={arr}
                height={300}
                xAxis="time"
                configs={{ slider: { start: 0, end: 100 }, unit: data[0]?.items[key]?.unit, yAxis: { name: data[0]?.items[key]?.name } }}
              />
              <StaticTable data={staticData} />
            </ProCard>

          );
        });
      }
      return (
        <div style={{
          textAlign: 'center', color: '#b9c8d7', fontSize: 24, lineHeight: '150px',
        }}
        >
          暂无数据
        </div>
      );
    }
    return (
      <div style={{
        textAlign: 'center', color: '#b9c8d7', fontSize: 24, lineHeight: '150px',
      }}
      >
        暂无数据
      </div>
    );
  };

  render() {
    return this.renderCharts();
  }
}

export default HistoryChart;
