import React, { Component } from 'react';
import * as echarts from 'echarts';

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { xAxis, data } = this.props;
    // let xAxis = ['12', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    // let data = [120, 200, 150, 80, 70, 110, 130]
    this.createCharts(xAxis, data);
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  // }

  createCharts = (xAxis, data) => {
    this.clearEchart();
    const chartDom = document.getElementById(this.props.DOMID);
    this.chart = echarts.init(chartDom);

    const option = this.getOption(xAxis, data);
    this.chart.setOption(option);
  };

  clearEchart = () => {
    if (this.chart) {
      this.chart.dispose();
    }
  };

  getOption = (xAxis, data) => {
    const unit = this.props.unit || 'mm';
    const { serialName, config } = this.props;
    const option = {
      backgroundColor: 'transparent',
      tooltip: unit ? {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params) {
          let result = '';
          params.forEach((item) => {
            if (item.marker) result += `<span>${item.axisValue}<br/>${item.marker}${serialName || ''}: ${item.data} ${unit || ''}</span>`;
          });
          return result;
        },
      }
        : {
          trigger: 'axis',
        },
      xAxis: {
        ...(config?.xAxis || {}),
        type: 'category',
        data: xAxis,
        // axisLabel: { color: 'rgba(255, 255, 255)' },//y轴文字颜色
      },
      grid: {
        right: '8%',
        bottom: '16%',
        top: '13%',
      },
      yAxis: {
        ...(config?.yAxis || {}),
        // nameTextStyle: {
        //     color: 'rgba(255, 255, 255)'
        // },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter(v) {
            return unit ? (v + unit) : v;
          },
        },
        // axisLabel: { color: 'rgba(255, 255, 255)' },
        axisLine: {
          show: true,
          lineStyle: {
            // color: 'rgba(185, 200, 218, 0.8)',//左边线的颜色
            width: '1', // 坐标线的宽度
          },
        },
        splitLine: { // 网格线
          lineStyle: {
            type: 'dashed', // 设置网格线类型 dotted：虚线   solid:实线
            // color: 'rgba(47, 83, 234, 0.08)'
          },
          show: true, // 隐藏或显示
        },
      },
      series: [{
        data,
        type: 'bar',
        barWidth: 10, // 柱图宽度
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              { offset: 0, color: '#3877F2' },
              { offset: 0.7, color: '#3877F2' },
              { offset: 1, color: '#3877F2' },
            ],
          ),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                { offset: 0, color: '#01A8F7' },
                { offset: 0.7, color: '#01A8F7' },
                { offset: 1, color: '#01A8F7' },
              ],
            ),
          },
        },
      }],
    };
    return option;
  };

  render() {
    const { height, DOMID } = this.props;
    return <div id={DOMID} style={{ height }} />;
  }
}

export default ColumnChart;
