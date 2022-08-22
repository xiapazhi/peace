import React, { useState, useEffect, useMemo } from 'react';
import Box from '../common/box';
import CarouselList from '../common/carousel-list';
import { Select } from 'antd';
import { connect } from 'react-redux';
const { Option } = Select;

function RightTop(props) {
  const { structs, actions, dispatch, devices, deviceListAlarms, factorStations } = props;
  const [delay, setDelay] = useState('all');

  const [struct, setStruct] = useState(null);


  useEffect(() => {
    if (!struct && structs.length > 0) {
      const structId = structs[0]?.id
      setStruct(structId);
    }
  }, [structs])

  useEffect(() => {
    if (struct) {
      let curStructure = structs.find(v => v.id === struct);
      if (curStructure) {
        dispatch(actions.dataMonitor.getStationList(curStructure?.id));
        dispatch(actions.dataMonitor.getDeviceList(curStructure?.iotaThingId)).then(res => {
          if (res.success) {
            const instances = res?.payload?.data?.instances;
            if (instances) {
              let deviceIds = Object.keys(instances).filter(k => instances[k]?.type == 's.d')
              dispatch(actions.dataMonitor.getDevicesAlarms(deviceIds, { limit: 5 }));
            }
          }
        });
        dispatch(actions.dataMonitor.getDimensionsList(curStructure?.iotaThingId));
      }
    }
  }, [struct]);

  const onDelayChange = (value) => {
    setDelay(value)
  }

  const onStructChange = (value) => {
    setStruct(value)
  }

  //计算设备列表数据缓存
  const dataSource = useMemo(() => {
    let result = [];
    if (devices?.instances) {
      let instances = devices.instances;
      let stations = factorStations.reduce((p, c) => {
        return p.concat(c.groups)
      }, []).reduce((pre, cur) => {
        return pre.concat(cur.stations)
      }, []);
      Object.keys(instances).forEach(k => {
        if (instances[k].type == 's.d') {
          const dType = instances[k]?.instance?.properties?.deviceType;
          result.push({
            id: k,
            name: instances[k].name || '',
            productName: instances[k]?.instance?.properties?.productName || '',
            status: deviceListAlarms.find(v => v.deviceId === k) ? '异常' : '正常'
          })
        }
      })
    }
    return result;
  }, [devices, deviceListAlarms]);

  const getData = () => {
    if (struct) {
      let curStructure = structs.find(v => v.id === struct);
      let data = []
      dataSource.map(s => {
        data.push([curStructure?.name, s.name, s.status == '异常' ? `<span style="color:red">${s.status}</span>` : s.status])
      })
      if (delay == 'yes') {
        data = data.filter(x => x[2] == '正常')
      } else if (delay == 'no') {
        data = data.filter(x => x[2] !== '正常')
      }
      return data;
    }
  }

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
      >
        {structs.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
      </Select>
      <Select
        className='gis-search-select'
        dropdownClassName='super-dropdownClassName'
        style={{ width: 91, height: 24, marginLeft: 20 }}
        showSearch={false}
        optionFilterProp="children"
        onChange={onDelayChange}
        value={delay}
      >
        <Option value="all">全部</Option>
        <Option value="yes">正常</Option>
        <Option value="no">异常</Option>
      </Select>
    </>
  }

  return (
    <Box title="设备状态统计" subtitle={renderSubtitle()}>
      <CarouselList
        header={['项目名称', '设备名称', '状态']}
        data={getData()}
        rowNum={4}
        height={255}
        multiellipsis={true}
        columnWidth={[200, 190, 70]}
        key={delay}
      />
    </Box>
  );
}

function mapStateToProps(state) {

  const { auth, global, myStructList, deviceMeta, deviceList, dimensionsList, deviceListAlarms, factorStations } = state;
  return {
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    myStructList: myStructList.data || [],
    deviceMetasWithFollow: deviceMeta.data || {},
    devices: deviceList.data || {},
    dimensions: dimensionsList.data || { dimensions: [], total: 0 },
    deviceListAlarms: deviceListAlarms.data || [],
    factorStations: factorStations.data || []
  };
}

export default connect(mapStateToProps)(RightTop);
