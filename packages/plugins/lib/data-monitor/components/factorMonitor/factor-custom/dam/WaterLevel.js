import React from 'react';
import CustomChart from '../generic-chart';

function WaterLevel(props) {
  const {
    data, struct, factorId, selectSensorId, factorName,
  } = props;

  let realData = '', key = null;
  if (data.stations && data.stations.find(s => s.id == selectSensorId)) {
    Object.keys(data.items).forEach(i => {
      if (!key) key = i;
    })
    let stationData = data.stations.find(s => s.id == selectSensorId).data;
    if (stationData.length > 0) {
      realData = stationData[stationData.length - 1][key]
    }
  }

  const hbgd = struct?.extraInfo?.hbgd ? parseFloat(struct?.extraInfo?.hbgd) : 0;
  const customPoolLevel = struct?.extraInfo?.customPoolLevel ? parseFloat(struct?.extraInfo?.customPoolLevel) : 0
  const xxsw = struct?.extraInfo?.xxsw ? parseFloat(struct?.extraInfo?.xxsw) : 0
  const designFloodLevel = struct?.extraInfo?.designFloodLevel ? parseFloat(struct?.extraInfo?.designFloodLevel) : 0
  const jhhsw = struct?.extraInfo?.jhhsw ? parseFloat(struct?.extraInfo?.jhhsw) : 0
  return (
    <div>
      <div className="btn-container">
        <div className="btn-item blue">实时水位：{realData}{key && data?.items[key] ? data?.items[key]?.unit : ''}</div>
        <div className="btn-item blue">库容：</div>
      </div>
      <div className="btn-container">
        <div className="btn-item blue-dark">
          正常蓄水位：
          {customPoolLevel + hbgd}
        </div>
        <div className="btn-item yellow">
          汛限水位：
          {xxsw + hbgd}
        </div>
        <div className="btn-item orange">
          设计洪水位：
          {designFloodLevel + hbgd}
        </div>
        <div className="btn-item red">
          校核洪水位：
          {jhhsw + hbgd}
        </div>
      </div>
      <CustomChart {...props} />
    </div>
  );
}

export default WaterLevel;
