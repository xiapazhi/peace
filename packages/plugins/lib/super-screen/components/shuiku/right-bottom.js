import React, { useState, useEffect } from 'react';
import Box from '../common/box';
import GeneraLine from '../charts/genera-line';
import ColumnChart from '../charts/genetal-column'
import { Select } from 'antd';
import { connect } from 'react-redux';
import NoData from '../common/no-data';
const { Option } = Select;
import { useFsRequest, ApiTable } from '$utils';
import { damFactors } from '../../constant';
import moment from 'moment';

const { waterLevelFactorName, rainFactorName } = damFactors

function RightBottom(props) {
  const { structs, dispatch, actions, myStationList } = props;
  const [tab, setTab] = useState('water')
  const [struct, setStruct] = useState(null);
  const [stationId, setStationId] = useState(null);
  const onStructChange = (value) => {
    setStruct(value)
  }

  const {
    data: themeData = []
  } = useFsRequest({
    url: ApiTable.getStationData,
    query: {
      begin: moment().startOf('month').valueOf(),
      end: moment().valueOf(),
      stations: stationId,
      orderDirection: 'DESC'
    },
    refreshDeps: [stationId],
    ready: !!(stationId)
  });

  useEffect(() => {
    let stationIdTemp = null;
    if (myStationList.length > 0) {
      if (tab == 'water') {
        const station = myStationList.find(x => x.factorName == waterLevelFactorName)
        if (station && station?.groups?.length > 0 && station?.groups[0]?.stations.length > 0) {
          stationIdTemp = station?.groups[0]?.stations[0]?.id;
        }
      } else if (tab == 'rain') {
        const station = myStationList.find(x => x.factorName == rainFactorName)
        if (station && station?.groups?.length > 0 && station?.groups[0]?.stations.length > 0) {
          stationIdTemp = station?.groups[0]?.stations[0]?.id;
        }
      }
    }
    setStationId(stationIdTemp)
  }, [myStationList, tab])

  useEffect(() => {
    if (!struct && structs.length > 0) {
      const structId = structs[0]?.id
      setStruct(structId);
    }
  }, [structs])

  useEffect(() => {
    if (struct) {
      dispatch(actions.dataMonitor.getStations(struct));
    }
  }, [struct])


  const renderSubtitle = () => {
    return <>
      <Select
        className='gis-search-select'
        dropdownClassName='super-dropdownClassName'
        style={{ width: 120, height: 24 }}
        showSearch={false}
        optionFilterProp="children"
        onChange={onStructChange}
        value={struct}
        key={Math.random()}
      >
        {structs.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
      </Select>
    </>
  }

  let waterData = { xAxis: [], water: [], designFloodLevel: null, hbgd: null }
  let rainData = { xAxis: [], data: [], designFloodLevel: null }
  if (themeData.length > 0 && themeData[0].stations?.length > 0) {
    themeData[0].stations[0].data.sort((a, b) => moment(b.time) - moment(a.time)).map((s, index) => {
      let structureInfo = structs.find(s => s.id == struct);
      if (index < 12 && structureInfo?.extraInfo) {//取最新12条数据
        if (themeData[0]?.name == waterLevelFactorName) {
          waterData.xAxis.push(moment(s.time).format('HH:mm'))
          waterData.water.push(s?.values?.waterLevel)
          const { designFloodLevel, hbgd } = structureInfo?.extraInfo
          if (designFloodLevel && !isNaN(parseFloat(designFloodLevel)) && hbgd && !isNaN(parseFloat(hbgd))) {
            waterData.designFloodLevel = parseFloat(designFloodLevel) + parseFloat(hbgd)
            waterData.hbgd = parseFloat(hbgd)
          }
        } else if (themeData[0]?.name == rainFactorName) {
          rainData.xAxis.push(moment(s.time).format('HH:mm'))
          rainData.data.push(s?.values?.rainfall)
        }
      }
    })
  }

  return (
    <Box title="雨水情监测" subtitle={renderSubtitle()}>
      <div style={{ paddingTop: 5, paddingRight: 20 }}>
        <div className='rain-water'>
          <div onClick={() => setTab('water')} className={tab == 'water' ? 'active' : 'inactive'}>水位监测</div>
          <div onClick={() => setTab('rain')} className={tab == 'rain' ? 'active' : 'inactive'}>雨量监测</div>
        </div>
        {
          stationId ? tab == 'water' ? waterData.xAxis.length > 0 ?
            <GeneraLine
              DOMID='shuiku-water-line'
              xAxis={waterData.xAxis} water={waterData.water}
              designFloodLevel={waterData.designFloodLevel}
              hbgd={waterData.hbgd}
              height={240}
            /> : <NoData />
            :
            rainData.data.length > 0 ? <ColumnChart
              DOMID='shuiku-rain-column'
              xAxis={rainData.xAxis}
              data={rainData.data}
              height={240} /> : <NoData />
            : <NoData />
        }
      </div>
    </Box>
  );
}


function mapStateToProps(state) {
  const { auth, global, myStructList, myStationList } = state;
  return {
    loading: myStructList.isRequesting || myStationList.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    myStationList: myStationList.data || []
  };
}

export default connect(mapStateToProps)(RightBottom);
