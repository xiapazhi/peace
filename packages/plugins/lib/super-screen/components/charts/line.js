import React from 'react';
import ReactEcharts from 'echarts-for-react';
// import * as echarts from 'echarts';
import { tooltip, COMMON_COLOR, DEFAULT_AREA_COLOR } from './constants';

function LineChart({ ...props }) {
  const {
    width, height, data, yAxisName, lineColor, yAxisColor, noAreaStyle, noStack, xAxisType,
  } = props;

  const options = {
    backgroundColor: 'transparent',
    legend: {
      right: '5%',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '20%',
      bottom: '16%',
      containLabel: true,
    },
    tooltip: {
      show: true,
      trigger: 'item',
      ...tooltip,
    },

    xAxis: [
      {
        type: xAxisType || 'category',
        axisLabel: {
          color: COMMON_COLOR.labelColor,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: COMMON_COLOR.lineColor,
            width: 2,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#195384',
          },
        },
        data: data.xAxisData,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: yAxisName || '',
        nameTextStyle: {
          color: yAxisColor || COMMON_COLOR.axisLineColor,
        },
        axisLabel: {
          formatter: '{value}',
          color: COMMON_COLOR.labelColor,
        },
        axisLine: {
          lineStyle: {
            color: COMMON_COLOR.axisLineColor,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: COMMON_COLOR.splitLineColor,
          },
        },
      },

    ],
    color: lineColor || DEFAULT_AREA_COLOR,
    series: data.seriesData.map((item, index) => ({
      name: item.name,
      type: 'line',
      stack: noStack ? null : '总量',
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        shadowBlur: 20,
      },
      areaStyle: noAreaStyle ? null : {
        color: DEFAULT_AREA_COLOR[index],
      },
      lineStyle: {
        width: 2,
      },
      emphasis: {
        focus: 'series',
      },
      data: item.data || [],
      markLine: item.markLine || null,
    })),

  };

  return (
    <ReactEcharts
      option={options}
      notMerge
      lazyUpdate
      style={{ height: height || '300px', width: width || 'auto' }}
    />
  );
}

export default LineChart;
