/* 轮播排名统计列表组件 */
import React, { useState, useEffect } from 'react';
import { ScrollRankingBoard } from '@jiaminghi/data-view-react';

function ScrollRankList(props) {
  const {
    data = [], rowNum = 4, style = {}, hideRank, sort = false, unit = '',
  } = props;

  const config = {
    rowNum,
    data,
    sort,
    unit,
  };
  return (
    <ScrollRankingBoard
      config={config}
      className={`scroll-rank-list ${hideRank && 'hide-rank'}`}
      style={style}
    />

  );
}

export default ScrollRankList;
