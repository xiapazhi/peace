import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Charts } from '@peace/components';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Form, Select, Modal, Input, Button, Switch, DatePicker, Row,
} from 'antd';
import { getAbnParamList, editAbnParams, getItemAbnResultTr } from '../../actions/abnParamCfg';

const { TimeValueLineChart } = Charts;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class TrendModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currStartTime: moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      currEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const data = this.props.modalData;
    const form = this.formRef.current;
    form.setFieldsValue({
      stationName: data.stationName,
      factorName: `${data.factorName}/${data.itemName}`,
      timeRange: `${data.params.days_Last}`,
      burr: data.params.thr_burr,
      ws: data.params.win_med,
      rc: data.params.win_avg,
      dv: data.params.thr_der,
      pn: data.params.win_grad,
      gv: data.params.thr_grad,
      isEnable: data.enabled,
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'GET_ITEM_ABN_TASK_RESULT_TR_CLEAR' });
  }

  // 表单类
  btnFormSubmit = () => {
    const data = this.props.modalData;
    const form = this.formRef.current;
    form.validateFields().then((values) => {
      const paramJson = {
        thr_burr: Number(values.burr), // 毛刺阈值
        win_med: Number(values.ws), // 滑动中值
        win_avg: Number(values.rc), // 滑动均值
        thr_der: Number(values.dv), // 导数阈值
        win_grad: Number(values.pn), // 渐变点个数
        thr_grad: Number(values.gv), // 渐变阈值
        days_Last: Number(values.timeRange), // 分析时长
      };
      const pushData = {
        station: data.stationId, // 测点
        factorId: data.factorId,
        itemId: data.itemId,
        abnType: 3, // 异常趋势
        enabled: values.isEnable,
        params: paramJson,
      };
      this.props.dispatch(editAbnParams(data.id, pushData)).then((_) => {
        this.props.dispatch(getAbnParamList(this.props.structId)).then(() => {
          this.props.closeModal();
        });
      });
    });
  };

  checkInterger = async (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    const pattern = /^[1-9]*[1-9][0-9]*$/;
    if (pattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入正整数'));
  };

  timeOnChange = (dates, dateStrings) => {
    if (dates.length == 0) {
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
    const form = this.formRef.current;
    form.validateFields().then((values) => {
      const paramJson = {
        thr_burr: values.burr, // 毛刺阈值
        win_med: values.ws, // 滑动中值
        win_avg: values.rc, // 滑动均值
        thr_der: values.dv, // 导数阈值
        win_grad: values.pn, // 渐变点个数
        thr_grad: values.gv, // 渐变阈值
        days_Last: values.timeRange, // 分析时长
      };
      const data = {
        station: this.props.modalData.stationId,
        factorId: this.props.modalData.factorId,
        itemId: this.props.modalData.itemId,
        abnType: 'trend', // 算法类型
        enabled: true,
        params: paramJson,
      };
      const start = this.state.currStartTime;
      const end = this.state.currEndTime;
      this.props.dispatch(getItemAbnResultTr(this.props.structId, start, end, data)).then((res) => {
      });
    });
  };

  checkPoint = async (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    const pattern = /^[1-9]*[1-9][0-9]*$/;
    if (pattern.test(value) && value != 1) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入大于1的正整数'));
  };

  checkNumber = (rule, value, callback) => {
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
    const { abnItemCompData } = this.props;
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
      if (calcArray) {
        const preLineData = calcArray.calcPreprocess;
        const abnTrends = calcArray.calcFinal;
        for (let j = 0; j < preLineData.length; j++) {
          const one = { name: '预处理+滑动均值后数据', value: preLineData[j].value, time: preLineData[j].time };
          stationsData.push(one);
        }
        for (let t = 0; t < abnTrends.length; t++) {
          const name = `${abnTrends[t].startTime}至${abnTrends[t].endTime}${abnTrends[t].des}，渐变差值：${abnTrends[t].value.toFixed(2)}${abnItemCompData.unit}`;
          const start = { name, value: abnTrends[t].startValue, time: abnTrends[t].startTime };
          const end = { name, value: abnTrends[t].endValue, time: abnTrends[t].endTime };
          stationsData.push(start);
          stationsData.push(end);
        }
      }
    }
    return (
      <div>
        <Modal
          title="异常参数编辑"
          maskClosable={false}
          visible={this.props.visible}
          onCancel={this.props.closeModal}
          width={1000}
          destroyOnClose
          footer={[<div>
            <Button type="primary" htmlType="submit" onClick={this.btnFormSubmit}>保存</Button>
            <Button key="cancel" onClick={this.props.closeModal}>关闭</Button>
                   </div>]}
        >
          <Form ref={this.formRef} layout="inline">
            <Row>
              <FormItem
                name="stationName"
                key="stationName"
                rules={[{ required: true, message: '测点位置' }]}
              >
                <Input disabled />
              </FormItem>

              <FormItem
                name="factorName"
                key="factorName"
                rules={[{ required: true, message: '监测因素' }]}
              >
                <Input disabled />
              </FormItem>

              <FormItem
                name="isEnable"
                key="isEnable"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked="启用" />
              </FormItem>

              <FormItem
                label="分析时长："
                name="timeRange"
                key="timeRange"
                rules={[{ required: true, message: '请选择分析时长' }]}
              >
                <Select style={{ width: 100 }} placeholder="请选择分析时长">
                  <Select.Option key="1" value="1">1个月</Select.Option>
                  <Select.Option key="2" value="2"> 2个月</Select.Option>
                  <Select.Option key="3" value="3">3个月</Select.Option>
                </Select>
              </FormItem>
            </Row>

            <Row style={{ marginTop: 18 }}>
              <FormItem
                label="毛刺阈值："
                name="burr"
                key="burr"
                rules={[
                  { required: true, message: '请输入毛刺阈值' },
                  { validator: this.checkNumber },
                ]}
              >
                <Input placeholder="毛刺阈值：数字" />
              </FormItem>

              <FormItem
                label="滑动中值："
                name="ws"
                key="ws"
                rules={[
                  { required: true, message: '请输入滑动中值' },
                  { validator: this.checkInterger },
                ]}
              >
                <Input placeholder="滑动中值：正值" />
              </FormItem>

              <FormItem
                label="滑动均值："
                name="rc"
                key="rc"
                rules={[
                  { required: true, message: '请输入滑动均值' },
                  { validator: this.checkInterger },
                ]}
              >
                <Input placeholder="滑动均值：正值" />
              </FormItem>
            </Row>

            <Row style={{ marginTop: 18 }}>
              <FormItem
                label="导数阈值："
                name="dv"
                key="dv"
                rules={[
                  { required: true, message: '请输入导数阈值' },
                  { validator: this.checkNumber },
                ]}
              >
                <Input placeholder="导数阈值：数字" />
              </FormItem>

              <FormItem
                label="渐变点数："
                name="pn"
                key="pn"
                rules={[
                  { required: true, message: '请输入渐变点个数' },
                  { validator: this.checkPoint },
                ]}
              >
                <Input placeholder="渐变点个数：正值" />
              </FormItem>

              <FormItem
                label="渐变阈值："
                name="gv"
                key="gv"
                rules={[
                  { required: true, message: '请输入渐变阈值' },
                  { validator: this.checkNumber },
                ]}
              >
                <Input placeholder="渐变阈值：数字" />
              </FormItem>
            </Row>

            <Row style={{ marginTop: 28 }}>
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
                      key="trend"
                      contentType="trend"
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
  const { abnItemStateTr } = state;
  return {
    abnItemCompData: abnItemStateTr.data,
  };
}

export default connect(mapStateToProps)(TrendModal);
