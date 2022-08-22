/* 公共模块容器框组件 */
import React from 'react';

function Box(props) {
  const {
    title = '', children, size = 'normal', subtitle = '', height, style = {},
  } = props;
  const realSize = ['normal', 'lengthen'].includes(size) ? size : 'normal';

  return (
    <div style={{ height, ...style }} className={`box-container box-${realSize}`}>
      <div className="box-title">
        <div className="text">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>

      {children}
    </div>

  );
}

export default Box;
