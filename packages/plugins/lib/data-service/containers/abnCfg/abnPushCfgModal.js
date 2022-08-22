/**
 * update by zhouxin on 2018/8/20.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Tooltip, Select, Checkbox, Modal, Alert,
} from 'antd';
import { PinyinHelper } from '@peace/utils';
import { getProjectList, getStructsList, getReceiverList } from '../../actions/alarm-strategy-modal';
import { getPushList, editPushCfg, addPushCfg } from '../../actions/abnPushCfg';

const FormItem = Form.Item;
const { Option } = Select;

class AbnPushCfgModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverList: [],
      structuresDisabled: true,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { dispatch, user } = this.props;
    dispatch(getProjectList(user?.id));
    dispatch(getReceiverList(user?.orgId));
    this.initForm();
  }

  // 表单类
  btnFormSubmit = () => {
    const form = this.formRef.current;
    const {
      dispatch, isEdit, closeModal, modalData, user,
    } = this.props;
    if (isEdit) {
      form.validateFields().then((values) => {
        let categoriesArr = [];
        let structuresArr = [];
        for (const i in values.categories) {
          if (values.categories[i] != 'all') {
            categoriesArr.push(parseInt(values.categories[i]));
          } else {
            categoriesArr = [1, 2];
            break;
          }
        }

        for (const i in values.structures) {
          if (values.structures[i] != 'all') {
            if (!structuresArr.includes(parseInt(values.structures[i]))) {
              structuresArr.push(parseInt(values.structures[i]));
            }
          } else {
            structuresArr = [];
            for (const s of this.props.abnPushModal.structList) {
              if (s.hasAbnReportParams) {
                structuresArr.push(s.id);
              }
            }
            // structuresArr = this.props.abnPushModal.structList.map(
            //     k => {
            //         return k.id;
            //     }
            // );
            break;
          }
        }

        const data = {
          noticedUser: parseInt(values.receiver),
          structures: structuresArr,
          enabled: values.isEnable,
        };

        dispatch(editPushCfg(modalData.id, data)).then(() => {
          dispatch(getPushList(user.orgId)).then(() => {
            closeModal();
          });
        });
      });
    } else {
      // 新增
      form.validateFields().then((values) => {
        let categoriesArr = [];
        let structuresArr = [];
        for (const i in values.categories) {
          if (values.categories[i] != 'all') {
            categoriesArr.push(parseInt(values.categories[i]));
          } else {
            categoriesArr = [1, 2];
            break;
          }
        }
        for (const i in values.structures) {
          if (values.structures[i] != 'all') {
            structuresArr.push(parseInt(values.structures[i]));
          } else {
            structuresArr = [];
            for (const s of this.props.abnPushModal.structList) {
              if (s.hasAbnReportParams) {
                structuresArr.push(s.id);
              }
            }
            break;
          }
        }

        const data = {
          noticedUser: parseInt(values.receiver),
          structures: structuresArr,
          enabled: values.isEnable ? values.isEnable : false,
        };
        dispatch(addPushCfg(user.orgId, data)).then(() => {
          dispatch(getPushList(user.orgId)).then(() => {
            closeModal();
          });
        });
      });
    }
  };

  projectChange = (val) => {
    const { getFieldValue, setFieldsValue } = this.formRef.current;
    const { dispatch, abnPushModal, user } = this.props;
    let structuresDisabled = true;
    if (val.length > 0) {
      structuresDisabled = false;
    }

    if (val.includes('all')) {
      const data = abnPushModal.projectList;
      val = data.map((k) => k.projects[0].id);
    }
    dispatch(getStructsList(user.orgId, val));
    // setFieldsValue({ structures: [] });
    const nextStructuresValue = [];
    const currSelectedStructures = getFieldValue('structures');
    for (const sid of currSelectedStructures) {
      if (abnPushModal.structList.find((s) => s.id == sid).projects.some((p) => val.some((vpid) => vpid == p.id))) {
        nextStructuresValue.push(sid);
      }
    }
    setFieldsValue({ structures: nextStructuresValue });
    this.setState({ structuresDisabled });
  };

  initForm = () => {
    const form = this.formRef.current;
    if (this.props.isEdit) {
      const data = this.props.modalData;
      const hasPush = [];
      for (const j in data.projects) {
        for (const i in data.projects[j].structures) {
          const temp = data.projects[j].structures[i];
          if (!hasPush.includes(temp.id)) {
            // structures.push({ label: temp.name, key: temp.id });
            hasPush.push(temp.id);
          }
        }
      }
      const projectsArr = data.projects.map((val) => val.id);
      this.props.dispatch(getStructsList(this.props.user.orgId, projectsArr));
      form.setFieldsValue({
        project: data.projects.map((val) => val.id),
        structures: hasPush,
        receiver: data.noticedUser.map((val) =>
        // return {
        //   key: val.id,
        //   label: val.name
        // };
          val.id),
        isEnable: data.enabled,
      });
      this.setState({
        structuresDisabled: false,
      });
    } else {
      form.setFieldsValue({
        project: [],
        structures: [],
        receiver: [],
      });
    }
  };

  // 选择器子选项格式化
  selectProjectList = () => {
    const selectChildProjects = [<Option key="all">全部</Option>];
    if (!this.props.abnPushModal.projectList.length > 0) {
      return;
    }
    for (const i in this.props.abnPushModal.projectList) {
      selectChildProjects.push(<Option key={this.props.abnPushModal.projectList[i].projects[0].id} value={this.props.abnPushModal.projectList[i].projects[0].id}>
        {this.props.abnPushModal.projectList[i].projects[0].name}
      </Option>);
    }
    return selectChildProjects;
  };

  selectStructList = () => {
    if (!this.props.abnPushModal.structList.length > 0) {
      return;
    }
    const selectChildStruct = [<Option key="all" disabled={!this.props.abnPushModal.structList.some((s) => s.hasAbnReportParams)}>全部</Option>];
    for (const i in this.props.abnPushModal.structList) {
      selectChildStruct.push(
        <Option
          key={this.props.abnPushModal.structList[i].id}
          value={this.props.abnPushModal.structList[i].id}
          disabled={!this.props.abnPushModal.structList[i].hasAbnReportParams}
        >
          {this.props.abnPushModal.structList[i].name}
        </Option>,
      );
    }
    return selectChildStruct;
  };

  selectReceiverList = () => {
    let selectChildReceiver = [];
    const { abnPushModal, modalData } = this.props;
    if (!abnPushModal.receiverList.length > 0) {
      return;
    }

    const receiverList = [];
    abnPushModal.receiverList.forEach((item) => {
      if (Array.isArray(item.members)) {
        item.members.forEach((v) => {
          receiverList.push({
            id: v.id,
            name: v.name,
            isDisabled: !((!!v.phone || !!v.email || !!v.openId
                          || (modalData && modalData.noticedUser && modalData.noticedUser === v.id))),
            departmentName: v.departmentName,
            phone: v.phone,
            email: v.email,
          });
        });
      }
    });

    for (let i = 0; i < receiverList.length; i++) {
      for (let j = i + 1; j < receiverList.length; j++) {
        if (receiverList[i].name === receiverList[j].name) {
          receiverList[i].hasSameName = true;
          receiverList[j].hasSameName = true;
          continue;
        }
      }
    }

    this.state.receiverList = receiverList;
    selectChildReceiver = receiverList.map((receiver) => (
      <Option key={receiver.id} disabled={receiver.isDisabled} title={receiver.name} value={receiver.id}>
        <Tooltip
          title={(
            <div>
              <div>
                手机号：
                {receiver.phone}
              </div>
              <div>
                邮箱：
                {receiver.email}
              </div>
              <div>
                部门：
                {receiver.departmentName}
              </div>
            </div>
)}
          placement="right"
        >
          {receiver.name}
        </Tooltip>
      </Option>
    ));
    return selectChildReceiver;
  };

  filterOption = (inputValue, option) => {
    const { children } = option.props;
    return (
      children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
            || PinyinHelper.isPinyinMatched(children, inputValue)
    );
  };

  render() {
    const { abnPushModal } = this.props;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
    };
    const tailFormItemLayout = {
      wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 24, offset: 0 } },
    };

    return (
      <div>
        <Modal
          maskClosable={false}
          title={this.props.isEdit ? '修改异常推送策略' : '添加异常推送策略'}
          visible={this.props.visible}
          onOk={this.btnFormSubmit}
          onCancel={this.props.closeModal}
          width={600}
          loading
        >
          <Form ref={this.formRef}>
            <FormItem
              {...formItemLayout}
              label="接收人"
              name="receiver"
              rules={[{ required: true, message: '请选择接收人' }]}
            >

              <Select
                style={{ width: '100%' }}
                placeholder="请选择接收人"
                filterOption={(input, option) => option.props.children.props.children
                  .toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.selectReceiverList()}
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="项目"
              name="project"
              rules={[{ required: true, message: '请选择项目' }]}
            >

              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择项目"
                filterOption={this.filterOption}
                onChange={this.projectChange}
              >
                {this.selectProjectList()}
              </Select>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="结构物"
              extra="请选择已经在数据计算的异常数据识别功能中配置了参数的结构物"
              name="structures"
              rules={[{ required: true, message: '请选择结构物' }]}
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择结构物"
                disabled={this.state.structuresDisabled}
                filterOption={this.filterOption}
              >
                {this.selectStructList()}
              </Select>
            </FormItem>
            <FormItem {...tailFormItemLayout} name="isEnable" valuePropName="checked">
              <Checkbox>启用</Checkbox>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    auth, analysisStrategyProjectList, analysisStructsList, analysisStrategyReceiverList, pushCfgList,
  } = state;
  return {
    // all: state,
    user: auth.user,
    abnPushModal: {
      projectList: analysisStrategyProjectList.data || [],
      structList: analysisStructsList.data || [],
      receiverList: analysisStrategyReceiverList.data || [],
      pushCfgList: pushCfgList.data || [],
    },
  };
}
export default connect(mapStateToProps)(AbnPushCfgModal);
