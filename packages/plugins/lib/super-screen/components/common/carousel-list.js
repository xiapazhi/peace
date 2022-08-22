/* 轮播列表组件 */
import React from 'react';
import ScrollBoard from './scrollBoard';
// import { ScrollBoard } from '@jiaminghi/data-view-react';
import NoData from './no-data';

function CarouselList(props) {
  const {
    header = [], data = [], rowNum = 4, height, columnWidth, multiellipsis, waitTime = 2000, ...restProps
  } = props;

  const config = {
    header,
    rowNum,
    headerBGC: 'rgba(12, 49, 110, 0.3)',
    oddRowBGC: 'transparent',
    evenRowBGC: 'transparent',
    headerHeight: 30,
    data,
    waitTime,
    columnWidth: columnWidth || [],
  };

  return data.length > 0 ? (
    <ScrollBoard
      config={config}
      style={{ height }}
      className={multiellipsis ? 'scroll-board-multi' : 'scroll-board'}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    />
  ) : <NoData />;
}

export default CarouselList;
