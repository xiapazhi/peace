/**
 * Created by PengLing on 2018/10/10.
 */
'use strict';

import React, { Component } from 'react';
import { Spin, Row, Col, Button, Input } from 'antd';
import EventScoreResultTable from '../view-table';
import RainfallYearly from './rainfall';

const Search = Input.Search;

class EventScoreResultLatest extends Component {
    constructor(props) {
        super(props);
        this.record = null;
        this.state = {
            searchValue: '',
            modalVisible: false
        };
    }

    handleSearch = (value) => {
        this.setState({ searchValue: value });
    };

    handleRainfall = () => {
        this.setState({ modalVisible: true });
    };

    handleCancel = () => {
        this.setState({ modalVisible: false });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const thisProps = this.props;
        let structuresToRequested = !thisProps.structList && nextProps.structList;
        let tabChangeToLatest = this.props.tabkey != nextProps.tabkey && nextProps.tabkey == 'latest';
        if (structuresToRequested || tabChangeToLatest && nextProps.structList) {
            nextProps.onTabsChange('latest', { structures: nextProps.structList.map(s => s.id) });
        }
    }

    componentDidMount() {
        if (this.props.structList) {
            this.props.onTabsChange('latest', { structures: this.props.structList.map(s => s.id) });
        }
    }

    render() {
        const { structList, scores, rainfallYearly, onStructureSelect } = this.props;
        return (
            <Spin spinning={!scores}>
                <Row className='fs-margin-b16'>
                    <Col span={12}>
                        <Button type='primary' onClick={this.handleRainfall}>录入年平均降雨量</Button>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Search placeholder="请输入关键字搜索" style={{ width: 300 }} onSearch={this.handleSearch} />
                    </Col>
                </Row>
                <EventScoreResultTable
                    latest={true}
                    scores={scores}
                    searchValue={this.state.searchValue}
                />
                {
                    this.state.modalVisible
                        ? (
                            <RainfallYearly
                                structList={structList}
                                rainfallYearly={rainfallYearly}
                                onStructureSelect={onStructureSelect}
                                onSave={this.props.onSave}
                                onCancel={this.handleCancel}
                            />
                        )
                        : null
                }
            </Spin>
        );
    }
}

export default EventScoreResultLatest;
