import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { DEFAULT_COLOR } from './constants';

function CircleChart(props) {
  const {
    data, height, width, image = {},
  } = props;

  const option = {
    // 渐变色
    color: DEFAULT_COLOR,
    graphic: {
      type: 'image',
      style: {
        image: image.url,
        width: image.width,
        height: image.height,
      },
      left: 'center',
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['66%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          // 环图间隙
          borderColor: '#0A1024',
          borderWidth: 3,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };

  return (
    <ReactEcharts
      option={option}
      notMerge
      lazyUpdate
      style={{ height: height || 150, width: width || 'auto' }}
    />
  );
}

export default CircleChart;
