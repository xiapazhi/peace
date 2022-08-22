/**
 * Created by PengLing on 2018/10/10.
 */
'use strict';

import React, { Component } from 'react';
import { Spin, Modal, Row, Table, Button, Select, InputNumber } from 'antd';
import moment from 'moment';
import { PinyinHelper } from '@peace/utils'

const Option = Select.Option;

class RainfallYearly extends Component {
    constructor(props) {
        super(props);
        this.state = { rainfall: null };
    }

    handleRainfallChange = (value) => {
        let v = value;
        if (/\d+\.\d{4,}/g.test(v)) v = Number(`${v}`.slice(0, -1));
        this.setState({ rainfall: v });
    };

    handleSave = () => {
        this.props.onSave({
            'rainfall': this.state.rainfall,
            'submitAt': moment().toISOString()
        });
    };

    handleStructureChange = (value) => {
        this.props.onStructureSelect(parseInt(value));
    };

    getColumns = () => {
        const columns = [{
            title: '年平均降雨量 (mm)',
            dataIndex: 'rainfall',
            key: 'rainfall',
            sorter: (a, b) => a.rainfall - b.rainfall
        }, {
            title: '录入时间',
            dataIndex: 'time',
            key: 'time',
            sorter: (a, b) => moment(a.time).valueOf() - moment(b.time).valueOf()
        }];
        return columns;
    };

    getDataSource = () => {
        let data = (this.props.rainfallYearly || []).map(item => ({
            key: item.id,
            rainfall: item.rainfall,
            time: moment(item.time).format('YYYY-MM-DD HH:mm:ss')
        }));
        return data;
    };

    getPagination = () => {
        const pagination = {
            showTotal: total => `共${total}条`,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '25', '50', '100'],
            defaultPageSize: 50
        };
        return pagination;
    };

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

    UNSAFE_componentWillReceiveProps(nextProps) {
        let thisRainfallYearly = this.props.rainfallYearly,
            nextRainRallYearly = nextProps.rainfallYearly;
        if (!thisRainfallYearly && nextRainRallYearly) {
            this.setState({ rainfall: null });
        }
    }

    componentDidMount() {
        let defaultStructure = (this.props.structList[0] || {}).id;
        if (defaultStructure) {
            this.props.onStructureSelect(defaultStructure);
        }
    }

    render() {
        const { structList, rainfallYearly } = this.props;
        return (
            <Modal
                title='结构物年平均降雨量录入'
                maskClosable={false}
                visible={true}
                footer={[<Button key='close' onClick={this.props.onCancel}>关闭</Button>]}
                onCancel={this.props.onCancel}
                bodyStyle={{ maxHeight: document.body.clientHeight - 300, overflowY: 'auto' }}
            >
                <Row className='fs-margin-b16'>
                    <span>结构物：</span>
                    {structList ? this.renderStructures() : null}
                </Row>
                <Row className='fs-margin-tb16'>
                    <span>年平均降雨量 (mm)：</span>
                    <InputNumber
                        placeholder='请输入年平均降雨量'
                        min={0} max={99999.999} step={0.001}
                        style={{ width: 228 }}
                        value={this.state.rainfall}
                        onChange={this.handleRainfallChange}
                    />
                    <Button type='primary' className='fs-margin-l16' onClick={this.handleSave}>保存</Button>
                </Row>
                <Spin spinning={!rainfallYearly}>
                    <Table bordered columns={this.getColumns()} dataSource={this.getDataSource()} pagination={this.getPagination()} />
                </Spin>
            </Modal>
        );
    }
}

export default RainfallYearly;
