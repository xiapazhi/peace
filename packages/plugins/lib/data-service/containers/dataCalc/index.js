import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { LayoutContent } from '@peace/components';
import { getStations } from '../../actions/common';// 获取测点
import StructSelect from './structSelect';
import Recalc from './recalc';
import AbnFilter from './abnFilter';
import AbnRecognize from './abnRecognize';

class DataCalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBtn: 'reCalc',
      calcMethod: 'interrupt',
      startTime: moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      structId: null,
      factorId: null,
      itemId: null,
      reCalcFactorId: null,
      filterFactorId: null,
      filterItemId: null,
    };
  }

  // componentDidMount() {
  //     const { dispatch } = this.props;
  //     let current = 'reCalc';
  //     this.props.dispatch(initPageHeaderDetails(
  //         <StructSelect
  //             dispatch={dispatch}
  //             activeKey={current}
  //             radioChange={this.radioChange}
  //             structChange={this.structChange}
  //             factorCh={this.factorCh}
  //             setfactorAndStations={this.setfactorAndStations}
  //             changeMethod={this.changeMethod}
  //             setTime={this.timeChange}
  //             reFaChange={this.reFaChange}
  //         />
  //     ));
  // }
  // componentWillUnmount() {
  //     this.props.dispatch(initPageHeaderDetails(null));
  // }
  timeChange = (s, e) => {
    this.setState({ startTime: s, endTime: e });
  };

  radioChange = (key) => {
    this.setState({
      currentBtn: key,
    });
  };

  factorCh = (value) => {
    this.setState({
      factorId: value,
    });
  };

  changeMethod = (value) => {
    this.setState({
      calcMethod: value,
    });
  };

  setfactorAndStations = (structId, factorId, itemId) => {
    this.setState({
      structId,
      factorId, // 异常数据识别用
      itemId, // 异常数据识别用

      reCalcFactorId: factorId, // 重计算用

      filterFactorId: factorId, // 异常过滤用
      filterItemId: itemId, // 异常过滤用
    });
  };

  reFaChange = (value) => {
    this.setState({
      reCalcFactorId: value, // 重计算和异常过滤筛选用
    });
  };

  filFactorChange = (value) => {
    const { dispatch } = this.props;
    const { structId } = this.state;
    this.setState({
      filterFactorId: value[0],
      filterItemId: value[1],
    }, () => {
      // 获取测点
      dispatch(getStations(structId, value[0]));
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      structId, reCalcFactorId, startTime, endTime, filterFactorId, filterItemId, factorId, itemId, calcMethod, currentBtn,
    } = this.state;
    const SubContent = {
      reCalc: <Recalc
        structId={structId}
        factorId={reCalcFactorId}
        startTime={startTime}
        endTime={endTime}
      />,
      abnFilter: <AbnFilter
        structId={structId}
        factorId={filterFactorId}
        itemId={filterItemId}
        filFactorChange={this.filFactorChange}
        cfgFilterFactorId={reCalcFactorId}
      />,
      abnRecognize: <AbnRecognize
        structId={structId}
        factorId={factorId}
        itemId={itemId}
                // factorChange={this.factorChange}
        calcMethod={calcMethod}
      />,
    };
    return (
      <LayoutContent>
        <StructSelect
          dispatch={dispatch}
          activeKey={currentBtn}
          radioChange={this.radioChange}
          factorCh={this.factorCh}
          setfactorAndStations={this.setfactorAndStations}
          changeMethod={this.changeMethod}
          setTime={this.timeChange}
          reFaChange={this.reFaChange}
        />
        {SubContent[currentBtn]}
      </LayoutContent>
    );
  }
}

// function mapStateToProps(state) {

// }

export default connect()(DataCalc);
