import { OsmoticPressure, WaterLevel, BarRain, } from './dam';
import CustomChart from './generic-chart';

export const FACTOR_CUSTOM_COMPONENTS = {
  "大坝": {
    "渗流压力监测": OsmoticPressure,
    "自动库水位监测": WaterLevel,
    "自动雨量监测": BarRain,
  },
  // 1003: BarRain, //雨量原型
  generic: CustomChart,//通用图表
}
