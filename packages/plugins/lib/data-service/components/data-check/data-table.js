import {
  Popconfirm, Space, Menu, Dropdown,
} from 'antd';
import React from 'react';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { Func, AuthorizationCode } from '$utils';

function DataTable({ ...props }) {
  const { data } = props;
  const pageStyle = Func.getPaginationStyle();

  const getColumns = () => {
    const columns = [
      {
        title: '安装位置',
        onFilter: true,
        dataIndex: 'name',
        ellipsis: true,
      },
    ];
    if (data?.length > 0) {
      Object.keys(data[0].items).map((key) => {
        columns.push({
          title: `${data[0].items[key]?.name}(${data[0].items[key]?.unit})`,
          ellipsis: true,
          dataIndex: key,
        });
      });
    }

    columns.push({
      title: '采集时间',
      ellipsis: true,
      dataIndex: 'time',
    });
    return columns;
  };

  const getDataSource = () => {
    const rslt = [];
    if (data && data.length > 0) {
      data[0].stations?.map((s) => {
        s.data.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf()).map((x) => {
          const obj = { ...x.values, time: moment(x.time).format('YYYY-MM-DD HH:mm:ss'), name: s.name };
          rslt.push(obj);
        });
      });
    }
    return rslt.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf());
  };

  const dataSource = getDataSource();
  return (
    dataSource.length > 0 ? (
      <ProTable
        headerTitle="数据表格"
        columns={getColumns()}
        search={false}
        dateFormatter="string"
        pagination={{ ...pageStyle, pageSizeOptions: [10, 20, 30] }}
        dataSource={dataSource}
        // toolBarRender={false}
        options={false}
        cardBordered
      />
    ) : (
      <div style={{
        textAlign: 'center', color: '#b9c8d7', fontSize: 24, lineHeight: '120px',
      }}
      >
        暂无数据
      </div>
    )
  );
}

export default DataTable;
