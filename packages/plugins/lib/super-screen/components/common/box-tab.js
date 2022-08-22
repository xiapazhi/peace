/* 公共模块容器框subtitle tab切换组件 */
import React, { useState } from 'react';

function BoxTab(props) {
  const {
    tabs = [], onTabChage, defaultKey,
  } = props;
  const [key, setKey] = useState(defaultKey || tabs[0]?.key || null);

  const onTabClick = (k) => {
    setKey(k);
    onTabChage && onTabChage(k);
  };

  return (
    <div className="flex-row time-select">
      {
        tabs.map((v) => (
          <div key={v.key} aria-hidden className={v.key === key ? 'time-select-on' : 'time-select-off'} onClick={() => onTabClick(v.key)}>{v.value}</div>
        ))
      }
    </div>

  );
}

export default BoxTab;
