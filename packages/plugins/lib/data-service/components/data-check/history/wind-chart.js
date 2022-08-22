import React, { Component } from 'react';
import moment from 'moment';
import { ProCard } from '@ant-design/pro-card';
import { Charts } from '@peace/components';
import { Row, Col } from 'antd';
import { WindLevels } from '$utils';

const { TimeValueLineChart, WindRoseChart } = Charts;

class WindChart extends Component {
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

          dataSource.map((s) => s.data.map((x) => {
            arr.push({
              name: s.name,
              value: Math.round(x.values[key] * 1000) / 1000,
              time: moment(x.time).format('YYYY-MM-DD HH:mm:ss'),
            });
          }));

          return (
            <ProCard style={{ marginTop: 20 }} key={key} title={`${data[0]?.items[key]?.name || ''}趋势图`}>
              <TimeValueLineChart
                key={`timeValueLineChart-${key}`}
                data={arr}
                height={300}
                xAxis="time"
                configs={{ slider: { start: 0, end: 100 }, unit: data[0]?.items[key]?.unit, yAxis: { name: data[0]?.items[key]?.name } }}
              />
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

  renderWindRoseChart = () => {
    const { windroseData } = this.props;

    if (windroseData && windroseData.length > 0) {
      const legendArr = WindLevels;
      const dataSource = [];
      legendArr.map((s, index) => {
        const arr = [];
        windroseData.map((x) => {
          x.level == s ? arr.push(x.value) : '';
        });
        dataSource.push({
          type: 'bar',
          data: arr,
          coordinateSystem: 'polar',
          name: s,
          stack: 'a',
          itemStyle: {

          },
        });
      });
      return (
        <WindRoseChart
          data={dataSource}
          height={400}
        />
      );
    }
  };

  render() {
    return (
      <ProCard
        style={{ marginTop: 20 }}
        split="vertical"
        bordered
        headerBordered
      >
        <ProCard split="horizontal">
          {this.renderCharts()}
        </ProCard>

        <ProCard title="风玫瑰图" colSpan="40%">
          {this.renderWindRoseChart()}
        </ProCard>
      </ProCard>

    );
  }
}

export default WindChart;
