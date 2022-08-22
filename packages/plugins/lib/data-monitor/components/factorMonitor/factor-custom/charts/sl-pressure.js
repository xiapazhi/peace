import React, { Component } from 'react';
import * as echarts from 'echarts';

class SlPressureChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartHeight: null,
      chartWidth: null,
    };
  }

  componentDidMount() {
    const {
      height, xAxisData, seriesData, DOMID, unit,
    } = this.props;

    this.setState({ chartHeight: height }, () => {
      this.createCharts(xAxisData, seriesData, DOMID, unit);
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      height, xAxisData, seriesData, DOMID, unit, width,
    } = nextProps;
    if (JSON.stringify(nextProps) != JSON.stringify(this.props)) {
      this.setState({ chartHeight: height, chartWidth: width }, () => {
        this.createCharts(xAxisData, seriesData, DOMID, unit);
      });
    }
  }

  createCharts = (xAxisData, seriesData, DOMID, unit) => {
    this.clearEchart();
    const chartDom = document.getElementById(DOMID);
    this.chart = echarts.init(chartDom);
    const option = this.getOption(xAxisData, seriesData, DOMID, unit);
    this.chart.setOption(option);
  };

  clearEchart = () => {
    if (this.chart) {
      this.chart.dispose();
    }
  };

  getOption = (xAxisData, seriesData, DOMID, unit) => {
    const { slData, waterLevel, struct: { extraInfo: { damHeight, designFloodLevel, ssw } } } = this.props;
    // const waterLevel = 0.8;
    const grids = this.props.grids || ['3%', '3%', '3%', '3%'];
    const reservoirLength = this.props.struct?.extraInfo?.reservoirLength && !isNaN(this.props.struct?.extraInfo?.reservoirLength) ? this.props.struct?.extraInfo?.reservoirLength / 2 : 0;
    const damTop = this.props.struct?.extraInfo?.damTop && !isNaN(this.props.struct?.extraInfo?.damTop) ? this.props.struct?.extraInfo?.damTop / 2 : 0;
    const jhhsw = this.props.struct?.extraInfo?.jhhsw && !isNaN(this.props.struct?.extraInfo?.jhhsw) ? this.props.struct?.extraInfo?.jhhsw : 0;
    const hbgd = this.props.struct?.extraInfo?.hbgd && !isNaN(this.props.struct?.extraInfo?.hbgd) ? this.props.struct?.extraInfo?.hbgd : 0;
    let series = [];

    // 坝体
    const wRate = (parseFloat(reservoirLength) - damTop) / parseFloat(damHeight);
    const xpWidth = 1.7;// 斜坡破面高度
    const data = [
      [parseFloat(reservoirLength), parseFloat(hbgd)],
      [-parseFloat(reservoirLength), parseFloat(hbgd)],
      [-damTop, parseFloat(damHeight) + parseFloat(hbgd)],
      [damTop, parseFloat(damHeight) + parseFloat(hbgd)],
      [((parseFloat(reservoirLength) - parseFloat(xpWidth) * wRate)), parseFloat(xpWidth) + parseFloat(hbgd)],
      [((parseFloat(reservoirLength) - parseFloat(xpWidth) * wRate) + 5), parseFloat(xpWidth) + parseFloat(hbgd)],
    ];
    series.push({
      type: 'custom',
      renderItem(params, api) {
        if (params.context.rendered) {
          return;
        }
        params.context.rendered = true;
        const points = [];
        for (let i = 0; i < data.length; i++) {
          points.push(api.coord(data[i]));
        }
        const color = api.visual('color');
        return {
          type: 'polygon',
          transition: ['shape'],
          shape: {
            points,
          },
          style: api.style({
            fill: '#8c8c8c',
            stroke: '#8c8c8c',
          }),
        };
      },
      clip: true,
      data,
      animation: false,
      tooltip: { show: false },
    }, // 大坝
    );

    // 设计洪水位
    if (designFloodLevel && !isNaN(parseFloat(designFloodLevel))) {
      series.push(
        {
          data: [[-parseFloat(reservoirLength), parseFloat(designFloodLevel) + parseFloat(hbgd)],
          [-((parseFloat(reservoirLength) - parseFloat(designFloodLevel) * wRate)), parseFloat(designFloodLevel) + parseFloat(hbgd)]],
          type: 'line',
          smooth: true,
          label: {
            show: true,
            color: '#fa541c',
            formatter(params) {
              // 假设此轴的 type 为 'time'。
              return `设计洪水位:${params.data[1]}`;
            },

          },
          animation: false,
          tooltip: { show: false },
        },
      );
    }

    // 校核洪水位
    if (jhhsw && !isNaN(parseFloat(jhhsw))) {
      series.push(
        {
          data: [[-parseFloat(reservoirLength), parseFloat(jhhsw) + parseFloat(hbgd)],
          [-((parseFloat(reservoirLength) - parseFloat(jhhsw) * wRate)), parseFloat(jhhsw) + parseFloat(hbgd)]],
          type: 'line',
          smooth: true,
          label: {
            show: true,
            color: '#ff4d4f',
            formatter(params) {
              // 假设此轴的 type 为 'time'。
              return `校核洪水位:${params.data[1]}`;
            },
          },
          animation: false,
          tooltip: { show: false },
        },
      );
    }

    // 死水位
    if (ssw && !isNaN(parseFloat(ssw))) {
      series.push(
        {
          data: [[-parseFloat(reservoirLength), parseFloat(ssw) + parseFloat(hbgd)],
          [-((parseFloat(reservoirLength) - parseFloat(ssw) * wRate)), parseFloat(ssw) + parseFloat(hbgd)]],
          type: 'line',
          smooth: true,
          endLabel: {
            show: true,
            color: '#cf1322',
            formatter(params) {
              return `死水位:${params.data[1]}`;
            },

          },
          animation: false,
          tooltip: { show: false },
        },
      );
    }

    // 水位面积 水位线
    const barWidth = parseFloat(reservoirLength);
    const waterPoint = [];
    if (waterLevel && waterLevel > 0 && waterLevel > parseFloat(hbgd) && parseFloat(hbgd) < (parseFloat(hbgd) + parseFloat(damHeight))) {
      waterPoint.push([-(barWidth - (waterLevel - parseFloat(hbgd)) * wRate), waterLevel]);
      const data2 = [
        [-barWidth, parseFloat(hbgd)],
        [-barWidth, waterLevel],
        [-(barWidth - (waterLevel - parseFloat(hbgd)) * wRate), waterLevel],
      ];
      series = series.concat([{
        type: 'custom',
        renderItem(params, api) {
          if (params.context.rendered) {
            return;
          }
          params.context.rendered = true;
          const points = [];
          for (let i = 0; i < data2.length; i++) {
            points.push(api.coord(data2[i]));
          }
          const color = api.visual('color');
          return {
            type: 'polygon',
            transition: ['shape'],
            shape: {
              points,
            },
            style: api.style({
              fill: color,
              stroke: echarts.color.lift(color, 0.1),
            }),
          };
        },
        clip: true,
        data: data2,
        animation: false,
        tooltip: { show: false },
      }, // 水位
      {
        data: [[-barWidth, waterLevel], [-(barWidth - (waterLevel - parseFloat(hbgd)) * wRate), waterLevel]],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#1890ff',
        },
        animation: false,
        tooltip: {
          trigger: 'item',
          formatter: `水位:${waterLevel}M`,
        },
      }]);
    }

    if (slData.length > 0) {
      // 渗流点位横坐标和坝体连接柱状
      const hRate = parseFloat(damHeight) / (parseFloat(reservoirLength) - damTop);
      slData.map((s, index) => {
        const xYxis = Math.abs((parseFloat(reservoirLength) - s.data[0]) * hRate);
        const dataV = [
          // [parseFloat(hbgd), s[1]],
          [s.data[0], xYxis + parseFloat(hbgd)]];
        series.push(
          {
            data: dataV,
            type: 'bar',
            stack: index > 0 ? 'tow' : 'one',
            animation: false,
            tooltip: { show: false },
            barWidth: 10,
            itemStyle: {
              color: '#AFAFAF',
              normal: {
                // 这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
                barBorderRadius: [2, 2, 2, 2],
                color: '#AFAFAF',
              },
            },
          },
        );
        series.push(
          {
            data: [s.data],
            type: 'bar',
            stack: index > 0 ? 'tow' : 'one',
            animation: false,
            tooltip: { show: true },
            name: s.stationName,
            barWidth: 10,
            itemStyle: {
              color: '#10B3FF',
              normal: {
                // 这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
                barBorderRadius: [2, 2, 2, 2],
                color: '#10B3FF',
              },
            },
          },
        );
      });

      // 水位点渗流点连接线
      const slLineData = waterPoint.concat(slData.sort((a, b) => a.data[0] - b.data[0]).map((v) => v.data));
      series.push(
        {
          data: slLineData,
          type: 'line',
          smooth: true,
          animation: false,
          tooltip: { show: false },
          label: {
            show: true,
            color: '#096dd9',
            formatter(params) {
              return params.data[1].toFixed(1);
            },
          },
        },
      );
    }

    const option = {
      backgroundColor: 'transparent',
      title: {
        left: 'left',
        text: this.props.title || '',
        padding: [5, 0, 0, 55],
        textStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
          fontSize: 16,
          fontWeight: 400,
        },
      },
      tooltip: {

      },
      color: this.props.colors || ['#2F53EA', 'rgba(0,221,150)', 'rgba(44,228,255)'], // 蓝 绿 青
      toolbox: {
        feature: {
          saveAsImage: { title: '下载' },
        },
        right: '0%',
        top: -10,
      },
      grid: {
        top: grids[0],
        right: grids[1],
        bottom: grids[2],
        left: grids[3],
        containLabel: true,
        // borderColor: '#f0f0f0',
      },
      xAxis: { min: -parseFloat(reservoirLength), max: parseFloat(reservoirLength) },
      yAxis: {
        max: damHeight && !isNaN(parseFloat(damHeight)) && parseFloat(damHeight) + parseFloat(hbgd) + parseFloat(damHeight) / 2,
        min: parseFloat(hbgd),
      },
      series,
    };
    return option;
  };

  render() {
    const { chartHeight, chartWidth } = this.state;
    return <div id={this.props.DOMID} style={{ height: chartHeight, width: chartWidth || this.props.width }} />;
  }
}

export default SlPressureChart;
