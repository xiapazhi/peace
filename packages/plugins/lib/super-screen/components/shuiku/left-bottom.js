import React, { useState, useMemo } from 'react';
import Box from '../common/box';
import CarouselList from '../common/carousel-list';
import { Select } from 'antd';
const { Option } = Select;
import moment from 'moment';
import { useFsRequest, ApiTable } from '$utils';
import { Loading } from '@jiaminghi/data-view-react';

function LeftBottom(props) {
  const { structs, user } = props;
  const [delay, setDelay] = useState('all');
  const [date, setDate] = useState('day');

  const start = moment().startOf(date).format('YYYY-MM-DD HH:mm:ss')
  const end = moment().endOf(date).format('YYYY-MM-DD HH:mm:ss')
  const { data: users = [] } = useFsRequest({ url: ApiTable.getEnterprisesMembers.replace('{enterpriseId}', user?.orgId) });

  const {
    data: dataSource = [], loading
  } = useFsRequest({
    url: ApiTable.getCheckPlans,
    query: {
      start, end
    },
    refreshDeps: [start, end],
  });



  const data = useMemo(() => {
    const data1 = []
    dataSource.map(s => {
      let structName = structs.find(x => x.id == s.structId)?.name
      let userName = ''
      users.forEach(x => {
        if (x.members.find(v => v.id == parseInt(s?.userId))) userName = x.members.find(v => v.id == parseInt(s?.userId)).name
      })
      let DamCheckRecords = s.DamCheckRecords?.length > 0 ? s.DamCheckRecords[s.DamCheckRecords.length - 1].delay : false
      data1.push([structName, s.way, userName, DamCheckRecords ? '是' : '否'])
    })
    return data1;
  }, [dataSource, users, structs])



  const onDelayChange = (value) => {
    setDelay(value)
  }

  const onDateChange = (value) => {
    setDate(value)
  }


  const renderSubtitle = () => {
    return <>
      <Select
        className='gis-search-select'
        dropdownClassName='super-dropdownClassName'
        style={{ width: 91, height: 24 }}
        showSearch={false}
        optionFilterProp="children"
        onChange={onDateChange}
        value={date}
      >
        <Option value="day">当日</Option>
        <Option value="week">近一周</Option>
        <Option value="month">近一月</Option>
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
        <Option value="yes">已延期</Option>
        <Option value="no">未延期</Option>
      </Select>
    </>
  }

  const getFilterData = () => {
    let dataFilter = data;
    if (delay == 'yes') {
      dataFilter = data.filter(x => x[3] == '是')
    } else if (delay == 'no') {
      dataFilter = data.filter(x => x[3] == '否')
    }
    return dataFilter;
  }

  // data = data.filter(s=>s[3].indexOf)
  return (
    <Box title="巡检情况统计" subtitle={renderSubtitle()}>
      {
        loading ? <Loading /> :
          <CarouselList
            header={['项目名称', '巡检频次', '巡检人', '是否延期']}
            data={getFilterData()}
            evenRowBGC={'#001C50'}
            oddRowBGC={'#091836'}
            rowNum={6}
            height={255}
            key={delay}
          />
      }
    </Box>

  );
}

export default LeftBottom;
