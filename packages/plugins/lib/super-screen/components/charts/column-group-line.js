import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { tooltip, YAXIS_BLUE } from './constants';
/**
 * props
 * dataAxis x轴数据
 * data y轴数据{dataSource:{},xAxisData:[]}
 * height: 图表高度
 */

function ColumnGroupLine(props) {
  const { data: { dataSource, xAxisData }, leftUnit = 'ppm', rightUnit = '个' } = props;
  const series = Object.keys(dataSource).map((key) => {
    const rs = {
      name: key,
      type: dataSource[key].type,
      barGap: 1,
      yAxisIndex: dataSource[key].type === 'bar' ? 0 : 1,
      itemStyle: {
        normal: {
          // 柱形图圆角，初始化效果
          barBorderRadius: [2, 2, 0, 0],
        },
      },
      barWidth: 4, // 柱图宽度
      data: dataSource[key].data,
    };
    return rs;
  });

  const getOption = () => {
    const option = {
      color: ['rgba(38, 168, 255, 1)', 'rgba(37, 250, 229, 1)', 'rgba(254, 186, 40, 1)', 'rgba(0, 60, 255, 1)'],
      xAxis: {
        data: xAxisData,
        type: 'category',
        boundaryGap: ['10%', '10%'],
        axisLabel: {
          // interval: 0,
          // rotate: 0,
          color: '#FFFFFF',
          fontSize: 14,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(13, 72, 146, 1)',
          },
        },
      },
      yAxis: [
        {
          name: leftUnit,
          type: 'value',
          position: 'left',
          ...YAXIS_BLUE,
        },
        {
          name: rightUnit,
          position: 'right',
          type: 'value',
          ...YAXIS_BLUE,
        },
      ],
      grid: { // 控制图的大小，调整下面这些值就可以，
        x: '10%',
        x2: '10%',
        y2: '15%', // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
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
      style={{
        height: height || '234px', margin: '0', width: width || 'auto',
      }}
    />
  );
}

export default ColumnGroupLine;
