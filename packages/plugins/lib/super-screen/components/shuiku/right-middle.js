import React, { useState } from 'react';
import Box from '../common/box';
import RingChart from '../charts/ring'
import { Select } from 'antd';
import { useFsRequest, ApiTable } from '$utils';
import moment from 'moment';

const { Option } = Select;
function RightMiddle({ structs, user }) {
  const [struct, setStruct] = useState('all');
  const [date, setDate] = useState('month');

  let fsStrId = structs.length > 0 ? struct == 'all' ?
    structs.map(s => parseInt(s.id)) : [structs.find(s => s.id == parseInt(struct))?.id] : []
  const startTime = moment().subtract(1, date).format('YYYY-MM-DD HH:mm:ss')
  const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
  const {
    data: userAlarmsInfo = {
      alarms: [],
    },
  } = useFsRequest({
    url: ApiTable.getAlarms.replace('{userId}', user?.id),
    method: 'post',
    query: {
      limit: 999,
      offset: 0,
    },
    body: {
      "status": "new", // {string, optional} 告警状态，{"new":新告警, "history":历史告警}
      "levels": [1, 2, 3, 4], // {array[int], optional} 告警等级数组
      "types": [1],
      "structures": fsStrId,
      startTime: startTime,
      endTime: endTime,
    },
    refreshDeps: [startTime, fsStrId.toString()],
    ready: !!(fsStrId && user?.id)
    // pollingInterval: 10000,
  });

  const onStructChange = (value) => {
    setStruct(value)
  }

  const onDateChange = (value) => {
    setDate(value)
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
        <Option value="all">全部</Option>
        {structs.map(s => <Option key={`${s.id}`} value={`${s.id}`}>{s.name}</Option>)}
      </Select>
      <Select
        className='gis-search-select'
        dropdownClassName='super-dropdownClassName'
        style={{ width: 91, height: 24, marginLeft: 20 }}
        showSearch={false}
        optionFilterProp="children"
        onChange={onDateChange}
        value={date}
      >
        <Option value="month">近一月</Option>
        <Option value="day">今日</Option>
        <Option value="week">近一周</Option>
      </Select>
    </>
  }

  let level1 = 0, level2 = 0, level3 = 0;
  userAlarmsInfo.alarms.map(s => {
    s.alarms.map(x => {
      x.level == 1 ? level1++ :
        x.level == 2 ? level2++ :
          x.level == 2 ? level3++ : ''

    })
  })
  const data = [
    { name: '一级告警', value: level1 },
    { name: '二级告警', value: level2 },
    { name: '三级告警', value: level3 },
  ]
  const colors = [
    {
      linearGradientTo: '#E01615',
      linearGradientFrom: '#7C0100',
    },
    {
      linearGradientTo: '#481B00',
      linearGradientFrom: '#FF6101',
    },
    {
      linearGradientTo: '#8BB2FF',
      linearGradientFrom: '#3877F2',
    }
  ];

  return (
    <Box title="告警信息统计" subtitle={renderSubtitle()}>
      <RingChart
        data={data}
        colors={colors}
      />
    </Box>
  );
}

export default RightMiddle;
