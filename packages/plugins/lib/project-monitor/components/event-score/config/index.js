/**
 * Created by PengLing on 2018/10/10.
 */
'use strict';

import React, { Component } from 'react';
import { Spin, Row, Col, Select, Alert, Button, Progress, Slider, InputNumber, Card, message, Modal } from 'antd';
import { PinyinHelper } from '@peace/utils'

const confirm = Modal.confirm;
const Option = Select.Option;

class EventScoreConfig extends Component {
    constructor(props) {
        super(props);
        this.Metrics = {
            'rainstorm': '暴雨指标权重',
            'rainfall': '降雨量指标权重',
            'earthquake': '地震指标权重',
            'platformAlarm': '平台数据告警指标权重',
            'geologicHazard':'地质灾害指标权重'
        };
        this.structureId = null;
        this.state = {
            isEdit: false,
            metricsInputValue: Object.keys(this.Metrics).reduce((p, key) => {
                p[key] = 0;
                return p;
            }, {})
        };
    }

    initContext = (metricsWeight) => {
        const metricsWeightToEdit = metricsWeight || {};
        let weight = Object.keys(this.Metrics).reduce((p, key) => {
            p[key] = (metricsWeightToEdit[key] || {}).weight || 0;
            return p;
        }, {});
        this.setState({
            isEdit: false,
            metricsInputValue: weight
        });
    };

    renderDelConfirm = (sid) => {
        let _this = this;
        confirm({
            title: '要删除？',
            content: (
                <span>
                    {this.props.structList.find(s => s.id == sid).name}
                    <br />
                    <Alert
                        style={{ paddingLeft: 0, paddingRight: 0, marginTop: '8px', width: 'fit-content' }}
                        message='删除该结构物事件指标权重！'
                        type='warning'
                    />
                </span>
            ),
            width: '500px',
            okText: '是',
            cancelText: '否',
            onOk() {
                _this.props.onDeleteWeight(sid);
            },
            onCancel() { }
        });
    };

    getTotalWeight = () => {
        let totalWeight = Object.keys(this.state.metricsInputValue).reduce((p, key) => {
            p += this.state.metricsInputValue[key];
            return p;
        }, 0);
        return totalWeight;
    };

    onEditWeight = () => {
        this.setState({ isEdit: true });
    };

    onCancelWeight = () => {
        this.initContext(this.props.metricsWeight);
    };

    onSaveWeight = () => {
        let totalWeight = this.getTotalWeight();
        if (totalWeight != 100) {
            message.error('请确认权重总和为100%');
            return;
        }
        let sid = this.structureId || (this.props.structList[0] || {}).id;
        let dataToSave = this.state.metricsInputValue;
        this.props.onSaveWeight(sid, dataToSave);
    };

    onDeleteWeight = () => {
        let sid = this.structureId || (this.props.structList[0] || {}).id;
        this.renderDelConfirm(sid);
    };

    handleStructureChange = (value) => {
        this.initContext();
        let sid = parseInt(value);
        this.structureId = sid;
        this.props.onStructureChange(sid);
    };

    handleWeightChange = (value, metric) => {
        if (typeof value == 'number') {
            let v = value;
            if (/\d+\.\d/g.test(v)) v = Number(`${v}`.slice(0, -2));
            this.setState({ metricsInputValue: Object.assign({}, this.state.metricsInputValue, { [metric]: v }) });
        }
    }

    renderStructures = () => {
        const { structList } = this.props;
        return (
            <Select
                showSearch
                style={{ width: 300 }}
                placeholder="请选择一个结构物"
                optionFilterProp="children"
                filterOption={(inputValue, option) => {
                    const { children } = option.props;
                    return (
                        children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
                        PinyinHelper.isPinyinMatched(children, inputValue)
                    );
                }}
                defaultValue={structList[0] ? `${structList[0].id}` : null}
                onChange={this.handleStructureChange}
            >
                {
                    structList.map(s => <Option key={s.id}>{s.name}</Option>)
                }
            </Select>
        );
    };

    renderMetricsWeight = () => {
        let totalWeight = this.getTotalWeight();
        let metricKeys = Object.keys(this.Metrics);
        let lastIndex = metricKeys.length - 1;
        return (
            <div>
                <Alert
                    type='warning' showIcon closable
                    message={<span><span style={{ fontWeight: 'bold' }}>配置规则：</span>权重总和为100%</span>}
                />
                <Row className='fs-margin32'>
                    <Col span={4}>当前权重总和：</Col>
                    <Col span={20}>
                        <Progress
                            percent={totalWeight > 100 ? 100 : totalWeight}
                            status={totalWeight > 100 ? 'exception' : (totalWeight == 100 ? 'success' : 'active')}
                        />
                    </Col>
                </Row>
                <Card bordered={false}>
                    {
                        metricKeys.map((key, index) => {
                            return (
                                <div key={key}>
                                    <Row>
                                        <Col span={6}>{this.Metrics[key]}</Col>
                                        <Col span={6}>
                                            <InputNumber min={0} max={100}
                                                disabled={!this.state.isEdit}
                                                value={this.state.metricsInputValue[key]}
                                                onChange={(value) => this.handleWeightChange(value, key)}
                                            />
                                            <span>&nbsp;%</span>
                                        </Col>
                                        <Col span={12}>
                                            <Slider min={0} max={100}
                                                disabled={!this.state.isEdit}
                                                value={this.state.metricsInputValue[key]}
                                                onChange={(value) => this.handleWeightChange(value, key)}
                                            />
                                        </Col>
                                    </Row>
                                    {index == lastIndex ? null : <div className='fs-divider fs-divider-horizontal'></div>}
                                </div>
                            );
                        })
                    }
                </Card>
            </div>
        );
    };

    renderContent = () => {
        if (this.state.isEdit) {
            return (
                <div className='fs-page-subcontent'>
                    {this.renderMetricsWeight()}
                    <div className='fs-margin-t16 fs-text-align-right'>
                        <Button onClick={this.onCancelWeight}>取消</Button>
                        <Button style={{ marginLeft: '16px' }} type='primary' onClick={this.onSaveWeight}>保存</Button>
                    </div>
                </div>
            );
        }
        return (
            <div className='fs-page-subcontent'>
                {
                    Object.keys(this.props.metricsWeight).length
                        ?
                        <div>
                            {this.renderMetricsWeight()}
                            <div className='fs-margin-t16 fs-text-align-right'>
                                <Button type='primary' onClick={this.onEditWeight}>编辑</Button>
                                <Button style={{ marginLeft: '16px' }} onClick={this.onDeleteWeight}>删除</Button>
                            </div>
                        </div>
                        :
                        <div>
                            <Button type='primary' onClick={this.onEditWeight}>配置指标权重</Button>
                        </div>
                }
            </div>
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        let thisMetricsWeight = this.props.metricsWeight,
            nextMetricsWeight = nextProps.metricsWeight;
        if (thisMetricsWeight == null && nextMetricsWeight && Object.keys(nextMetricsWeight).length) {
            this.initContext(nextMetricsWeight);
        }
    }

    render() {
        const { structList, metricsWeight } = this.props;
        let requesting = !(structList && metricsWeight);

        return (
            <Spin spinning={requesting}>
                <div>
                    <span>结构物：</span>
                    {structList ? this.renderStructures() : null}
                </div>
                <div className='fs-margin-tb16'>
                    {metricsWeight ? this.renderContent() : null}
                </div>
            </Spin>
        );
    }
}

export default EventScoreConfig;
