import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Spin } from 'antd';
import { connect } from 'react-redux';
import ProTable from '@ant-design/pro-table';
import { LayoutContent } from '@peace/components';
import AbnPushCfgModal from './abnPushCfgModal';
import { getPushList, deletePushCfg } from '../../actions/abnPushCfg';
import { getStructures } from '../../actions/common';
import { Func } from '$utils';

function AbnPushCfgTable({ ...props }) {
  const {
    dispatch, user, abnCfgs, allStructs, isRequestingAbn,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalData, setModalData] = useState(null);
  const pageStyle = Func.getPaginationStyle();
  useEffect(() => {
    dispatch(getStructures(user?.orgId));
    dispatch(getPushList(user?.orgId));
  }, []);
  const delAbnCfg = (e) => {
    const { id } = abnCfgs[e];
    dispatch(deletePushCfg(id)).then(() => {
      dispatch(getPushList(user.orgId));
    });
  };
  const editAbnCfg = (e) => {
    setModalVisible(true);
    setModalData(abnCfgs[e.target.id]);
    setModalEdit(true);
  };
  const addModal = () => {
    setModalVisible(true);
    setModalData(null);
    setModalEdit(false);
  };
  const modalCancel = (e) => {
    setModalVisible(false);
  };
  const formatTable = () => {
    const tableData = [];
    if (allStructs && allStructs.length) {
      for (let idx = 0; idx < abnCfgs.length; idx++) {
        const temp = abnCfgs[idx];
        const structures = [];
        const struIdArr = [];
        for (const i in temp.projects) {
          for (const j in temp.projects[i].structures) {
            const currStrucId = temp.projects[i].structures[j].id;
            if (!struIdArr.includes(currStrucId) && allStructs.some((as) => as.id == currStrucId)) {
              structures.push(temp.projects[i].structures[j].name);
            }
            struIdArr.push(currStrucId);
          }
        }
        if (structures.length) {
          tableData.push(
            {
              key: idx,
              name: temp.noticedUser.map((user) => user.name),
              structures,
              state: temp.enabled ? '已启用' : '已禁用',
              action: idx,
            },
          );
        }
      }
    }
    return tableData;
  };

  const tableColumns = [
    {
      title: '接收人',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '关注结构物',
      dataIndex: 'structures',
      render: (_, record) => record.structures.join('/'),
      width: '60%',
    },
    {
      title: '启用状态',
      dataIndex: 'state',
      width: '10%',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => { editAbnCfg(record.key); }} style={{ marginRight: 5 }}>修改</a>
          <span className="ant-divider" />
          <Popconfirm title="确认删除该接收人?" onConfirm={() => { delAbnCfg(record.key); }}>
            <a style={{ marginLeft: 5 }}>删除</a>
          </Popconfirm>
        </span>
      ),
      width: '15%',
    },
  ];
  return (
    <LayoutContent>
      <Spin spinning={isRequestingAbn}>
        <ProTable
          columns={tableColumns}
          rowKey="key"
          search={false}
          dateFormatter="string"
          headerTitle={<Button type="primary" onClick={addModal}>添加</Button>}
          options={{
            search: false,
            reload: false,
          }}
          pagination={{ ...pageStyle, pageSizeOptions: [10, 20, 30] }}
          dataSource={formatTable()}
        />
      </Spin>

      {modalVisible ? (
        <AbnPushCfgModal
          visible
          closeModal={modalCancel}
          modalData={modalData}
          isEdit={modalEdit}
        />
      ) : ''}

    </LayoutContent>
  );
}

function mapStateToProps(state) {
  const { pushCfgList, auth, thresholdStructures } = state;
  return {
    abnCfgs: pushCfgList.data || [],
    user: auth.user,
    isRequestingAbn: pushCfgList.isRequesting || thresholdStructures.isRequesting,
    allStructs: thresholdStructures.data || [],
  };
}

export default connect(mapStateToProps)(AbnPushCfgTable);
