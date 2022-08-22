import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Input, Table, Card, Switch, Popconfirm, Tag, message, Form, Divider,
} from 'antd';
import { deleteAbnParams, getAbnParamList, batchCfgAbnParams } from '../../actions/abnParamCfg';
import BurrModal from '../../components/dataCalc/burr-modal';

const filterSet = { stationName: null, factorName: null };

class Burr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      filterFunc: {},
      modalVisible: false,
      bvBatch: '',
    };
    this.formRef = React.createRef();
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  compareAndEdit = (e, record) => {
    this.setState({
      modalVisible: true,
      modalData: record,
    });
  };

  modalCancel = () => {
    this.setState({ modalVisible: false });
  };

  removeItem = (e) => {
    const { dispatch, structId } = this.props;
    dispatch(deleteAbnParams(e)).then(() => {
      dispatch(getAbnParamList(structId));
    });
  };

  handleInputChange = (e) => {
    if (e.target.value != null) {
      const { value } = e.target;
      let func = ((ep) => ((s) => (s.stationName).search(ep) > -1))(value);
      filterSet.stationName = func;
      func = ((ep) => ((s) => (s.factorName).search(ep) > -1))(value);
      filterSet.factorName = func;
    } else {
      filterSet.stationName = null;
      filterSet.factorName = null;
    }
    this.setState({ filterFunc: filterSet });
  };

  // 批量启用or禁用
  onSwitchChange = (e) => {
    const { selectedRowKeys } = this.state;
    const { dispatch, structId } = this.props;
    if (selectedRowKeys.length !== 0) {
      const ids = selectedRowKeys.join(',');
      const data = {
        enabled: e,
        use: 'switch',
      };
      dispatch(batchCfgAbnParams(ids, data)).then(() => {
        dispatch(getAbnParamList(structId));
      });
    }
  };

  // 批量删除
  batchDelete = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch, structId } = this.props;
    if (selectedRowKeys.length !== 0) {
      const ids = selectedRowKeys.join(',');
      dispatch(deleteAbnParams(ids)).then(() => {
        dispatch(getAbnParamList(structId));
      });
    } else {
      message.warning('您尚未勾选任何参数配置！');
    }
  };

  // 批量保存
  batchSave = () => {
    const form = this.formRef.current;
    const {
      dispatch, abnParamList, factorId, structId,
    } = this.props;
    const { selectedRowKeys, bvBatch } = this.state;
    form.validateFields().then((values) => {
      const dataSource = abnParamList.filter((a) => a.abnType === 2 && a.factorId === factorId);
      if (selectedRowKeys.length !== 0) {
        const ids = selectedRowKeys.join(',');
        const data = {
          paramJson: { thr_burr: bvBatch },
          use: 'notSwitch',
        };
        dispatch(batchCfgAbnParams(ids, data)).then(() => {
          dispatch(getAbnParamList(structId));
        });
      } else if (dataSource.length !== 0) {
        message.warning('您尚未勾选任何参数配置！');
      }
    });
  };

  batchBurr = (value) => {
    this.setState({
      bvBatch: value,
    });
  };

  checkNumber = async (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    const pattern = /^-?\d+(\.\d+)?$/;
    if (pattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入数字'));
  };

  render() {
    const { abnParamList, factorId, structId } = this.props;
    const {
      selectedRowKeys, filterFunc, modalVisible, modalData,
    } = this.state;
    const dataSource = abnParamList.filter((a) => a.abnType === 2 && a.factorId === factorId);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    let filterData = dataSource;
    let flag = false;
    const keyArr = [];
    let tmpds = [];
    const dataPush = [];
    Object.keys(filterFunc).forEach((key) => {
      const filter = filterFunc[key];
      filterData = dataSource;
      if (filter != null) {
        flag = true;
        filterData = filterData.filter(filter);
        if (filterData.length > 0) {
          filterData.forEach((s) => {
            if (keyArr.indexOf(s.id) === -1) {
              keyArr.push(s.id);
              dataPush.push(s);
            }
          });
        }
      }
    });
    tmpds = flag ? dataPush.sort((a, b) => a.id - b.id) : dataSource.sort((a, b) => a.id - b.id);
    const columns = [
      {
        title: '测点位置',
        dataIndex: 'stationName',
        key: 'stationName',
        width: '20%',
      },
      {
        title: '监测项',
        dataIndex: 'factorName',
        key: 'factorName',
        width: '20%',
        render: (text, record) => (
          `${record.factorName}/${record.itemName}`
        ),
      },
      {
        title: '毛刺阈值',
        dataIndex: 'params',
        key: 'params',
        width: '20%',
        render: (text) => text.thr_burr,
      },
      {
        title: '启用状态',
        dataIndex: 'enabled',
        key: 'enabled',
        width: '20%',
        render: (text, record) => (
          record.enabled ? <Tag color="blue">已启用</Tag> : <Tag>已禁用</Tag>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: '20%',
        render: (text, record) => (
          <span>
            <Button onClick={(e) => this.compareAndEdit(e, record)} type="link">编辑</Button>

            <Divider type="vertical" />
            <Popconfirm title="确认删除该参数配置?" id={record.id} onConfirm={() => { this.removeItem(record.id); }}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <Card style={{ marginTop: 15 }}>
        <Form ref={this.formRef} style={{ marginBottom: 15 }} layout="inline">
          <Form.Item style={{ marginBottom: 0 }}>
            <Input placeholder="关键词：测点位置、监测项" onChange={this.handleInputChange} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Switch checkedChildren="批量启用" unCheckedChildren="批量禁用" defaultChecked="批量启用" onChange={this.onSwitchChange} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            name="burr-bv1"
            key="burr-bv1"
            rules={[
              { required: true, message: '请输入毛刺阈值' },
              { validator: this.checkNumber },
            ]}
          >
            <Input onChange={(e) => this.batchBurr(e.target.value)} placeholder="毛刺阈值：数字" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button size="default" type="default" onClick={this.batchSave}>批量保存</Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Popconfirm title="确认批量删除选中的参数配置?" onConfirm={this.batchDelete}>
              <Button style={{ fontSize: 13 }} type="default">批量删除</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
        <Table rowSelection={rowSelection} columns={columns} dataSource={tmpds} />
        {modalVisible ? (
          <BurrModal
            structId={structId}
            visible
            closeModal={this.modalCancel}
            modalData={modalData}
          />
        ) : ''}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  const { abnParamList } = state;
  const { isRequesting } = abnParamList;

  return {
    isRequesting, // 请求状态
    abnParamList: abnParamList.data || [],
  };
}
export default connect(mapStateToProps)(Burr);
