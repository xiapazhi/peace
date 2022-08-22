/**
 * Created by PengLing on 2018/10/10.
 */
'use strict';

import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';

class EventScoreResultDetail extends Component {
    constructor(props) {
        super(props);
    }

    getColumns = () => {
        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if (index === 4) {
                obj.props.colSpan = 0;
            }
            return obj;
        };
        const columns = [{
            title: '事件指标',
            dataIndex: 'metrics',
            key: 'metrics',
            render: (text, row, index) => {
                if (index < 4) {
                    return <span>{text}</span>;
                }
                return {
                    children: <span>{text}</span>,
                    props: {
                        colSpan: 4
                    }
                };
            }
        }, {
            title: '评分权重',
            dataIndex: 'weight',
            key: 'weight',
            render: renderContent
        }, {
            title: '单项得分',
            dataIndex: 'inputScore',
            key: 'inputScore',
            render: renderContent
        }, {
            title: '事件评价',
            dataIndex: 'desc',
            key: 'desc',
            render: renderContent
        }, {
            title: '得分',
            dataIndex: 'outputScore',
            key: 'outputScore'
        }];
        return columns;
    };

    getDataSource = () => {
        const { score, extra } = this.props.record;
        //'fallRain': '降雨量',
        const Metrics = { 'rainStorm': '暴雨',  'earthquake': '地震', 'landDisaster': '地灾', 'warn': '平台告警', 'total': '总分' };
        const dataSource = Object.keys(Metrics).map(key => ({
            key: key,
            metrics: Metrics[key],
            weight: `${extra[`${key}Weight`]}%`,
            inputScore: extra[`${key}Dan`],
            outputScore: key == 'total' ? score : extra[`${key}Score`],
            desc: extra[`${key}Des`]
        }));
        return dataSource;
    };

    render() {
        const { time, extra } = this.props.record;
        return (
            <Modal
                title={`${extra.structure} ${time} 详情`}
                maskClosable={false}
                visible={true}
                footer={[<Button key='close' onClick={this.props.onCancel}>关闭</Button>]}
                onCancel={this.props.onCancel}
            >
                <Table bordered columns={this.getColumns()} dataSource={this.getDataSource()} pagination={false} />
            </Modal>
        );
    }
}

export default EventScoreResultDetail;
