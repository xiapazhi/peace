/**
 * Created by PengLing on 2018/10/10.
 */
'use strict';

import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import Detail from './detail';
import { PinyinHelper } from '@peace/utils'

class EventScoreResultTable extends Component {
    constructor(props) {
        super(props);
        this.record = null;
        this.state = {
            modalVisible: false
        };
    }

    handleViewDetail = (record) => {
        this.record = record;
        this.setState({ modalVisible: true });
    };

    handleCancel = () => {
        this.setState({ modalVisible: false });
    };

    filter = (record) => {
        let v = this.props.searchValue.trim();
        if (v != '') {
            const { structure, score, time } = record;
            return structure && (structure.includes(v) || PinyinHelper.isPinyinMatched(structure, v))
                || score.toString().includes(v) || PinyinHelper.isPinyinMatched(score, v)
                || time.includes(v) || PinyinHelper.isPinyinMatched(time, v);
        } else {
            return true;
        }
    };

    getColumns = () => {
        let columns = [];
        if (this.props.latest) {
            columns.push({
                title: '结构物名称',
                dataIndex: 'structure',
                key: 'structure',
                sorter: (a, b) => a.structure.localeCompare(b.structure)
            });
        }
        columns = columns.concat([{
            title: '评分结果',
            dataIndex: 'score',
            key: 'score',
            sorter: (a, b) => a.extra.scoreValue - b.extra.scoreValue
        }, {
            title: '评分时间',
            dataIndex: 'time',
            key: 'time',
            sorter: (a, b) => moment(a.extra.scoreTime).valueOf() - moment(b.extra.scoreTime).valueOf()
        }, {
            title: '操作',
            dataIndex: 'details',
            key: 'details',
            render: (text, record) => (
                <span>
                    <a onClick={e => this.handleViewDetail(record)}>查看详情</a>
                </span>
            )
        }]);
        return columns;
    };

    getDataSource = () => {
        let dataSource = [];
        const { scores } = this.props;
        if (scores && Object.keys(scores).length) { // scores may be Object or Array, handle Array in the same with Object. 
            dataSource = Object.keys(scores).map(key => {
                const { structName, scoreTime, scoreValue, scoreData } = scores[key];
                let record = {
                    key,
                    score: `${scoreValue}分`,
                    time: scoreTime ? moment(scoreTime).format('YYYY年MM月DD日 HH时') : null,
                    extra: { structure: structName, scoreTime, scoreValue, ...scoreData }
                };
                if (this.props.latest) {
                    record.structure = structName.trim();
                }
                return record;
            }).filter(this.filter);
            if (!this.props.latest) {
                dataSource.reverse();
            }
        }
        return dataSource;
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

    render() {
        return (
            <div>
                <Table columns={this.getColumns()} dataSource={this.getDataSource()} pagination={this.getPagination()} />
                {
                    this.state.modalVisible
                        ? <Detail record={this.record} onCancel={this.handleCancel} />
                        : null
                }
            </div>
        );
    }
}

export default EventScoreResultTable;
