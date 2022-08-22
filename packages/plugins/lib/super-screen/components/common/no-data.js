/* 公共模块暂无数据组件 */
import React from 'react';
import { Empty } from 'antd';

function NoData({ height = 180 }) {
  return (
    <Empty
      image="/assets/images/screen/empty.png"
      imageStyle={{
        height,
      }}
      description={false}
    />
  );
}

export default NoData;
