import React from 'react';
import { FACTOR_CUSTOM_COMPONENTS } from './factor-custom/index';
function RealTimeChart(props) {
  const { struct, factorId, factorName, factorProto } = props;
  const renderFactorModule = () => {
    if (struct && struct.type && factorName && factorId) {
      const ComponentCustom = FACTOR_CUSTOM_COMPONENTS[struct.type.name] ? FACTOR_CUSTOM_COMPONENTS[struct.type.name][factorName]
        : FACTOR_CUSTOM_COMPONENTS[factorProto] ? FACTOR_CUSTOM_COMPONENTS[factorProto] : null;//1.判断是否有结构物类型下定制图表 2.是否有通用监测原型下定制图表
      if (ComponentCustom) {
        return <ComponentCustom key={factorName} {...props} />;
      }
      // 通用图表展示
      const GenericComponent = FACTOR_CUSTOM_COMPONENTS['generic'];
      return <GenericComponent {...props} />;
    }
    return <div className="no-data">暂无数据</div>;
  };

  return (
    <div className="factor-chart-container">
      {renderFactorModule()}
    </div>
  );
}

export default RealTimeChart;
