import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { LayoutContent, ExportAndImport } from '@peace/components';
import ProTable from '@ant-design/pro-table';
import { push } from 'react-router-redux';
import moment from 'moment';
import { Func, AuthorizationCode, ApiTable } from '$utils';
import { PinyinHelper, Func as peaceFunc } from '@peace/utils';
import { modifyBridgeInfo } from '../actions/info';
import InfoModal from '../components/infoModal';
import { importColums } from '../constant';

const { BridgeExtraInfo } = AuthorizationCode;

function BridgeInfo({ ...props }) {
  const {
    dispatch, actions, user, loading, bridgeList, constants, clientHeight,
  } = props;
  const [params, setParams] = useState({});
  const [bridgeStructTypes, setBridgeStructTypes] = useState('');
  const pageStyle = Func.getPaginationStyle();
  useEffect(() => {
    dispatch(actions.bridge.getConstants());
    dispatch(actions.bridge.getStructTypes()).then((res) => {
      if (res.success) {
        const data = res?.payload?.data || [];
        const parentBridge = data.find((v) => v.name === '桥梁');
        if (parentBridge) {
          const chrldren = data.filter((f) => f.parentTypeId == parentBridge.id).map((v) => v.id);
          const structureTypes = [].concat([parentBridge.id], chrldren).toString();
          setBridgeStructTypes(structureTypes);
          dispatch(actions.bridge.getBridgeList(user?.orgId, { structureTypes }));
        }
      }
    });
  }, []);

  const columns = [{
    title: '桥梁名称',
    dataIndex: 'name',
    ellipsis: true,

  }, {
    title: '档案编号',
    dataIndex: 'fileNo',
    ellipsis: true,
  }, {
    title: '所在区域',
    dataIndex: 'region',

    valueType: 'select',
    valueEnum: Func.transValueEnum(constants.filter((f) => f.category == 'region')),
    fieldProps: Func.getSelectCommonProps(),

  }, {
    title: '建成年月',
    dataIndex: 'time',
    search: false,
    ellipsis: true,
    renderText: (text) => (text ? moment(text).format('YYYY-MM-DD') : '-'),
  }, {
    title: '运行状态',
    dataIndex: 'status',
    search: false,
    ellipsis: true,
  }, {
    title: '养护类别',
    dataIndex: 'type',
    valueType: 'select',
    valueEnum: Func.transValueEnum(constants.filter((f) => f.category == 'maintainCate')),
    fieldProps: Func.getSelectCommonProps(),
  }, {
    title: '养护等级',
    dataIndex: 'level',
    valueType: 'select',
    valueEnum: Func.transValueEnum(constants.filter((f) => f.category == 'maintainLevel')),
    fieldProps: Func.getSelectCommonProps(),
  }, {
    title: '养护单位',
    search: false,
    dataIndex: 'company',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'operation',
    valueType: 'option',
    width: '20%',
    render: (text, record) => {
      const actions = [];
      peaceFunc.judgeRightsContainsAdmin(BridgeExtraInfo) && actions.push(<InfoModal
        key="read"
        title={`桥梁信息查看 - ${record.name}`}
        text="查看"
        editData={record}
        onRefresh={refresh}
        bridges={bridgeList}
        constants={constants}
        onFinish={onFinish}
        readOnly
      />);
      peaceFunc.judgeRightsContainsAdmin(BridgeExtraInfo) && actions.push(<InfoModal
        key="edit"
        title={`桥梁信息维护 - ${record.name}`}
        text="桥梁信息维护"
        editData={record}
        onRefresh={refresh}
        bridges={bridgeList}
        constants={constants}
        onFinish={onFinish}
      />);
      actions.push(<a key="partConfig" onClick={() => { dispatch(push(`/bridge/info/${record.id}`)); }}>构件配置</a>);
      return actions;
    },
  }];

  const refresh = () => {
    dispatch(actions.bridge.getBridgeList(user?.orgId, { structureTypes: bridgeStructTypes }));
  };
  const onFinish = async (values, editData, next) => dispatch(modifyBridgeInfo(editData?.id, values));

  const getDataSource = () => {
    const dataSource = bridgeList.map((v) => ({
      id: v.id,
      name: v.name,
      fileNo: v?.extraInfo?.fileNo || null,
      region: v?.extraInfo?.region?.value || v?.extraInfo?.region || null,
      time: v?.extraInfo?.createdTime || null,
      status: v?.extraInfo?.bridgeState?.label || v?.extraInfo?.bridgeState || null,
      type: v?.extraInfo?.maintainCate?.value || v?.extraInfo?.maintainCate || null,
      level: v?.extraInfo?.maintainLevel?.value || v?.extraInfo?.maintainLevel || null,
      company: v?.extraInfo?.maintainCompany?.label || v?.extraInfo?.maintainCompany || null,
      extraInfo: v.extraInfo,
    }));
    const {
      name, fileNo, region, type, level,
    } = params;
    const rslt = dataSource.filter((s) => (name ? s.name ? (s.name.indexOf(name) != -1 || PinyinHelper.isPinyinMatched(s.name, name)) : false : true)
      && (fileNo ? s.fileNo ? (s.fileNo.indexOf(fileNo) != -1 || PinyinHelper.isPinyinMatched(s.fileNo, fileNo)) : false : true)
      && (region ? s.region == region : true)
      && (type ? s.type == type : true)
      && (level ? s.level == level : true));
    return rslt;
  };

  const handelData = (data) => {
    const importData = [];
    let id = null;
    data.forEach((item) => {
      const newData = {};
      Object.keys(item).forEach((k) => {
        const field = importColums.find((f) => f.name === k);
        if (field) {
          if (field.key === 'name') {
            const bridge = bridgeList.find((f) => f.name === item[k]);
            id = bridge.id;
          }
          if (field.key === 'createdTime') {
            newData[field.key] = moment(item[k]).format('YYYY-MM-DD');
          } else {
            newData[field.key] = item[k];
          }
        }
      });
      importData.push({
        id,
        extraInfo: newData,
      });
    });
    return importData;
  };

  return (
    <LayoutContent>
      <Spin spinning={loading}>
        <ProTable
          columns={columns}
          rowKey="id"
          request={async (params) => {
            setParams(params);
            return {
              data: [],
              success: true,
            };
          }}
          pagination={{ ...pageStyle }}
          options={{
            search: false,
            reload: false,
          }}
          toolBarRender={() => {
            const node = [<ExportAndImport
              import
              importBtnName="导入数据"
              importTemColumn={importColums}
              importTemData={[]}
              // column={getExportColumn()}
              importUrl={ApiTable.importStructureExtInfoUrl}
              handelData={handelData}
              fileName="桥梁基础信息数据"
              btnClass=""
              requestType="post"
              importMethod="put"
              onImportSucess={refresh}
            />];
            return node;
          }}
          scroll={{ y: Func.getContentHeight(clientHeight) - 299 }}
          dateFormatter="string"
          headerTitle="桥梁列表"
          dataSource={getDataSource()}
        />

      </Spin>
    </LayoutContent>
  );
}

function mapStateToProps(state) {
  const {
    auth, global, bridgeList, constantList,
  } = state;
  return {
    loading: bridgeList.isRequesting || constantList.isRequesting,
    user: auth.user,
    actions: global.actions,
    clientWidth: global.clientWidth,
    clientHeight: global.clientHeight,
    bridgeList: bridgeList.data || [],
    constants: constantList.data || [],
  };
}

export default connect(mapStateToProps)(BridgeInfo);
