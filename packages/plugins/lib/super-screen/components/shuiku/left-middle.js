import React, { useState, useMemo } from 'react';
import Box from '../common/box';
import HorizontalPercent from '../charts/hon-percent'
import { damType } from '../../constant';
function LeftMiddle(props) {
  const { structs } = props;
  const data = damType.map(s => 0)
  damType.forEach((v, index) => {
    let structFilter = structs.filter(x => x?.extraInfo?.damType == v)
    data[index] += structFilter.length
  })

  return (
    <Box title="大坝信息统计" >
      <HorizontalPercent
        chartdata={[
          data,
          damType,
        ]}
      />
    </Box>
  );
}

export default LeftMiddle;
