
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import {
  tooltip, toolbox, legend, xAxis, splitLine, axisLine, axisTick, axisLabel, yAxis, DEFAULT_COLOR, color, dataZoom
} from './constants';
/**
 * props:
 * 
 *      data: [ { name: 's', range: '-12~-11.5', probability: 3 }],
 *      height: 图表高度
 *      config: { yAxis: 修改默认y轴值对应的键, xAxis: 修改默认x轴值对应的键,}
 */

class TimeValueMultiAxisChart extends Component {
  constructor(props) {
    super(props);
    this.seriesData = null;
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (JSON.stringify(data) != JSON.stringify(this.props.data)) {
      this.seriesData = this.setData(nextProps);
    }
  }
  setData = (props) => {
    const { data, height, scaleConfig, axis, configs } = this.props;

    const xaxis = configs?.xAxis || 'time';
    let seriesData = {
      xAxis: [],
      series: []
    };
    const keys = axis.map(a => {
      return Object.keys(a)[0];
    })

    data.map(v => {
      keys.forEach((key, index) => {
        if (v[key] !== undefined) {
          const i = seriesData.series.findIndex(f => f.name == v.name);
          if (i !== -1) {
            seriesData.series[i].data.push(v[key]);
            seriesData.xAxis[i].data.push(v[xaxis]);
          } else {
            seriesData.series.push({
              name: v.name,
              type: configs && configs.isRainfall ? 'bar' : 'line',
              yAxisIndex: index,
              data: [v[key]],
              showSymbol: false,
              emphasis: {
                focus: 'series'
              }
            });
            seriesData.xAxis.push({ data: [v[xaxis]] })
          }
        }
      })

    })
    return seriesData;
  }

  UNSAFE_componentWillMount() {
    this.seriesData = this.setData(this.props);
  }
  getOption = () => {

    const { data, height, scaleConfig, axis, configs } = this.props;



    const xaxis = configs?.xAxis || 'time';

    let option = {

      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {}
        },
        right: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
        }
      },

      // backgroundColor: DEFAULT_COLOR,
      color: color,
      legend: {
        right: 100,
        type: 'scroll',
        textStyle: {
          color: '#a2adc2'
        },
        pageTextStyle: {
          color: '#a2adc2'
        },
        pageIconColor: '#2B384A',//翻页按钮的颜色
        pageIconInactiveColor: '#a2adc2'//翻页到头的颜色
      },
      xAxis: {
        ...xAxis.category,
        data: this.seriesData.xAxis[0]?.data || []
      },
      series: this.seriesData.series,


    }
    let i = 0;
    let yAxis = [];
    axis.map(a => {
      Object.keys(a).forEach(key => {
        let position = 'left';
        let offset = {};
        let num = 0;
        if (configs.isThreeAxisleft) {
          position = 'left';

          if ('yAxis2' == key) {
            position = 'right';
          } else {
            num = yAxis.filter(f => f.position == 'left').length;
            if (num > 0) {
              offset = { offset: num * 60 }
            }
          }
        } else if (configs.isThreeAxisRight) {

          position = 'right';
          if ('yAxis1' == key) {
            position = 'left';
          } else {
            num = yAxis.filter(f => f.position == 'right').length;
            if (num > 0) {
              offset = { offset: num * 60 }
            }
          }
        } else {
          if (i == 1)
            position = 'right';
        }
        i++;

        yAxis.push({
          position: position,
          name: scaleConfig[key]?.alias || '',
          type: 'value',
          ...offset
        });

      })

    })

    option.yAxis = yAxis;
    if (configs && configs.slider) {
      option.dataZoom = [{ ...dataZoom, ...configs.slider }, { ...configs.slider }];
    }
    let grid = {};
    if (configs.isThreeAxisleft) {
      grid.left = 150
    }

    if (configs.isThreeAxisRight) {
      grid.right = 150
    }
    option.grid = grid;



    return option;

  }
  render() {
    const { height, width } = this.props;
    const options = this.getOption();
    return (
      <ReactEcharts
        option={options}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: height || '500px', margin: '0', width: width || 'auto' }} />
    )
  }
}

export default TimeValueMultiAxisChart;