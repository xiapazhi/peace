import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col } from 'antd';
import { Charts } from '@peace/components';
import { InfoCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import Interrupt from './interrupt';
import Burr from './burr';
import Trend from './trend';

const { TimeValueLineChart } = Charts;

class AbnRecognize extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderContent() {
    const SubContent = {
      interrupt: <Interrupt structId={this.props.structId} factorId={this.props.factorId} />,
      burr: <Burr structId={this.props.structId} factorId={this.props.factorId} />,
      trend: <Trend structId={this.props.structId} factorId={this.props.factorId} />,
    };
    return SubContent[this.props.calcMethod];
  }

  render() {
    const { abnCompareData } = this.props;
    let originalData = ['还没查询']; let calcArray = []; let key; let itemName; let start; let
      end;
    const stationsData = [];
    if (abnCompareData && this.props.calcMethod == abnCompareData.method) {
      originalData = abnCompareData.stationData;
      calcArray = abnCompareData.resultArray;
      key = abnCompareData.itemKey;
      itemName = abnCompareData.itemName;
      start = originalData && originalData.length > 0 ? originalData[0].time : '';
      end = originalData && originalData.length > 0 ? originalData[originalData.length - 1].time : '';
      for (let i = 0; i < originalData.length; i++) {
        const one = { name: `${itemName}（单位：${abnCompareData.unit}）`, value: originalData[i][key], time: originalData[i].time };
        stationsData.push(one);
      }
      if (this.props.calcMethod == 'interrupt') {
        for (let j = 0; j < calcArray.length; j++) {
          const one = { name: `中断点：${calcArray[j].time}（中断时长：${calcArray[j].hour.toFixed(2)}h）`, value: calcArray[j].value, time: calcArray[j].time };
          stationsData.push(one);
        }
      } else if (this.props.calcMethod == 'burr') {
        for (let j = 0; j < calcArray.length; j++) {
          const one = {
            name: `毛刺点：${calcArray[j].time}（突变大小：${calcArray[j].burr.toFixed(2)}${abnCompareData.unit}）`,
            value: calcArray[j].value,
            time: calcArray[j].time,
          };
          stationsData.push(one);
        }
      } else if (calcArray) {
        const preLineData = calcArray.calcPreprocess;
        const abnTrends = calcArray.calcFinal;
        for (let j = 0; j < preLineData.length; j++) {
          const one = { name: '预处理+滑动均值后数据', value: preLineData[j].value, time: preLineData[j].time };
          stationsData.push(one);
        }
        for (let t = 0; t < abnTrends.length; t++) {
          const name = `${abnTrends[t].startTime}至${abnTrends[t].endTime}${abnTrends[t].des}，渐变差值：${abnTrends[t].value.toFixed(2)}${abnCompareData.unit}`;
          const start = { name, value: abnTrends[t].startValue, time: abnTrends[t].startTime };
          const end = { name, value: abnTrends[t].endValue, time: abnTrends[t].endTime };
          stationsData.push(start);
          stationsData.push(end);
        }
      }
    }
    return (
      <div>
        <Card title={(
          <div>
            <LineChartOutlined />
            <span style={{ marginLeft: 6 }}>数据对比</span>
          </div>
)}
        >
          <div>
            <div className="data-chart-container">
              {originalData && originalData[0] == '还没查询'
                ? (
                  <div style={{ margin: '20px 0' }}>
                    <InfoCircleOutlined />
                    {' '}
                    输入参数，点击数据对比展示数据对比图（默认显示选择的第一个传感器）
                  </div>
                )
                : originalData && originalData[0] != '还没查询' && originalData.length > 0
                  ? (
                    <TimeValueLineChart
                      key="abnEec"
                      contentType={this.props.calcMethod}
                      data={stationsData}
                      width={300}
                      height={300}
                      itemName={itemName}
                      configs={{ slider: { start, end } }}
                    />
                  )
                  : (
                    <div style={{ margin: '20px 0' }}>
                      <InfoCircleOutlined />
                      {' '}
                      没有查询到任何有效数据！
                    </div>
                  )}
            </div>
          </div>
        </Card>
        {this.renderContent()}
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { auth, abnCalcState } = state;

  return {
    abnCompareData: abnCalcState.data,
    user: auth.user, // 用户信息
  };
}

export default connect(mapStateToProps)(AbnRecognize);
