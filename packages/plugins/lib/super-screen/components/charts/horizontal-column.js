import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { tooltip } from './constants';
/**
 * props
 * height: 图表高度
 */

function HorizontalColumn(props) {
  const { data: { dataAxis, data } } = props;
  const getOption = () => {
    const option = {
      tooltip: {
        ...tooltip,
        trigger: 'item',
        formatter: '{b} : {c}次',
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          interval: 0,
          rotate: 0,
          color: '#FFFFFF',
          fontSize: 14,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        axisTick: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 133, 246, 1)',
            dashOffset: 10,
            type: 'dashed',
          },
          inside: true,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 133, 246, 1)',
          },
        },
        axisLabel: {
          color: '#FFFFFF',
          fontSize: 14,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(91, 180, 218, 0.1)',
          },
        },
      },
      grid: { // 控制图的大小，调整下面这些值就可以，
        x: '9%',
        x2: '9%',
        y: '16%',
        y2: '9%', // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      series: [
        {
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: 'rgba(76, 182, 255, 1)',
            fontSize: 16,
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(2, 52, 93, 0.3)',
              }, {
                offset: 1,
                color: 'rgba(3, 93, 170, 0.3)',
              }]),
            },
          },
          data,
        },
      ],
    };
    return option;
  };

  const { height, width } = props;
  const options = getOption();

  return (
    <ReactEcharts
      option={options}
      notMerge
      lazyUpdate
      style={{ height: height || '234px', margin: '0', width: width || 'auto' }}
    />
  );
}

export default HorizontalColumn;
