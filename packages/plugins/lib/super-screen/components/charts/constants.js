export const RING_COLORS = [
  { linearGradientTo: 'rgba(2, 14, 35, 1)', linearGradientFrom: 'rgba(23, 106, 231, 1)' },
  { linearGradientTo: 'rgba(50, 40, 2, 1)', linearGradientFrom: 'rgba(255, 175, 0, 1)' },
  { linearGradientTo: 'rgba(2, 71, 119, 1)', linearGradientFrom: 'rgba(0, 169, 255, 1)' },
  { linearGradientTo: 'rgba(3, 56, 26, 1)', linearGradientFrom: 'rgba(0, 255, 110, 1)' },
  { linearGradientTo: 'rgba(0, 48, 64, 1)', linearGradientFrom: 'rgba(0, 227, 255, 1)' },
  { linearGradientTo: 'rgba(57, 2, 4, 1)', linearGradientFrom: 'rgba(254, 142, 145, 1)' },
];

export const tooltip = {
  backgroundColor: 'rgba(3, 65, 118, 0.8)',
  borderColor: 'rgba(3, 65, 118, 0.8)',
  textStyle: {
    color: '#fff',
  },
};

export const COMMON_COLOR = {
  lineColor: '#2F5384',
  labelColor: '#fff',
  axisLineColor: '#0D4892',
  splitLineColor: '#0D4892',
};

const getAreaColor = (color) => ({
  fromColor: color.replace('1)', '0.2)'),
  toColor: color.replace('1)', '0.9)'),
});
export const DEFAULT_COLOR = ['rgba(24, 108, 236, 1)', 'rgba(10, 207, 231, 1)', 'rgba(255, 206, 101, 1)', 'rgba(255, 143, 145, 1)', 'rgba(0, 168, 251, 1)', 'rgba(7, 246, 109, 1)', 'rgba(246, 136, 7, 1)'];

export const DEFAULT_AREA_COLOR = DEFAULT_COLOR.map((color) => ({
  type: 'linear',
  x: 0,
  y: 1,
  x2: 0,
  y2: 0,
  colorStops: [{
    offset: 0, color: getAreaColor(color).fromColor, // 0% 处的颜色
  }, {
    offset: 1, color: getAreaColor(color).toColor, // 100% 处的颜色
  }],
  global: false, // 缺省为 false
}));

export const YAXIS_BLUE = {
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
  nameTextStyle: {
    color: '#FFFFFF',
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
};
export default {
  RING_COLORS, tooltip, COMMON_COLOR, DEFAULT_COLOR, DEFAULT_AREA_COLOR, YAXIS_BLUE,
};
