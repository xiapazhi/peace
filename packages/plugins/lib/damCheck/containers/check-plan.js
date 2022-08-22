import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Spin, Popconfirm,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { LayoutContent } from '@peace/components';
import { Func } from '$utils';
import { PinyinHelper } from '@peace/utils';
import moment from 'moment';
import CheckPlansModal from '../components/check-plan-modal';

function CheckPlan(props) {
  const {
    dispatch,
    actions,
    loading,
    checkitems,
    clientHeight,
    user,
    myStructList,
    structUsers,
    checkplans,
    authorData,
  } = props;

  const [params, setParams] = useState({});
  const pageStyle = Func.getPaginationStyle();
  const handleDelete = (id) => {
    dispatch(actions.damCheck.deleteCheckPlan(id)).then(() => {
      dispatch(actions.damCheck.getCheckPlans());
    });
  };
  useEffect(() => {
    dispatch(actions.damCheck.getCheckItems());
    dispatch(actions.damCheck.getAuthorList(user?.orgId));
    dispatch(actions.damCheck.getMyStructList(user?.orgId)).then((res) => {
      if (res.success) {
        if (res.payload.data.length > 0) {
          dispatch(actions.damCheck.getStructUsers(res?.payload?.data[0]?.id));
        }
      } else {
        setIsEmpty(true);
      }
    });
    dispatch(actions.damCheck.getCheckPlans());
  }, []);
  const structChange = (id) => {
    dispatch(actions.damCheck.getStructUsers(id));
  };
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
      title: '巡检方式',
      onFilter: true,
      dataIndex: 'way',
      ellipsis: true,
      search: false,
    },
    {
      title: '计划开始时间',
      ellipsis: true,
      dataIndex: 'start',
      search: false,
      render: (text, record) => moment(record.start).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '计划结束时间',
      ellipsis: true,
      dataIndex: 'end',
      search: false,
      render: (text, record) => moment(record.end).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 160,
      key: 'option',
      valueType: 'option',
      render: (text, record) => {
        const options = [];
        const disable = !record?.DamCheckRecords || record.DamCheckRecords.length == 0;
        options.push(
          <CheckPlansModal
            key="edit"
            title="编辑"
            triggerRender={<a onClick={() => { dispatch(actions.damCheck.getStructUsers(record?.structId)); }}>编辑</a>}
            onFinish={onFinish}
            editData={record}
            checkitems={checkitems}
            checkplans={checkplans}
            myStructList={myStructList}
            structUsers={structUsers}
            structChange={structChange}
          />,
        );

        options.push(
          <CheckPlansModal
            key="edit"
            title="查看"
            triggerRender={<a>查看</a>}
            onFinish={onFinish}
            editData={record}
            checkitems={checkitems}
            checkplans={checkplans}
            readOnly
            myStructList={myStructList}
            structUsers={structUsers}
            structChange={structChange}
          />,
        );

        options.push(
          <Popconfirm
            key="del"
            placement="top"
            title="是否确认删除该巡检计划？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
            disabled={!disable}
          >
            {disable ? <a>删除</a> : <span title="无法删除有巡检记录的计划" style={{ color: 'grey' }}>删除</span>}
          </Popconfirm>,
        );
        return options;
      },
    },
    {
      title: '日期范围',
      dataIndex: 'timeRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
  ];

  const onFinish = async (values, editData) => {
    const dataToSave = {
      ...values,
      content: values.content.toString(),
    };

    if (editData) {
      return dispatch(
        actions.damCheck.modifyCheckPlan(editData.id, dataToSave),
      ).then(() => {
        dispatch(actions.damCheck.getCheckPlans());
      });
    }
    return dispatch(actions.damCheck.addCheckPlan(dataToSave)).then(() => {
      dispatch(actions.damCheck.getCheckPlans());
    });
  };

  const getDataSource = () => {
    let dataSource = checkplans;
    const { name, user, timeRange } = params;
    dataSource.sort((a, b) => b.id - a.id).map((s) => {
      s.name = myStructList.find((x) => x.id == parseInt(s?.structId))?.name;
      authorData.forEach((x) => {
        if (x.members.find((v) => v.id == parseInt(s?.userId))) s.user = x.members.find((v) => v.id == parseInt(s?.userId)).name;
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
          pagination={{ ...pageStyle, pageSizeOptions: [10, 20, 30] }}
          scroll={{ y: Func.getContentHeight(clientHeight) - 199 }}
          dataSource={filterData}
          toolBarRender={() => (
            <CheckPlansModal
              allowAsProps
              title="添加计划"
              onFinish={onFinish}
              checkitems={checkitems}
              myStructList={myStructList}
              structUsers={structUsers}
              checkplans={checkplans}
              structChange={structChange}
            />

          )}
        />
      </Spin>
    </LayoutContent>
  );
}

function mapStateToProps(state) {
  const {
    auth, global, checkitems, myDamStructList, structUsers, checkplans, damAuthorData,
  } = state;
  return {
    loading: checkplans.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    checkitems: checkitems?.data || [],
    checkplans: checkplans?.data || [],
    myStructList: myDamStructList?.data || [],
    structUsers: structUsers?.data || [],
    authorData: damAuthorData?.data || [],
  };
}

export default connect(mapStateToProps)(CheckPlan);
