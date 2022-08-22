import React, { Component } from 'react';
import moment from 'moment';
import { ProCard } from '@ant-design/pro-card';
import { Charts } from '@peace/components';
import { Row, Col } from 'antd';
import LineChart from '../line-chart';

const { TimeValueLineChart } = Charts;

class VibrationChart extends Component {
  // constructor(props) {

  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //     if (nextProps.data && (JSON.stringify(nextProps.data) != JSON.stringify(this.props.data))) {
  //         return true;
  //     }
  // }
  renderVibrationRawsAndFfts = () => {
    const { vibrationRawsData, vibrationFftsData } = this.props;

    const rawsData = [];
    let rawsCfg = {};
    let hasRaws = false;
    if (vibrationRawsData.length) {
      vibrationRawsData.map((e) => {
        const { data = [], config = {} } = e.data;
        rawsCfg = { ...config };
        let temp = [];
        if (data && data.length) {
          hasRaws = true;
          temp = data.map((d) => [d?.time, d?.value]);
        }
        rawsData.push({
          name: `触发时间：${moment(rawsCfg?.collectTime).format('YYYY-MM-DD HH:mm:ss')}`,
          data: temp,
        });
      });
    }

    const fftsData = [];
    let fftsCfg = {};
    let hasFfts = false;
    if (vibrationFftsData.length) {
      vibrationFftsData.map((e) => {
        const { data = [], config = {} } = e.data;
        fftsCfg = { ...config };
        let temp = [];
        if (data && data.length) {
          hasFfts = true;
          temp = data.map((d) => [d?.time, d?.value]);
        }
        fftsData.push({
          name: `触发时间：${moment(rawsCfg?.collectTime).format('YYYY-MM-DD HH:mm:ss')}`,
          data: temp,
        });
      });
    }
    const splits = hasRaws && hasFfts ? { split: 'vertical' } : {};
    return (
      <ProCard
        bordered
        headerBordered
        {...splits}
      >
        {
          hasRaws && (
            <ProCard title="时域图" colSpan={hasFfts ? '50%' : '100%'}>
              <LineChart
                seriesData={rawsData}
                height={300}
                yAxisName={rawsCfg?.unit || ''}
                xAxisName="s"
                DOMID="vibration-chart-Raws"
                grids={['10%', '3%', '3%', '7%']}
                type="value"
                overflow="visible"
              />
            </ProCard>
          )
        }
        {
          hasFfts && (
            <ProCard title="频谱图">
              <LineChart
                seriesData={fftsData}
                height={300}
                yAxisName={fftsCfg?.unit || ''}
                xAxisName="s"
                DOMID="vibration-chart-ffts"
                grids={['10%', '3%', '3%', '7%']}
                type="value"
                overflow="visible"
              />
            </ProCard>
          )
        }
      </ProCard>
    );
  };

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
              value: x.values[key],
              time: moment(x.time).format('YYYY-MM-DD HH:mm:ss'),
            });
          }));
          return (
            <ProCard style={{ marginTop: 20 }} key={key} title={`${data[0]?.items[key]?.name || ''}趋势图`} hoverable bordered>
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

  render() {
    return (
      <div style={{
        minHeight: 374, border: '1px solid rgba(47, 83, 234, 0.08)', marginTop: 20, padding: '8px 24px 20px 24px',
      }}
      >
        {this.renderCharts()}
        {this.renderVibrationRawsAndFfts()}
      </div>
    );
  }
}

export default VibrationChart;
