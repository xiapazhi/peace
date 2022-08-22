import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Tag, Badge, Radio, DatePicker,
} from 'antd';
import { LayoutContent } from '@peace/components';
import ProTable from '@ant-design/pro-table';
import { push } from 'react-router-redux';
import moment from 'moment';
import {
  Func, AuthorizationCode, pickLevelFromAlarm, getMyAlarmType, AlarmColor,
} from '$utils';
import { Func as peaceFunc } from '@peace/utils';
import { getAlarms, getAlarmDetails, checkAlarm } from '../actions/alarm';
import CheckAlarmModal from '../components/checkAlarmModal';

const { CheckAlarm } = AuthorizationCode;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

function AlarmList({ ...props }) {
  const {
    dispatch, actions, user, loading, myStructList, location, clientHeight,
  } = props;

  const ref = useRef();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [radioValue, setRadioValue] = useState('new');
  const [rangeDate, setRangeDate] = useState([]);
  const [showRangeDate, setShowRangeDate] = useState(false);
  const pageStyle = Func.getPaginationStyle();
  const alarmTypes = getMyAlarmType(user?.resources || []);
  useEffect(() => {
    dispatch(actions.alarm.getMyStructList(user?.orgId));
  }, []);

  const onFinish = (values, editData) => {
    const params = {
      sourceId: editData.sourceId,
      alarmTypeCode: editData.alarmTypeCode,
      content: values.content,
      userId: user?.id,
    };

    dispatch(checkAlarm(params)).then((_) => {
      setTimeout(() => {
        ref.current.reload();
      }, 1000);
    });
  };

  const handleCountClick = (id) => {
    if (id !== expandedRowKeys[0]) {
      setExpandedRowKeys([id]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const handleTableExpand = (expanded, record) => {
    if (!expanded) {
      setExpandedRowKeys([]);
    } else {
      setExpandedRowKeys([record.id]);
    }
  };
  const onRadioChange = (e) => {
    const { value } = e.target;
    setRadioValue(value);
    if (value === 'history') {
      setShowRangeDate(true);
      setRangeDate([moment().add(-29, 'days'), moment()]);
    } else {
      setShowRangeDate(false);
      setRangeDate([]);
    }
  };

  const onDateRangeChange = (dates, dateStrings) => {
    setRangeDate(dateStrings);
  };

  const renderTitle = () => (
    <>
      <RadioGroup value={radioValue} onChange={onRadioChange}>
        <RadioButton value="new">实时告警</RadioButton>
        <RadioButton value="history">历史告警</RadioButton>
      </RadioGroup>
      {
        showRangeDate && (
          <RangePicker
            style={{ width: 250, marginLeft: 5 }}
            allowClear
            showTime={false}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            format="YYYY-MM-DD"
            defaultValue={rangeDate.length === 2 ? [moment(rangeDate[0]), moment(rangeDate[1])] : []}
            onChange={onDateRangeChange}
          />
        )
      }

    </>
  );
  const columns = [{
    title: '结构物',
    dataIndex: 'struct',
    order: 10,
    valueType: 'select',
    valueEnum: Func.transValueEnum(myStructList),
    initialValue: location.state?.structId ? `${location.state?.structId}` : null,
    fieldProps: {
      ...Func.getSelectCommonProps(),
      showSearch: true,
      optionFilterProp: 'label',
      filterOption: Func.filterLabelOption,
    },
  }, {
    title: '类型',
    dataIndex: 'alarmType',
    order: 9,
    hideInTable: true,
    valueType: 'select',
    valueEnum: Func.transValueEnum(alarmTypes),
    fieldProps: { ...Func.getSelectCommonProps(), mode: 'multiple' },

  }, {
    title: '关键词',
    dataIndex: 'keywords',
    order: 7,
    hideInTable: true,
    fieldProps: {
      placeholder: '关键词: 告警源、告警信息',
    },

  }, {
    title: '告警源',
    dataIndex: 'source',
    search: false,
    render: (_, record) => (
      <span>
        <Tag>{record.sourceType}</Tag>
        {record.source}
      </span>
    ),
  }, {
    title: '等级',
    dataIndex: 'level',
    valueType: 'select',
    order: 8,
    valueEnum: Func.transValueEnum(AlarmColor.filter((f) => f.level > 0), 'level', 'name'),
    fieldProps: Func.getSelectCommonProps(),
    render: (text, record) => {
      const alarmColor = pickLevelFromAlarm(record.level);
      return <Badge color={alarmColor.color} text={alarmColor.name} />;
    },

  }, {
    title: '告警信息',
    dataIndex: 'content',
    search: false,
    ellipsis: true,

  }, {
    title: '产生次数',
    dataIndex: 'count',
    search: false,
    render: (_, record) => <a onClick={() => handleCountClick(record.id)}>{_}</a>,
  }, {
    title: '产生时间',
    search: false,
    dataIndex: 'startTime',

  }, {
    title: '更新时间',
    search: false,
    dataIndex: 'endTime',

  },
  {
    title: '操作',
    key: 'operation',
    valueType: 'option',
    width: '10%',
    render: (text, record) => {
      switch (record.recoveryMode) {
        case 0:
        case 1:
        case 2:
          return peaceFunc.judgeRightsContainsAdmin(CheckAlarm) && <CheckAlarmModal key="edit" editData={record} onFinish={onFinish} />;
        case 3:
          return '自动恢复';
        case 4:
          return '人工恢复';
      }
    },
  }];

  const requestData = async (params) => {
    const {
      current, pageSize, struct, alarmType, level, keywords, status,
    } = params;

    const query = {
      limit: pageSize,
      offset: (current - 1) * pageSize,
      orderBy: 'startTime',
      orderDirection: 'desc',
    };
    const body = {
      structures: struct ? [struct] : null,
      types: Array.isArray(alarmType) ? alarmType.map((v) => Number(v)) : alarmTypes.map((v) => v.id),
      levels: level ? [Number(level)] : AlarmColor.filter((f) => f.level > 0).map((v) => v.level),
      status,
      startTime: rangeDate[0] ? moment(rangeDate[0]).startOf('day').format(dateFormat) : null,
      endTime: rangeDate[1] ? moment(rangeDate[1]).endOf('day').format(dateFormat) : null,
      keywords: keywords || '',

    };

    const { payload, success } = await dispatch(getAlarms(user?.id, query, body));
    let data = [];
    if (payload?.data && payload?.data?.alarms) {
      data = Array.isArray(payload.data.alarms) && payload.data.alarms.reduce((prev, s) => {
        const als = s.alarms.map((a) => ({
          id: a.id,
          struct: s.structureName,
          sourceId: a.source.id,
          sourceType: a.sourceType.name,
          source: a.source.name,
          level: a.level,
          alarmTypeCode: a.alarmTypeCode,
          content: a.content,
          count: a.count,
          startTime: a.startTime,
          endTime: a.endTime,
          recoveryMode: a.state,
        }));
        return prev.concat(als);
      }, []);
    }

    return {
      data,
      success,
      total: payload?.data?.count || 0,
    };
  };

  const expandedRowRender = (row, index, indent, expanded) => {
    const columns = [
      {
        title: '告警活动',
        dataIndex: 'alarmState',
        render: (text, record) => {
          switch (record.alarmState) {
            case 0:
              return '首次产生';
            case 1:
              return '持续产生';
            case 2:
              return <b>等级提升</b>;
            case 3:
              return <b>自动恢复</b>;
            case 4:
              return <b>人工恢复</b>;
          }
        },
      }, {
        title: '告警信息',
        dataIndex: 'content',
        render: (text, record) => {
          const content = record.content.split('：');
          switch (record.alarmState) {
            case 0:
            case 1:
            case 2:
              return text;
            case 3:
              return <b>自动恢复</b>;
            case 4:
              return <b>{content.length == 2 ? content[1] : ''}</b>;
          }
        },
      }, {
        title: '等级',
        dataIndex: 'currentLevel',
        render: (text, record) => {
          const alarmColor = pickLevelFromAlarm(record.currentLevel);
          return <Badge color={alarmColor.color} text={alarmColor.name} />;
        },
      }, {
        title: '产生时间',
        dataIndex: 'time',
      }];
    return (
      <ProTable
        tableClassName="child-table"
        columns={columns}
        headerTitle={false}
        search={false}
        options={false}
        pagination={{ ...pageStyle }}
        request={async (params) => {
          const { payload, success } = await dispatch(getAlarmDetails(row.id));
          return {
            data: payload?.data || [],
            success,
          };
        }}
      />
    );
  };

  return (
    <LayoutContent>
      {
        !loading && (
          <ProTable
            actionRef={ref}
            columns={columns}
            rowKey="id"
            params={{ status: radioValue }}
            request={requestData}
            pagination={{ ...pageStyle }}
            options={{
              search: false,
              reload: false,
            }}
            scroll={{ y: Func.getContentHeight(clientHeight) - 299 }}
            expandable={{ expandedRowRender, expandedRowKeys, onExpand: handleTableExpand }}
            dateFormatter="string"
            headerTitle={renderTitle()}
          />
        )
      }

    </LayoutContent>
  );
}

function mapStateToProps(state) {
  const { auth, global, myStructList } = state;
  return {
    loading: myStructList.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    myStructList: myStructList.data || [],
  };
}

export default connect(mapStateToProps)(AlarmList);
