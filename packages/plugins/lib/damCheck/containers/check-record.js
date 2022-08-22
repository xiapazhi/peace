import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  Spin,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { LayoutContent } from '@peace/components';
import { Func } from '$utils';
import { PinyinHelper } from '@peace/utils';
import moment from 'moment';

function CheckRecord(props) {
  const {
    dispatch,
    actions,
    loading,
    checkitems,
    clientHeight,
    user,
    myStructList,
    structUsers,
    checkrecords,
    authorData,
  } = props;

  const [params, setParams] = useState({});
  const pageStyle = Func.getPaginationStyle();

  useEffect(() => {
    dispatch(actions.damCheck.getCheckItems());
    dispatch(actions.damCheck.getAuthorList(user?.orgId));
    dispatch(actions.damCheck.getMyStructList(user?.orgId)).then((res) => {
      if (res.success) {
        if (res.payload.data.length > 0) {
          dispatch(actions.damCheck.getStructUsers(res?.payload?.data[0]?.id));
        }
      }
    });
    dispatch(actions.damCheck.getCheckRecords());
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      ellipsis: true,
      search: false,
    },
    {
      title: '结构物名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '巡视人',
      onFilter: true,
      dataIndex: 'user',
      ellipsis: true,
    },
    {
      title: '巡视时间',
      ellipsis: true,
      dataIndex: 'time',
      search: false,
      render: (text, record) => moment(record.time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '巡视结果',
      onFilter: true,
      dataIndex: 'result',
      ellipsis: true,
      search: false,
    },
    {
      title: '延期情况',
      onFilter: true,
      dataIndex: 'delay',
      ellipsis: true,
      search: false,
      render: (text, record) => (record.delay ? '延期' : '未延期'),
    },
    {
      title: '操作',
      width: 160,
      key: 'option',
      valueType: 'option',
      render: (text, record) => <a onClick={() => dispatch(push({ pathname: `/damCheck/record/${record.id}` }))}>查看详情</a>,
    },
    {
      title: '日期范围',
      dataIndex: 'timeRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
  ];

  const getDataSource = () => {
    let dataSource = checkrecords;
    const { name, user, timeRange } = params;
    dataSource.sort((a, b) => b.id - a.id).map((s) => {
      s.name = myStructList.find((x) => x.id == parseInt(s?.DamCheckPlan.structId))?.name;
      authorData.forEach((x) => {
        if (x.members.find((v) => v.id == parseInt(s?.DamCheckPlan.userId))) s.user = x.members.find((v) => v.id == parseInt(s?.DamCheckPlan.userId)).name;
      });
      return s;
    });

    if (name) {
      dataSource = dataSource.filter(
        (s) => s.name.indexOf(name) !== -1
          || PinyinHelper.isPinyinMatched(s.name, name),
      );
    }
    if (user) {
      dataSource = dataSource.filter(
        (s) => s.user && (s.user.indexOf(user) !== -1
          || PinyinHelper.isPinyinMatched(s.user, user)),
      );
    }
    if (timeRange) {
      dataSource = dataSource.filter((s) => moment(s.time) > moment(timeRange[0]).startOf('day') && moment(s.time) < moment(timeRange[1]).endOf('day'));
    }

    const rslt = dataSource;
    return rslt.sort((a, b) => b.id - a.id).map((s, index) => {
      s.index = index + 1;
      return s;
    });
  };

  const filterData = getDataSource();

  return (
    <LayoutContent perfectScroll={false}>
      <Spin spinning={loading}>
        <ProTable
          columns={columns}
          rowKey="id"
          request={async (param) => {
            setParams(param);
            return {
              data: [],
              success: true,
            };
          }}
          headerTitle={null}
          dateFormatter="string"
          search={{
            labelWidth: 'auto',
          }}
          // options={{
          //     search: { placeholder: '结构物名称或巡视人' },
          //     reload: false,
          // }}
          pagination={{ ...pageStyle, pageSizeOptions: [10, 20, 30] }}
          scroll={{ y: Func.getContentHeight(clientHeight) - 199 }}
          dataSource={filterData}
        />
      </Spin>
    </LayoutContent>
  );
}

function mapStateToProps(state) {
  const {
    auth, global, checkitems, myDamStructList, structUsers, checkrecords, damAuthorData,
  } = state;
  return {
    loading: checkrecords.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    checkitems: checkitems?.data || [],
    checkrecords: checkrecords?.data || [],
    myStructList: myDamStructList?.data || [],
    structUsers: structUsers?.data || [],
    authorData: damAuthorData?.data || [],
  };
}

export default connect(mapStateToProps)(CheckRecord);
