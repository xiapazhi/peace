/**
 * Created by PengLing on 2018/10/18.
 * 说明：
 *      重要并且必须声明的步骤，代码中使用 // !!! 这种格式的注释标注
 */

import React, { Component } from 'react';
import { Button } from 'antd';
// import G2 from '@antv/g2';
// import { DataSet } from '@antv/data-set';
// import Slider from '@antv/g2-plugin-slider';
import moment from 'moment';

class SliderChartTimeLine extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.colors = { red: '#F5222D', black: '#404040' };
  }

  // renderChart = () => {
  //     const { container, configs, data, alarmThreshold, timeRange, valueRange } = this.props;
  //     // !!! 创建 DataSet，并设置状态量 start end
  //     const ds = new DataSet({
  //         state: {
  //             start: timeRange.start,
  //             end: timeRange.end
  //         }
  //     });
  //     // !!! 通过 ds 创建 DataView
  //     const dv = ds.createView();
  //     dv.source(data).transform({ // !!! 根据状态量设置数据过滤规则，
  //         type: 'filter',
  //         callback: obj => {
  //             return obj.time <= ds.state.end && obj.time >= ds.state.start;
  //         }
  //     });

  //     const chart = new G2.Chart({
  //         container: container,
  //         height: configs.height || 300,
  //         padding: configs.padding || [20, 30, 20, 30],
  //         forceFit: true,
  //         animate: false
  //     });

  //     chart.source(dv, { // !!! 注意数据源是 ds 创建 DataView 对象
  //         'time': {
  //             alias: '时间',
  //             type: 'time',
  //             mask: 'YYYY年MM月DD日HH时',
  //             nice: false
  //         },
  //         'value': {
  //             formatter: val => `${val}分`
  //         }
  //     });

  //     let geom = chart.line();

  //     geom.position('time*value').color('name', [this.colors.black]).shape('line').size(1.5);

  //     geom.tooltip('time*value*extras', (time, value, extras) => {
  //         return { time, value, ...extras };
  //     });

  //     chart.tooltip({
  //         containerTpl: '<div class="g2-tooltip">'
  //             + '<p class="g2-tooltip-title"></p>'
  //             + '<div class="g2-tooltip-list"></div>'
  //             + '</div>', // tooltip的外层模板
  //         itemTpl: '<div class="g2-tooltip-list-item">'
  //             + '<p>结构物得分：{value}</p>'
  //             + `<p>平台告警指标得分：{platformAlarm}分</p>`
  //             + `<p>地震指标得分：{earthquake}分</p>`
  //             + `<p>暴雨指标得分：{rainstorm}分</p>`
  //             //+ `<p>降雨量指标得分：{rainfall}分</p>`
  //             + '</div>', // 支持的字段 index,color,name,title,value
  //         offset: 50,
  //         'g2-tooltip': {
  //             position: 'absolute',
  //             visibility: 'hidden',
  //             opacity: '0.8'
  //         }, // 设置 tooltip 的 css 样式
  //         'g2-tooltip-list': {
  //             margin: '10px'
  //         }
  //     });

  //     chart.guide().line({
  //         top: true,
  //         start: ['min', alarmThreshold],
  //         end: ['max', alarmThreshold],
  //         lineStyle: {
  //             stroke: this.colors.red,
  //             lineWidth: 1
  //         },
  //         text: {
  //             content: alarmThreshold,
  //             position: 'end',
  //             offsetX: 20,
  //             offsetY: 10,
  //             style: {
  //                 fontSize: 14,
  //                 fill: this.colors.red,
  //                 opacity: 0.5
  //             }
  //         }
  //     });

  //     chart.guide().regionFilter({
  //         top: true,
  //         start: ['min', alarmThreshold],
  //         end: ['max', valueRange.max < 100 ? 100 : valueRange.max],
  //         color: this.colors.red,
  //         apply: ['line']
  //     });

  //     chart.render();

  //     let sliderCfg = configs.slider;
  //     if (sliderCfg) {
  //         // !!! 创建 slider 对象
  //         const slider = new Slider({
  //             container: sliderCfg.container,
  //             height: 30,
  //             padding: configs.padding || [20, 30, 20, 30],
  //             start: timeRange.start,
  //             end: timeRange.end,
  //             data: this.props.data || [], // !!! 注意是原始数据，不要传入 dv
  //             xAxis: 'time', // 背景图的横轴对应字段，同时为数据筛选的字段
  //             yAxis: 'value', // 背景图的纵轴对应字段
  //             scales: {
  //                 'time': {
  //                     alias: '时间',
  //                     type: 'time',
  //                     mask: 'YYYY年MM月DD日HH时',
  //                     nice: false
  //                 }
  //             },
  //             handleStyle: { width: 10 },
  //             onChange: ({ startValue, endValue }) => {
  //                 // !!! 更新状态量
  //                 ds.setState('start', moment(startValue).toISOString());
  //                 ds.setState('end', moment(endValue).toISOString());
  //             }
  //         });
  //         slider.render();
  //     }

  //     this.chart = chart;
  // };

  download = () => {
    const _this = this;
    setTimeout(() => {
      _this.chart.downloadImage(_this.props.configs.exporter.image.name);
    }, 500);
  };

  componentDidMount() {
    // this.renderChart();
  }

  render() {
    const { container, configs } = this.props;
    const sliderCfg = configs.slider;
    return (
      <div style={{ position: 'relative', paddingTop: 20, marginBottom: 24 }}>
        <div style={{
          position: 'absolute', right: '20px', top: '20px', zIndex: 2,
        }}
        >
          <Button onClick={this.download} size="default">导出</Button>
        </div>
        <div id={container} />
        {sliderCfg ? <div id={sliderCfg.container} /> : null}
      </div>
    );
  }
}

export default SliderChartTimeLine;
