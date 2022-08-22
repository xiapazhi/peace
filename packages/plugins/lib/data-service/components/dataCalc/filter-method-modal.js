import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Charts } from '@peace/components';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Form, Cascader, Select, Modal, Input, Button, Tooltip, DatePicker, Row, Col, Alert, message, Popconfirm,
} from 'antd';
import {
  createAbnFilterCfg, updateAbnFilterCfg, getAbnFilterCfgs, getAbnFilterTaskResult, updateFilterData,
} from '../../actions/abnFilterCfg';

const { TimeValueLineChart } = Charts;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

const CalcMedian = 1;// 取中值
const LimitAmp = 2;// 限幅
const CalcMeanValue = 3;// 滑动平均
const CalcStvMean = 4;// 方差判断平均
const CalcWindow = 5;// 滤波算法
const ExtreAverage = 6;// 去极值移动平均
const WeightAverage = 7;// 加权滑动平均
const MedianMean = 8;// 中值平均
const RangeMean = 9;// 限幅平均

class FilterMethodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      methodType: 'single',
      methodId: null,
      currStartTime: moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      currEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),

      currDataStartTime: null,
      currDataEndTime: null,
      currDataStationId: null,
      currDataInputParams: null,
      currDataMethodId: null,
      currDataData: null,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { modalData } = this.props;
    const data = modalData;
    const form = this.formRef.current;
    if (data) {
      const paramToshow = this.setValueList(data);
      form.setFieldsValue({
        factorStation: `${data.factorName}/${data.itemName}/${data.stationName}`,
        method: [data.methodType, data.methodId],
        params: paramToshow,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'GET_ABN_FILTER_RESULT_CLEAR' });
  }

  setValueList = (data) => {
    let parList = '';
    switch (data.methodId) {
      case MedianMean:
      case WeightAverage:
      case CalcMeanValue:
      case CalcMedian:
        parList = `${data.windowSize}`;
        break;
      case LimitAmp:
        parList = `${data.params.Kt}`;
        break;
      case CalcStvMean:
        parList = `${data.params.Ru}，${data.windowSize}`;
        break;
      case CalcWindow:
        parList = `${data.params.Dt}，${data.params.Kt}，${+data.params.Rt}，${data.windowSize}`;
        break;
      case ExtreAverage:
        parList = `${data.params.Ru}，${data.params.Kt}，${data.windowSize}`;
        break;
      case RangeMean:
        parList = `${data.params.Kt}，${data.windowSize}`;
        break;
      default:
        break;
    }
    return parList;
  };

  // 保存配置
  enableAlgorithm = () => {
    const {
      dispatch, modalData, methods, structId, closeModal, filterCfgs, factorId, itemId,
    } = this.props;
    const { methodId, methodType } = this.state;
    const data = modalData;
    const form = this.formRef.current;
    form.validateFields().then((values) => {
      const stationId = values.station;
      const inputParams = values.params.split('，');// 中文
      const pushData = this.stitchParas(data, stationId, methodId, inputParams);

      if (data) { // 编辑保存
        dispatch(updateAbnFilterCfg(data.id, pushData)).then((_) => {
          dispatch(getAbnFilterCfgs(structId)).then(() => {
            closeModal();
          });
        });
      } else {
        // 新增时判断是否已存在该测点在该监测项,该算法下参数配置
        const cfg = filterCfgs && filterCfgs.find((a) => a.factorId === factorId && a.itemId === itemId
                    && a.stationId === stationId && a.methodId === methodId);
        if (!cfg) {
          dispatch(createAbnFilterCfg(pushData)).then(() => {
            dispatch(getAbnFilterCfgs(structId)).then(() => {
              closeModal();
            });
          });
        } else {
          const method = methods[methodType].filter((m) => m.id === methodId)[0].name;
          message.warning(`已存在该测点在选中监测项下的${method}配置！`);
        }
      }
    });
  };

  stitchParas = (editData, stationId, methodId, inputParams) => {
    const { factorId, itemId } = this.props;
    const mid = editData ? editData.methodId : methodId;
    let data = {};
    switch (parseInt(mid, 10)) {
      case MedianMean:
      case WeightAverage:
      case CalcMeanValue:
      case CalcMedian:
        data = {
          stationId: editData ? editData.stationId : stationId,
          factorId: editData ? editData.factorId : factorId,
          itemId: editData ? editData.itemId : itemId,
          methodId: editData ? editData.methodId : methodId,
          windowSize: inputParams[0],
          params: null,
          enable: true,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        break;
      case LimitAmp:
        data = {
          stationId: editData ? editData.stationId : stationId,
          factorId: editData ? editData.factorId : factorId,
          itemId: editData ? editData.itemId : itemId,
          methodId: editData ? editData.methodId : methodId,
          windowSize: 1, // 限幅 窗口规定为1
          params: { Kt: inputParams[0] },
          enable: true,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        break;
      case CalcStvMean:
        data = {
          stationId: editData ? editData.stationId : stationId,
          factorId: editData ? editData.factorId : factorId,
          itemId: editData ? editData.itemId : itemId,
          methodId: editData ? editData.methodId : methodId,
          windowSize: inputParams[1],
          params: { Ru: inputParams[0] },
          enable: true,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        break;
      case CalcWindow:
        data = {
          stationId: editData ? editData.stationId : stationId,
          factorId: editData ? editData.factorId : factorId,
          itemId: editData ? editData.itemId : itemId,
          methodId: editData ? editData.methodId : methodId,
          windowSize: inputParams[3],
          params: { Kt: inputParams[1], Dt: inputParams[0], Rt: inputParams[2] },
          enable: true,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        break;
      case ExtreAverage:
        data = {
          stationId: editData ? editData.stationId : stationId,
          factorId: editData ? editData.factorId : factorId,
          itemId: editData ? editData.itemId : itemId,
          methodId: editData ? editData.methodId : methodId,
          windowSize: inputParams[2],
          params: { Ru: inputParams[0], Kt: inputParams[1] },
          enable: true,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        break;
      case RangeMean:
        data = {
          stationId: editData ? editData.stationId : stationId,
          factorId: editData ? editData.factorId : factorId,
          itemId: editData ? editData.itemId : itemId,
          methodId: editData ? editData.methodId : methodId,
          windowSize: inputParams[1],
          params: { Kt: inputParams[0] },
          enable: true,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        break;
      default:
        break;
    }
    return data;
  };

  judgeParType = (methodId, parNow2) => {
    let parList = true;
    let par2 = true;
    let par3 = true;
    let par4 = true;
    switch (parseInt(methodId, 10)) {
      case MedianMean:
      case WeightAverage:
      case CalcMeanValue:
      case CalcMedian:
        parList = this.textValidate(parNow2[0], '正整数');
        break;
      case LimitAmp:
        parList = this.textValidate(parNow2[0], '正数');
        break;
      case CalcStvMean:
        parList = this.textValidate(parNow2[0], '正数');
        par2 = this.textValidate(parNow2[1], '正整数');
        break;
      case CalcWindow:
        parList = this.textValidate(parNow2[0], '正整数');
        par2 = this.textValidate(parNow2[1], '正数');
        par3 = this.textValidate(parNow2[2], '正整数');
        par4 = this.textValidate(parNow2[3], '正整数');
        break;
      case ExtreAverage:
        parList = this.textValidate(parNow2[0], '数字');
        par2 = this.textValidate(parNow2[1], '数字');
        par3 = this.textValidate(parNow2[2], '正整数');
        break;
      case RangeMean:
        parList = this.textValidate(parNow2[0], '正数');
        par2 = this.textValidate(parNow2[1], '正整数');
        break;
      default:
        break;
    }
    if (parList && par2 && par3 && par4) {
      return true;
    }
    return false;
  };

  textValidate = (value, type) => {
    let reg = '';

    if (type === '数字') {
      reg = /^-?\d+(\.\d+)?$/;
    } else if (type === '正整数') {
      reg = /^[1-9]\d*$/;
    } else if (type === '正数') {
      reg = /^\d+(\.\d+)?$/;
    } else {
      return true;
    }
    return reg.test(value);
  };

  checkParams = async (rule, value) => {
    const { modalData, methods } = this.props;
    const { methodType, methodId } = this.state;
    if (value) {
      const data = modalData;
      let params;
      let valueResult;
      const inputParam = value.split('，');// 中文
      if (data) { // 编辑时验证的
        params = methods[data.methodType].filter((m) => m.id === data.methodId) || [];
        valueResult = this.judgeParType(data.methodId, inputParam);
      } else {
        params = methods[methodType].filter((m) => m.id === methodId) || [];
        valueResult = this.judgeParType(methodId, inputParam);
      }
      const paramNumber = JSON.stringify(params.length && params[0].params).split(',').length;
      if (inputParam.length !== paramNumber) {
        throw new Error('请录入相同个数的参数值');
      }
      if (!valueResult) {
        throw new Error('请录入对应类型的参数值');
      }
    }
  };

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
    const { dispatch, modalData } = this.props;
    const { methodId, currStartTime, currEndTime } = this.state;
    const data = modalData;
    const form = this.formRef.current;
    form.validateFields().then((values) => {
      const stationId = values.station;
      const inputParams = values.params.split('，');// 中文
      const pushData = this.stitchParas(data, stationId, methodId, inputParams);
      const start = currStartTime;
      const end = currEndTime;
      dispatch(getAbnFilterTaskResult(start, end, pushData)).then((res) => {
        if (res.type === 'GET_ABN_FILTER_RESULT_SUCCESS') {
          this.setState({
            currDataStartTime: start,
            currDataEndTime: end,
            currDataStationId: stationId,
            currDataInputParams: inputParams,
            currDataMethodId: methodId,
            currDataData: data,
          });
        } else if (res.type === 'GET_ABN_FILTER_RESULT_ERROR') {
          const error = res.payload.error === 'unstable window' ? '输入参数不能满足计算要求！' : res.payload.error;
          message.error(error);
        }
      });
    });
  };

  // 更新数据
  updateData = () => {
    const {
      dispatch, modalData, abnFilterCompData, structId, factorId,
    } = this.props;
    const editData = modalData;
    const {
      currDataStartTime, currDataEndTime, currDataStationId, currDataInputParams, currDataMethodId, currDataData,
    } = this.state;
    const form = this.formRef.current;
    form.validateFields().then((values) => {
      const stationId = values.station;
      const data = abnFilterCompData;
      const uploadData = {
        structId,
        factorId,
        stationId: editData ? editData.stationId : stationId,
        itemKey: data.itemKey,
        // calcFilterData: data.calcData,
        startTime: currDataStartTime,
        endTime: currDataEndTime,
        config: this.stitchParas(currDataData, currDataStationId, currDataMethodId, currDataInputParams),
      };
      dispatch(updateFilterData(uploadData));
    });
  };

  renderFactorAndItems = () => {
    const { factors } = this.props;
    const newData = [];
    if (factors) {
      factors.forEach((s) => {
        if (s.checked) {
          newData.push({
            value: s.id,
            label: s.name,
            children: s.items.map((k) => ({ key: k.id, value: k.id, label: k.name })),
          });
        }
      });
    }
    return newData;
  };

  renderMethods = () => {
    const { methods } = this.props;
    const methodArray = [];
    if (methods) {
      methodArray.push({
        value: 'single',
        label: '单一方法',
        children: methods.single.map((k) => ({ key: k.id, value: k.id, label: k.name })),
      });
      methodArray.push({
        value: 'composite',
        label: '复合方法',
        children: methods.composite.map((k) => ({ key: k.id, value: k.id, label: k.name })),
      });
    }
    return methodArray;
  };

  onFilFactorChange = (value) => {
    const { filFactorChange } = this.props;
    filFactorChange(value);
  };

  methodChange = (value) => {
    this.setState({
      methodType: value[0],
      methodId: value[1],
    });
  };

  getPlaceholder = () => {
    const { methods, modalData } = this.props;
    const { methodId, methodType } = this.state;
    let string = '选择算法后输入';
    if (methodId && methods[methodType].filter((m) => m.id === methodId).length > 0) {
      const { params } = methods[methodType].filter((m) => m.id === methodId)[0];
      string = JSON.stringify(params);
    }
    const data = modalData;
    if (data) {
      const paramsEdit = methods[data.methodType].filter((m) => m.id === data.methodId)[0].params;
      string = JSON.stringify(paramsEdit);
    }
    return string;
  };

  render() {
    const {
      abnFilterCompData, modalData, visible, closeModal, factorId, itemId, stations,
    } = this.props;
    let dataArray = ['还没查询']; let itemName; let start; let
      end;
    const stationsData = [];
    if (abnFilterCompData) {
      dataArray = abnFilterCompData.calcData;
      itemName = abnFilterCompData.itemName;
      start = dataArray && dataArray.length > 0 ? dataArray[0].time : '';
      end = dataArray && dataArray.length > 0 ? dataArray[dataArray.length - 1].time : '';

      for (let i = 0; i < dataArray.length; i++) {
        const one = { name: `${itemName}（单位：${abnFilterCompData.unit}）`, value: dataArray[i].keyData, time: dataArray[i].time };
        stationsData.push(one);
      }
      for (let i = 0; i < dataArray.length; i++) {
        const one = { name: '处理后数据', value: dataArray[i].calcData, time: dataArray[i].time };
        stationsData.push(one);
      }
    }
    const toShowChart = dataArray && dataArray[0] !== '还没查询' && dataArray.length > 0;
    const title = modalData ? '编辑过滤算法' : '添加过滤算法';
    return (
      <div>
        <Modal
          maskClosable={false}
          title={title}
          visible={visible}
          onCancel={closeModal}
          width="70%"
          footer={
            <Button key="cancel" onClick={closeModal}>关闭</Button>
          }
        >
          <Form ref={this.formRef} layout="inline">
            <Alert
              style={{ marginBottom: 25 }}
              message='参数填写规则：多个参数间用中文输入法下的逗号隔开。如：参数输入框提示{"窗口":"正整数","波幅":"正数"}，则录入正整数，正数'
              type="warning"
              showIcon
            />
            <Row style={{ marginBottom: 25 }}>
              {
                            modalData
                              ? (
                                <FormItem
                                  name="factorStation"
                                  key="factorStation"
                                >
                                  <Input style={{ width: 180 }} id="factorStation" disabled />
                                </FormItem>
                              )
                              : (
                                <FormItem>
                                  <Cascader
                                    id="factorAndItem"
                                    value={[factorId, itemId]}
                                    onChange={this.onFilFactorChange}
                                    style={{ textAlign: 'left', width: 180 }}
                                    options={this.renderFactorAndItems()}
                                    placeholder="请选择监测项"
                                  />
                                </FormItem>
                              )
                        }
              {
                            !modalData
                              ? (
                                <FormItem
                                  name="station"
                                  key="station"
                                  rules={[{ required: true, message: '请选择测点' }]}
                                >
                                  <Select placeholder="请选择" style={{ height: 32, width: 180 }}>
                                    {
                                            stations ? stations.map((s) => <Option key={s.id} value={s.id}>{s.name}</Option>) : []
                                        }
                                  </Select>
                                </FormItem>
                              )
                              : ''
                        }
              <FormItem
                name="method"
                key="method"
                rules={[{ required: true, message: '请选择过滤算法' }]}
              >
                <Cascader
                  id="method"
                  disabled={!!modalData}
                  onChange={this.methodChange}
                  style={{ textAlign: 'left', width: 180 }}
                  options={this.renderMethods()}
                  placeholder="请选择过滤算法"
                />
              </FormItem>
              <Tooltip placement="topLeft" title={this.getPlaceholder()}>
                <FormItem
                  name="params"
                  key="params"
                  rules={[
                    { required: true, message: '请输入参数' },
                    { validator: this.checkParams },
                  ]}
                >
                  <Input
                    style={{ width: 180 }}
                    placeholder={this.getPlaceholder()}
                  />

                </FormItem>
              </Tooltip>
            </Row>

            <Row style={{ marginBottom: 25, width: '100%' }}>
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
              <Form.Item>
                <Button size="default" type="default" onClick={this.dataCompare}>结果预览</Button>
              </Form.Item>
              <Form.Item>
                <Popconfirm title="此功能会替换之前数据，确认继续更新数据?" onConfirm={this.updateData}>
                  <Button
                    size="default"
                    type="default"
                    disabled={!toShowChart}
                  >
                    更新数据
                  </Button>
                </Popconfirm>
              </Form.Item>
              <Form.Item>
                <Button size="default" type="primary" onClick={this.enableAlgorithm}>保存配置</Button>
              </Form.Item>
            </Row>

            <div className="data-chart-container" style={{ width: '100%' }}>
              {dataArray && dataArray[0] == '还没查询'
                ? (
                  <div style={{ margin: '30px 0' }}>
                    <InfoCircleOutlined />
                    输入参数，点击结果预览展示数据对比图
                  </div>
                )
                : toShowChart
                  ? (
                    <TimeValueLineChart
                      key="dataCalc"
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
  const {
    thresholdFactorList, thresholdStationList, abnFilterCalcState, abnFilterConfig,
  } = state;
  return {
    factors: thresholdFactorList.data ? thresholdFactorList.data.filter((s) => s.proto !== 2002 && s.proto !== 5001 && s.proto !== 5002) : [],
    stations: thresholdStationList.data, // 测点
    abnFilterCompData: abnFilterCalcState.data,
    filterCfgs: abnFilterConfig.data,
  };
}

export default connect(mapStateToProps)(FilterMethodModal);
