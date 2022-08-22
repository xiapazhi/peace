import React, { useMemo } from 'react';
import ProTable from '@ant-design/pro-table';
import {
  mean, median, sampleVariance, rootMeanSquare,
} from 'simple-statistics';

function StaticTable({ data = [] }) {
  const columns = [
    {
      title: '安装位置',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '平均值',
      dataIndex: 'avg',
      ellipsis: true,
    },
    {
      title: '中值',
      dataIndex: 'median',
      ellipsis: true,
    },
    {
      title: '方差',
      dataIndex: 'variance',
      ellipsis: true,
    },
    {
      title: '均方根',
      dataIndex: 'rootMeanSquare',
      ellipsis: true,
    },
    {
      title: '最大值',
      dataIndex: 'max',
      ellipsis: true,
    },
    {
      title: '最大值时间',
      dataIndex: 'maxTime',
      ellipsis: true,
    },
    {
      title: '最小值',
      dataIndex: 'min',
      ellipsis: true,
    },
    {
      title: '最小值时间',
      dataIndex: 'minTime',
      ellipsis: true,
    },
  ];
  const dataSource = useMemo(() => (data.map((v) => {
    const filterData = v.data.filter((f) => f.value === +f.value);
    const dataArr = filterData.map((item) => item.value);
    const sortArr = filterData.sort((a, b) => a.value - b.value);
    return {
      ...v,
      avg: dataArr.length > 0 ? mean(dataArr)?.toFixed(2) : '',
      median: dataArr.length > 0 ? median(dataArr) : '',
      variance: dataArr.length > 1 ? sampleVariance(dataArr) : '',
      rootMeanSquare: dataArr.length > 0 ? rootMeanSquare(dataArr) : '',
      min: sortArr[0]?.value,
      minTime: sortArr[0]?.time,
      max: sortArr[sortArr.length - 1]?.value,
      maxTime: sortArr[sortArr.length - 1]?.time,
    };
  })), [data]);

  return (
    <ProTable
      columns={columns}
      search={false}
      dateFormatter="string"
      pagination={false}
      dataSource={dataSource}
      toolBarRender={false}
    />
  );
}

export default StaticTable;
