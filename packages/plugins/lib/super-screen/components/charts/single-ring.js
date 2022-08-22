import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { DEFAULT_COLOR } from './constants';

function SingleChart(props) {
  const {
    data, height, width,
  } = props;

  const option = {
    // 渐变色
    color: DEFAULT_COLOR,
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        // itemStyle: {
        //   // 环图间隙
        //   borderColor: '#0A1024',
        //   borderWidth: 3,
        // },
        label: {
          show: true,
          color: '#fff',
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
      style={{ height: height || 250, width: width || 'auto' }}
    />
  );
}

export default SingleChart;
