import React from 'react';
import Box from '../common/box';
import BarChart from "../charts/barChart"
import { reservoirType } from '../../constant';
function LeftTop(props) {
  const { structs } = props;
  const data = reservoirType.map(s => 0)
  reservoirType.forEach((v, index) => {
    let structFilter = structs.filter(x => x?.extraInfo?.reservoirType == v)
    data[index] += structFilter.length
  })

  return (
    <>
      <Box title="水库信息统计">
        <BarChart data={data} height={241} xAxis={reservoirType} />
      </Box>
    </>
  );
}

export default LeftTop;
