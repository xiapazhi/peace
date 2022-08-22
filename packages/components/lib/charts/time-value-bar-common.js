import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import {
  toolbox, legend, xAxis, splitLine, axisLine, axisTick, axisLabel, yAxis, DEFAULT_COLOR, color, dataZoom
} from './constants';

/**
 * props:
 * 
 *      data: [{
 *          name: 图例名称,
 *          value: y轴数值,
 *          time: x轴时间值
 *      }], // 数组或封装后的frame
 *      height: 图表高度,
 *      configs: {
 *          slider: {
 *              start: 初始开始点,
 *              end: 初始结束点
 *          }
 *      },
 *      yAxis: 修改默认y轴值对应的键
 */
class TimeValueLineChart extends Component {
  constructor(props) {
    super(props);
    this.changeUnits = [{ units: ['mm', 'm'], ratio: [1, 1000] }, { units: ['kPa', 'MPa'], ratio: [1, 1000] }];
    this.series = null;
    this.seriesGraph = [];
    this.legendData = [];
    this.echartInstance = null;
    this.isThresholdLoaded = false;
    this.isOriginThresholdLoaded = false;
    this.xAxisStart = null
    this.state = {
      ratio: null,
      option: null,
      changedUnit: null,
      thresholds: null,
      stationName: '',
      thresholdStations: {},
      thresholdDisplay: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data, threshold } = nextProps;
    const { changedUnit, ratio, thresholdDisplay } = this.state;
    if (JSON.stringify(data) != JSON.stringify(this.props.data)) {
      this.series = this.setData(nextProps, changedUnit, ratio);
      this.setState({ option: this.getOption() })
    }
    if (!this.isOriginThresholdLoaded && thresholdDisplay) {
      this.setThresholdData(nextProps);
    }
  }


  setData = (props, changedUnit = null, ratio = null) => {
    let xAxisValue = props.xAxis || 'time';
    let yAxisValue = props.yAxis || 'value';
    let types = {
    };
    let data = JSON.parse(JSON.stringify(props.data));
    data.map(ii => {
      if (!types[ii.name]) {
        types[ii.name] = Object.assign({
          name: ii.name, data: []
        }, {
          type: 'bar',
          barMaxWidth: 30,
          smooth: false,
          showSymbol: false,
        });
      }
      if (changedUnit && ratio) {
        let dBitArr = ii[yAxisValue].toString().split(".")
        let bitNums = dBitArr[1] ? dBitArr[1].length : 0;
        ii[yAxisValue] = parseFloat((ii[yAxisValue] * ratio).toFixed(bitNums));
      }
      this.legendData.push(ii.name);
      types[ii.name].data.push({
        name: ii.time,
        value: [ii[xAxisValue], ii[yAxisValue]],
      });

      if (ii.time && !this.xAxisStart) {
        this.xAxisStart = ii.time;
      }
    });
    let series = [];
    for (let t in types) {
      series.push(types[t]);
    }
    return series;
  }

  setThresholdData = (props) => {

    this.isOriginThresholdLoaded = true;
    const { threshold, stations, itemName } = props;
    let data = [], seriesItem = {};
    if (stations) {
      stations.map(sId => {
        const thd = threshold[sId] && threshold[sId][itemName] ? threshold[sId][itemName] : null;
        if (thd && thd.length) {
          thd.map(ts => {
            const strThreshold = ts.value, level = ts.level;
            let thList = strThreshold.split(';');
            thList.map(th => {
              let numList = th.split(',');
              const min = numList[0].replace("(", "");
              const max = numList[1].replace(")", "");
              let dataItem = [], yStart = 0, min_ = min, max_ = max;

              if (max == '+') {
                max_ = Number(min) + 2
              } else if (min == '-') {
                min_ = Number(max) - 2;
              }
              yStart = (Number(max_) + Number(min_)) / 2;
              dataItem = [this.xAxisStart, yStart];
              data.push(dataItem);
            })
          })
        }
      })
      seriesItem = {
        type: 'custom',
        clip: true,
        data: data,
      }
      this.series.push(seriesItem);
    }
  }

  initEchartRef(e) {
    if (!e) return;
    const echartInstance = e.getEchartsInstance();
    if (echartInstance) {
      this.echartInstance = echartInstance;
      this.timer ? clearTimeout(this.timer) : null;
      const isDefault = true;

    }
  }

  UNSAFE_componentWillMount() {
    this.series = this.setData(this.props);
    this.setState({ option: this.getOption() })
  }
  getOption = (name) => {
    const that = this;
    const { configs } = this.props;
    const { changedUnit } = this.state;
    let option = {
      title: {
        text: name,
        top: 10, left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let result = '';
          if (that.props.xAxis == 'days') {
            params.forEach(function (item) {
              if (!result.length)
                result += item.seriesName;
              result += "</br>" + item.marker + item.name + '：' + item.data.value[1] + (changedUnit || configs.unit || '');
            })
          } else
            params.forEach(function (item) {
              if (!result.length)
                result += item.name;
              if (item.data.value && item.data.value.length) {
                result += "</br>" + item.marker + item.seriesName + '：' + item.data.value[1] + (changedUnit || configs.unit || '');
              }
            })
          return result;
        }
      },
      toolbox: { ...toolbox, right: 30 },
      // backgroundColor: DEFAULT_COLOR,
      color: color,
      legend: { ...legend.right, data: this.legendData },
      yAxis: {
        ...(configs.yAxis || {}),
        type: 'value',
        scale: true,
        splitLine: splitLine,
        axisLine: axisLine,
        axisTick: axisTick,
        axisLabel: {
          formatter: function (value, index) {
            if (configs && configs.unit) {
              return value + (changedUnit || configs.unit)
            } else {
              return value
            }
          }
        }

      },
      series: this.series,
      grid: { left: 80, right: 130 }
    }
    if (this.props.xAxis == 'days') {
      option.xAxis = {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: axisLine,
        axisTick: axisTick,
        axisLabel: {
          formatter: function (value, index) {
            return value + '天'
          }
        }
      };
    } else {
      option.xAxis = { ...xAxis.time, name: '时间' };
      option.xAxis.axisLabel = { ...option.xAxis.axisLabel, formatter: '{MM}-{dd} {HH}:{mm}' };
    }

    if (configs && configs.slider) {
      option["dataZoom"] = [{ ...dataZoom, ...configs.slider }, { ...configs.slider }];
    }
    this.setState({ option })
    return option;
  }

  render() {
    const { height } = this.props;

    return (
      <div style={{ position: 'relative', paddingTop: 20, marginBottom: 24 }}>
        <ReactEcharts
          ref={(e) => this.initEchartRef(e)}
          onChartReady={this.onChartReady}
          option={this.state.option}
          notMerge={true}
          lazyUpdate={true}
          onEvents={{ 'click': this.onChartClick, 'mouseover': this.onMouseOver }}
          style={{ height: height || '500px', margin: '0 auto' }} />

      </div>
    );
  }
}

export default TimeValueLineChart;