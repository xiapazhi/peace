import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { RING_COLORS, tooltip } from './constants';
/**
 * props
 * height: 图表高度
 */

function RingChart(props) {
  const { data } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const colors = props.colors || RING_COLORS;
  let max = data.reduce((pre, cur) => pre + cur.value, 0);
  const getOption = () => {
    const option = {
      title: {
        text: max,
        subtext: '告警总数',
        textStyle: {
          color: "#f2f2f2",
          fontSize: 24,
          align: "center",
          fontFamily: 'YouSheBiaoTiHei'
        },
        subtextStyle: {
          fontSize: 15,
          color: ["#FFFFFF"],
        },
        x: "center",
        y: "center",
        top: '60',
      },
      tooltip: {
        ...tooltip,
        trigger: 'item',
        formatter: '{b} : {c}次 ({d}%)',
        position: ['10%', '40%'],
      },
      // 渐变色
      color: colors.map((s) => {
        const cs = new echarts.graphic.LinearGradient(1, 1, 0, 0, [
          { offset: 0, color: s.linearGradientFrom },
          { offset: 0.9, color: s.linearGradientTo },
        ]);
        return cs;
      }),

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

    return option;
  };
  const { height, width } = props;
  const options = getOption();
  const values = data.map((s) => s.value);
  const sum = values.reduce((m, n) => m + n);
  const renderList = () => data.map((s, index) => {
    const rate = Math.round((s.value / sum) * 100) || 0;
    return (
      <div key={s.name || index} className="device-alarm-item">
        <div className="dot" style={{ background: `linear-gradient(16deg, ${colors[index].linearGradientFrom} 0%, ${colors[index].linearGradientTo} 100%)` }} />
        <span>{s.name}</span>
        <span>
          <span className="count" style={{ color: '#fff' }}>{s.value}</span>
          <span>占比</span><span className="count" style={{ color: colors[index].linearGradientFrom }}>{rate}</span>%
        </span>
      </div>
    );
  });

  return (
    data && data.length > 0
      ? (
        <div className="flex-row">
          <div className="device-alarm-left">
            <ReactEcharts
              option={options}
              notMerge
              lazyUpdate
              style={{ height: height || '174px', margin: '0', width: width || 'auto' }}
            />
          </div>
          <div className="device-alarm-right">
            {renderList()}
          </div>
        </div>
      )
      : '暂无数据'
  );
}

export default RingChart;
