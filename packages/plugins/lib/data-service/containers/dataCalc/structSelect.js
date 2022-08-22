import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { findDOMNode } from 'react-dom';
import {
  Select, Form, Row, Radio, DatePicker, Button, Tooltip, message,
} from 'antd';
import { Func } from '@peace/utils';
import { getStructures, getFactors, getStations } from '../../actions/common';// 获取结构物
import { getAbnMethods, getAbnParamList, getAbnTaskResult } from '../../actions/abnParamCfg';
import { getAbnFilterCfgs } from '../../actions/abnFilterCfg';
import FactorAndStations from './factorAndStations';

const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const apiUrl = {
  getAbnParamList: 'struct/{id}/abnormal/params',
};

class StructSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'reCalc',
      currStartTime: moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      currEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      showParamsCfg: false,
      stationsValue: [],
      mType: 'interrupt',
    };
    this.formRef = React.createRef();
  }

  UNSAFE_componentWillMount() {
    const {
      dispatch, user, activeKey, setfactorAndStations,
    } = this.props;
    this.setState({ activeKey });
    // 获取异常过滤识别算法
    dispatch(getAbnMethods());
    dispatch(getStructures(user.orgId))// 获取结构物
      .then((action) => {
        if (action.payload.data.length > 0) {
          const structId = action.payload.data[0].id;
          this.setState({
            structId,
            structName: action.payload.data[0].name,
          }, () => {
            dispatch(getFactors(structId)).then((res) => {
              if (res && res.payload.data.length > 0) {
                const factors = res.payload.data.filter((f) => f.checked);
                const deItemId = factors.filter((s) => s.id === factors[0].id)[0].items[0].id;
                const factorId = factors[0].id;
                this.setState({
                  factorId,
                  reCalcFactorId: factorId,
                  itemId: deItemId,
                  // defaultRadioValue: factors.filter(s => s.id == factors[0].id)[0].items[0].id,
                }, () => {
                  // 获取测点
                  dispatch(getStations(structId, factorId)).then((r) => {
                    if (r.success) {
                      const stationsValue = r.payload.data[0] && r.payload.data[0].id;
                      this.setState({
                        stationsValue: [stationsValue],
                      });
                    }
                    setfactorAndStations(structId, factorId, deItemId);
                    // 异常数据识别参数配置列表
                    dispatch(getAbnParamList(structId));
                    // 异常过滤配置列表
                    dispatch(getAbnFilterCfgs(structId));
                  });
                });
              }
            });// 获取监测因素
          });
        } else {
          return Promise.resolve();//
        }
      });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'GET_ABN_FILTER_RESULT_CLEAR' });
    dispatch({ type: 'GET_ITEM_ABN_TASK_RESULT_INT_CLEAR' });
    dispatch({ type: 'GET_ITEM_ABN_TASK_RESULT_BURR_CLEAR' });
    dispatch({ type: 'GET_ITEM_ABN_TASK_RESULT_TR_CLEAR' });
  }

  onChange = (e) => {
    const { radioChange } = this.props;
    this.setState({
      activeKey: e.target.value,
    });
    radioChange(e.target.value);
  };

  onStructChange = (structId) => { // 结构物改变
    const { dispatch, structures, setfactorAndStations } = this.props;

    const struct = structures.find((s) => s.id === structId).name;
    this.setState({
      structId,
      structName: struct,
    }, () => {
      dispatch(getFactors(structId)).then((res) => {
        if (res && res.payload.data.length > 0) {
          const factors = res.payload.data.filter((f) => f.checked);
          const factorId = factors[0]?.id;
          if (factorId) {
            const deItemId = factors.filter((s) => s.id === factorId)[0].items[0].id;
            this.setState({
              factorId,
              reCalcFactorId: factorId,
              itemId: deItemId,
            }, () => {
              dispatch(getStations(structId, factorId)).then((r) => {
                if (r.success) {
                  const stationsValue = r.payload.data[0] && r.payload.data[0].id;
                  this.setState({
                    stationsValue: [stationsValue],
                  });
                }
                setfactorAndStations(structId, factorId, deItemId);
                // 获取结构物下异常参数配置列表
                dispatch(getAbnParamList(structId));
                // 异常过滤配置列表
                dispatch(getAbnFilterCfgs(structId));
              });
            });
          }
        }
      });
    });
  };

  reCalcFactorChange = (factorId) => {
    const { reFaChange } = this.props;
    this.setState({
      reCalcFactorId: factorId,
    });
    reFaChange(factorId);// 重计算和异常过滤筛选用
  };

  timeOnChange = (dates, dateStrings) => {
    const { setTime } = this.props;
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
    setTime(dates[0].format('YYYY-MM-DD HH:mm:ss'), dates[1].format('YYYY-MM-DD HH:mm:ss'));
  };

  //   showParamsCfg = () => {
  //     const { showParamsCfg } = this.state;
  //     if (!showParamsCfg) {
  //       this.setState({ showParamsCfg: true });
  //     } else {
  //       this.setState({ showParamsCfg: false });
  //     }
  //   };

  changeMethod = (value) => {
    const { dispatch, changeMethod } = this.props;
    dispatch({ type: 'GET_ABN_FILTER_RESULT_CLEAR' });
    this.setState({
      mType: value,
    });
    changeMethod(value);
  };

  // 数据对比
  dataCompara = (data) => {
    const { dispatch } = this.props;
    const { currStartTime, currEndTime, structId } = this.state;
    const start = currStartTime;
    const end = currEndTime;
    dispatch(getAbnTaskResult(structId, start, end, data));
  };

  factorChange = (value) => {
    const { dispatch, factorCh } = this.props;
    const { structId, factorId } = this.state;
    if (value.length !== 0) {
      this.setState({
        factorId: value[0],
        itemId: value[1],
        stationsValue: [],
      }, () => {
        // 获取测点
        factorCh(value[0]);
        dispatch(getStations(structId, factorId)).then((res) => {
          if (res.success) {
            const stationsValue = res.payload.data[0] && res.payload.data[0].id;
            this.setState({
              stationsValue: [stationsValue],
            });
          }
        });
      });
    } else { // 清空
      this.setState({
        factorId: 0,
        itemId: 0,
        stationsValue: [],
      });
    }
  };

  stationsChange = (value) => {
    this.setState({
      stationsValue: value,
    });
  };

  exporting = () => {
    const { user } = this.props;
    const { structName, structId } = this.state;
    const {
      url, params, ifr, form,
    } = this.refs;
    const newUrl = apiUrl.getAbnParamList.replace('{id}', structId);
    findDOMNode(url).value = `${newUrl}?token=${user.token}`;
    findDOMNode(params).value = structName;
    findDOMNode(ifr).contentWindow.name = 'ifr';
    findDOMNode(form).submit();
  };

  renderParamsCfgs() {
    const {
      mType, structId, factorId, itemId, stationsValue, activeKey,
    } = this.state;
    const SubContent = {
      reCalc: '',
      abnFilter: <div />,
      abnRecognize: <FactorAndStations
        methodType={mType}
        structId={structId}
        factorId={factorId}
        itemId={itemId}
        stationsValue={stationsValue}
        factorChange={this.factorChange}
        stationsChange={this.stationsChange}
        dataCompara={this.dataCompara}
        changeMethod={this.changeMethod}
      />,
    };
    return SubContent[activeKey];
  }

  renderFactors = () => {
    const { factors } = this.props;

    const newData = [];
    factors.forEach((s) => {
      if (s.checked) {
        newData.push(<Option key={s.id} value={s.id}>{s.name}</Option>);
      }
    });
    return newData;
  };

  render() {
    const { structures } = this.props;
    const { structId, activeKey, reCalcFactorId } = this.state;
    return (
      <div style={{ marginBottom: 15, padding: 20 }} className="wrapper-background">
        <Row span="24">
          <Form ref={this.formRef} layout="inline" style={{ textAlign: 'left' }}>
            <Form.Item>
              <Select
                value={structId}
                onChange={this.onStructChange}
                placeholder="请选择结构物"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => Func.selectFilterOption(input, option)}
                style={{ width: 274 }}
              >
                {
                  structures ? structures.map((s) => <Option key={s.id} value={s.id}>{s.name}</Option>) : []
                }
              </Select>
            </Form.Item>
            <Form.Item>
              <RadioGroup onChange={(e) => this.onChange(e)} defaultValue="reCalc">
                <RadioButton value="reCalc">重计算</RadioButton>
                <RadioButton value="abnFilter">异常过滤</RadioButton>
                <RadioButton value="abnRecognize">异常数据识别</RadioButton>
              </RadioGroup>
            </Form.Item>
            {activeKey !== 'abnRecognize'
              ? (
                <Form.Item>
                  <Select
                    value={reCalcFactorId}
                    onChange={this.reCalcFactorChange}
                    placeholder="请选择监测因素"
                    style={{ width: 160 }}
                  >
                    {this.renderFactors()}
                  </Select>
                </Form.Item>
              )
              : ''}

            {activeKey !== 'abnFilter'// 异常过滤不需要时间
              ? (
                <Form.Item
                  key="timeSelected"
                  name="timeSelected"
                  initialValue={[moment().add(-1, 'days'), moment()]}
                >
                  <RangePicker
                    style={{ paddingLeft: 5 }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                    placeholder={['开始时间', '结束时间']}
                    onChange={this.timeOnChange}
                  />
                </Form.Item>
              )
              : ''}

            {activeKey === 'abnRecognize'
              ? (
                <Form.Item>
                  <Tooltip placement="topLeft" title="一键导出当前结构物异常参数配置">
                    <Button type="ghost" onClick={this.exporting}>导出</Button>
                  </Tooltip>
                </Form.Item>
              ) : ''}
          </Form>
        </Row>
        <iframe ref="ifr" style={{ display: 'none' }} />
        <form ref="form" action="/exporting/abnCfgs" target="ifr" method="post">
          <input ref="url" name="url" type="hidden" />
          <input ref="params" name="params" type="hidden" />
        </form>
        { this.renderParamsCfgs()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    auth, thresholdStructures, thresholdFactorList, thresholdStationList,

  } = state;
  return {
    isRequesting: thresholdStructures.isRequesting || thresholdFactorList.isRequesting, // 请求状态
    structures: thresholdStructures.data, // 结构物
    factors: thresholdFactorList.data ? thresholdFactorList.data.filter((s) => s.proto !== 2002 && s.proto !== 5001 && s.proto !== 5002) : [],
    // stations: thresholdStationList.data,//测点
    user: auth.user, // 用户信息
  };
}

export default connect(mapStateToProps)(StructSelect);
