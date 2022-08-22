import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { tooltip } from './constants';
/**
 * props
 * dataAxis x轴数据
 * data y轴数据{name1:[],name2:[],name3:[],...}
 * height: 图表高度
 */

function ColumnGroup(props) {
  const { data: { dataAxis, data } } = props;
  const series = Object.keys(data).map((key) => {
    const rs = {
      name: key,
      type: 'bar',
      barGap: 0,
      itemStyle: {
        normal: {
          // 柱形图圆角，初始化效果
          barBorderRadius: [5, 5, 0, 0],
        },
      },
      barWidth: 10, // 柱图宽度
      showBackground: true,
      backgroundStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(2, 52, 93, 0.3)',
        }, {
          offset: 1,
          color: 'rgba(3, 93, 170, 0.3)',
        }]),
      },
      data: data[key],
    };
    return rs;
  });

  const getOption = () => {
    const option = {
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
      dataZoom: [
        {
          type: 'slider',
          show: true,
          height: 14,
          bottom: 10,
          borderColor: 'transparent',
          backgroundColor: 'rgba(4, 59, 153, 1)',
          // 拖拽手柄样式 svg 路径
          // handleIcon: 'M512 512m-208 0a6.5 6.5 0 1 0 416 0 6.5 6.5 0 1 0-416 0Z M512 192C335.264 192 192 335.264 192 512c0 176.736 143.264 320 320 320s320-143.264 320-320C832 335.264 688.736 192 512 192zM512 800c-159.072 0-288-128.928-288-288 0-159.072 128.928-288 288-288s288 128.928 288 288C800 671.072 671.072 800 512 800z',
          handleColor: 'rgba(4, 59, 153, 1)',
          handleSize: 20,
          showDetail: false,
          handleStyle: {
            borderColor: 'rgba(4, 59, 153, 1)',
            shadowBlur: 4,
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowColor: '#e5e5e5',
          },
          startValue: dataAxis[0],
          endValue: dataAxis[2],
        },
      ],
      legend: {
        textStyle: { color: '#fff' },
        right: '5%',
      },
      tooltip: {
        trigger: 'axis',
        ...tooltip,
      },
      series,
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

export default ColumnGroup;
