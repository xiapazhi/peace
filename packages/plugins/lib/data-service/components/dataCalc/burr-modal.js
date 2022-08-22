import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Charts } from '@peace/components';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Form, Modal, Input, Button, Switch, DatePicker, Row, message,
} from 'antd';
import { getAbnParamList, editAbnParams, getItemAbnResultBurr } from '../../actions/abnParamCfg';

const { TimeValueLineChart } = Charts;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class BurrModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currStartTime: moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      currEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { modalData } = this.props;

    const form = this.formRef.current;
    form.setFieldsValue({
      stationName: modalData.stationName,
      factorName: `${modalData.factorName}/${modalData.itemName}`,
      burr: modalData.params.thr_burr,
      isEnable: modalData.enabled,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'GET_ITEM_ABN_TASK_RESULT_BURR_CLEAR' });
  }

  // 表单类
  btnFormSubmit = () => {
    const {
      dispatch, modalData, structId, closeModal,
    } = this.props;

    const form = this.formRef.current;
    form.validateFields().then((values) => {
      const paramJson = { thr_burr: Number(values.burr) };
      const pushData = {
        station: modalData.stationId, // 测点
        factorId: modalData.factorId,
        itemId: modalData.itemId,
        abnType: 2, // 毛刺
        enabled: values.isEnable,
        params: paramJson,
      };
      dispatch(editAbnParams(modalData.id, pushData)).then((_) => {
        dispatch(getAbnParamList(structId)).then(() => {
          closeModal();
        });
      });
    });
  };

  // checkInterger = async (rule, value, callback) => {
  //   if (!value) {
  //     callback();
  //   } else {
  //     const pattern = /^[1-9]*[1-9][0-9]*$/;
  //     if (pattern.test(value)) {
  //       callback();
  //     } else {
  //       callback(new Error('请输入正整数'));
  //     }
  //   }
  // };

  timeOnChange = (dates, dateStrings) => {
    if (dates.length === 0) {
      this.setState({
        currStartTime: null,
        currEndTime: null,
      });
      return message.warning('请选择时间');
    }
    this.setState({
      currStartTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      currEndTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  // 数据对比
  dataCompare = () => {
    const { dispatch, modalData, structId } = this.props;
    const { currStartTime, currEndTime } = this.state;
    const form = this.formRef.current;
    form.validateFields().then((values) => {
      const paramJson = { thr_burr: values.burr };
      const data = {
        station: modalData.stationId,
        factorId: modalData.factorId,
        itemId: modalData.itemId,
        abnType: 'burr', // 算法类型
        enabled: true,
        params: paramJson,
      };
      const start = currStartTime;
      const end = currEndTime;
      dispatch(getItemAbnResultBurr(structId, start, end, data));
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
    const { abnItemCompData, visible, closeModal } = this.props;
    let originalData = ['还没查询']; let calcArray = []; let key; let itemName; let start; let
      end;
    const stationsData = [];
    if (abnItemCompData) {
      originalData = abnItemCompData.stationData;
      calcArray = abnItemCompData.resultArray;
      key = abnItemCompData.itemKey;
      itemName = abnItemCompData.itemName;
      start = originalData && originalData.length > 0 ? originalData[0].time : '';
      end = originalData && originalData.length > 0 ? originalData[originalData.length - 1].time : '';
      for (let i = 0; i < originalData.length; i++) {
        const one = { name: `${itemName}（单位：${abnItemCompData.unit}）`, value: originalData[i][key], time: originalData[i].time };
        stationsData.push(one);
      }
      for (let j = 0; j < calcArray.length; j++) {
        const one = {
          name: `毛刺点：${calcArray[j].time}（突变大小：${calcArray[j].burr.toFixed(2)}${abnItemCompData.unit}）`,
          value: calcArray[j].value,
          time: calcArray[j].time,
        };
        stationsData.push(one);
      }
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="异常参数编辑"
          visible={visible}
          onCancel={closeModal}
          width={900}
          footer={(
            <div>
              <Button type="primary" htmlType="submit" onClick={this.btnFormSubmit}>保存</Button>
              <Button key="cancel" onClick={closeModal}>关闭</Button>
            </div>
)}
        >
          <Form ref={this.formRef} layout="inline">
            <FormItem
              name="stationName"
              key="stationName"
              rules={[{ required: true, message: '测点位置' }]}
            >
              <Input id="stationName" disabled />
            </FormItem>
            <FormItem
              name="factorName"
              key="factorName"
              rules={[{ required: true, message: '监测因素' }]}
            >
              <Input id="factorName" disabled />
            </FormItem>

            <FormItem
              name="isEnable"
              key="isEnable"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked="启用" />
            </FormItem>
            <FormItem
              label="毛刺阈值："
              name="burr"
              key="burr"
              rules={[
                { required: true, message: '请输入毛刺阈值' },
                { validator: this.checkNumber },
              ]}
            >
              <Input id="burr" placeholder="毛刺阈值：数字" />
            </FormItem>

            <Row style={{ marginTop: 15 }}>
              <FormItem
                name="timeSelected"
                key="timeSelected"
                initialValue={[moment().add(-1, 'days'), moment()]}
              >
                <RangePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  placeholder={['开始时间', '结束时间']}
                  onChange={this.timeOnChange}
                />
              </FormItem>

              <FormItem>
                <Button size="default" type="primary" onClick={this.dataCompare}>数据对比</Button>
              </FormItem>
            </Row>

            <div className="data-chart-container" style={{ width: '100%' }}>
              {originalData && originalData[0] == '还没查询'
                ? (
                  <div style={{ margin: '30px 0' }}>
                    <InfoCircleOutlined />
                    {' '}
                    输入参数，点击数据对比展示数据对比图
                  </div>
                )
                : originalData && originalData[0] != '还没查询' && originalData.length > 0
                  ? (
                    <TimeValueLineChart
                      contentType="burr"
                      data={stationsData}
                      width={300}
                      height={300}
                      itemName={itemName}
                      configs={{ slider: { start, end } }}
                    />
                  )
                  : (
                    <div style={{ margin: '30px 0' }}>
                      <InfoCircleOutlined />
                      {' '}
                      没有查询到任何有效数据！
                    </div>
                  )}
            </div>

          </Form>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { abnItemStateBurr } = state;
  return {
    abnItemCompData: abnItemStateBurr.data,
  };
}

export default connect(mapStateToProps)(BurrModal);
