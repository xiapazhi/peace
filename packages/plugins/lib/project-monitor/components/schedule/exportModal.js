import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PinyinHelper } from '@peace/utils';
import {
  Modal, Form, Select, DatePicker, Checkbox,
} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
class ExportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
    this.formRef = React.createRef();
  }

  handleOk = () => {
    // let { startValue, endValue } = this.state;
    const { dispatch, strucList, export_ } = this.props;
    const form = this.formRef.current;
    // if (!startValue || !endValue) {
    //     return message.error("请选择时间范围")
    // }
    form.validateFields().then((values) => {
      const startTime = moment(values.dateRange[0]).format('YYYY-MM-DD HH:mm:ss');
      const endTime = moment(values.dateRange[1]).format('YYYY-MM-DD HH:mm:ss');
      const postData = {
        startTime,
        endTime,
        strucIds: values.structs,
        calendarType: values.calendarType,
      };
      export_(postData);
      this.handleCancel();
    });
  };

  handleCancel = () => {
    const { resetFields } = this.formRef.current;
    this.props.closeModal();
    // this.setState({ startValue: null, endValue: null })
    resetFields();
  };

  // disabledStartDate = (startValue) => {
  //     const endValue = this.state.endValue;
  //     if (!startValue || !endValue) {
  //         return false;
  //     }
  //     return startValue.valueOf() > endValue.valueOf();
  // }

  // disabledEndDate = (endValue) => {
  //     const startValue = this.state.startValue;
  //     if (!endValue || !startValue) {
  //         return false;
  //     }
  //     return endValue.valueOf() <= startValue.valueOf();
  // }

  // onChange = (field, value) => {
  //     this.setState({
  //         [field]: value,
  //     });
  // }

  // onStartChange = (value, string) => {
  //     this.onChange('startValue', value);
  // }

  // onEndChange = (value) => {
  //     this.onChange('endValue', value);
  // }

  // handleStartOpenChange = (open) => {
  //     if (!open) {
  //         this.setState({ endOpen: true });
  //     }
  // }

  // handleEndOpenChange = (open) => {
  //     this.setState({ endOpen: open });
  // }

  render() {
    const { visible, strucList } = this.props;
    return (
      <Modal
        maskClosable={false}
        title="工程事记批量导出"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        cancelText="取消"
        okText="导出"
        width={500}
      >
        <Form layout="vertical" ref={this.formRef}>
          <FormItem id="structs" name="structs" rules={[{ required: true, message: '不能为空' }]} label="结构物">
            <Select
              mode="multiple"
                        // style={{ width: '100%' }}
              placeholder="请选择结构物"
              showSearch="true"
              optionFilterProp="children"
              filterOption={(input, option) => {
                const { children } = option.props;
                return (
                  children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                || PinyinHelper.isPinyinMatched(children, input)
                );
              }}
            >
              {strucList}
            </Select>
          </FormItem>
          <FormItem
            id="dateRange"
            label="时间范围"
            name="dateRange"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <RangePicker
              showTime
                        // disabledDate={this.disabledStartDate}
              format="YYYY-MM-DD HH:mm:ss"
                        // value={startValue}
              placeholder={['开始时间', '结束时间']}
              onChange={this.onStartChange}
            />
          </FormItem>
          <FormItem
            id="calendarType"
            label="数据范围"
            name="calendarType"
            rules={[
              { required: true, message: '不能为空' },
            ]}
            initialValue={[1, 2, 3, 4, 5]}
          >
            <CheckboxGroup options={[
              { label: '工程进度', value: 1 },
              { label: '人工巡检', value: 2 },
              { label: '集成配置', value: 3 },
              { label: '系统跟踪', value: 4 },
              { label: '重大事件', value: 5 },
            ]}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default connect()(ExportModal);
