/**
 * Created by PengLing on 2018/10/10.
 */
'use strict';

import React, { Component } from 'react';
import { Spin, Row, Select, Button, Card, Input, DatePicker, Alert } from 'antd';
import EventScoreResultChart from './chart';
import EventScoreResultTable from '../view-table';
import moment from 'moment';
import { PinyinHelper } from '@peace/utils'

const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;
const Option = Select.Option;

class EventScoreResultHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            structure: null,
            timerange: {
                start: moment().add(-1, 'days').valueOf(),
                end: moment().valueOf()
            }
        };
        this.queryConditionChanged = false;
    }

    handleSearch = (value) => {
        this.setState({ searchValue: value });
    };

    handleStructureChange = (value) => {
        this.setState({ structure: parseInt(value) });
        this.queryConditionChanged = true;
    };

    handleRangePickerChange = (dates, dateStrings) => {
        let timerange = dates.length == 2
            ? { start: dates[0].valueOf(), end: dates[1].valueOf() }
            : { start: null, end: null }
        this.setState({ timerange });
        this.queryConditionChanged = true;
    };

    handleQuery = () => {
        if (this.queryConditionChanged) {
            this.props.onSearchHistory(this.state.structure, this.state.timerange);
        }
        this.queryConditionChanged = false;
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
                value={this.state.structure ? `${this.state.structure}` : null}
                onChange={this.handleStructureChange}
            >
                {
                    structList.map(s => <Option key={s.id}>{s.name}</Option>)
                }
            </Select>
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const thisProps = this.props;
        let structuresToRequested = !thisProps.structList && nextProps.structList;
        let tabChangeToHistory = this.props.tabkey != nextProps.tabkey && nextProps.tabkey == 'history';
        let timerange = { start: moment().add(-1, 'days').valueOf(), end: moment().valueOf() };
        if (tabChangeToHistory) this.setState({ timerange });
        if (structuresToRequested || tabChangeToHistory && nextProps.structList) {
            let defaultStructure = nextProps.structList[0].id;
            this.setState({ structure: defaultStructure });
            nextProps.onTabsChange('history', { structureId: defaultStructure, timerange: timerange });
        }
    }

    componentDidMount() {
        if (this.props.structList) {
            let defaultStructure = this.props.structList[0].id;
            this.setState({ structure: defaultStructure });
            this.props.onTabsChange('history', { structureId: defaultStructure, timerange: this.state.timerange });
        }
    }

    render() {
        const { structList, scores } = this.props;
        const { timerange } = this.state;
        return (
            <Spin spinning={!scores}>
                <Row className='fs-margin-b16'>
                    <span>结构物：</span>
                    {structList ? this.renderStructures() : null}
                    <RangePicker
                        className='fs-margin-l16'
                        ranges={{
                            '今天': [moment().startOf('day'), moment().endOf('day')],
                            '本周': [moment().startOf('week'), moment().endOf('week')],
                            '本月': [moment().startOf('month'), moment().endOf('month')]
                        }}
                        showTime
                        format="YYYY/MM/DD HH:mm:ss"
                        placeholder={['开始时间', '结束时间']}
                        value={[timerange.start ? moment(timerange.start) : null, timerange.end ? moment(timerange.end) : null]}
                        onChange={this.handleRangePickerChange}
                    />
                    <Button type='primary' className='fs-margin-l16' onClick={this.handleQuery}>查询</Button>
                </Row>
                {
                    scores ?
                        (
                            scores.length ? (
                                <div>
                                    <EventScoreResultChart
                                        scores={scores}
                                        time={{ ...timerange, now: moment() }}
                                    />
                                    <Card>
                                        <Row className='fs-margin-b16' style={{ textAlign: 'right' }}>
                                            <Search placeholder="请输入关键字搜索" style={{ width: 300 }} onSearch={this.handleSearch} />
                                        </Row>
                                        <EventScoreResultTable
                                            scores={scores}
                                            searchValue={this.state.searchValue}
                                        />
                                    </Card>
                                </div>
                            ) : <Alert message='暂无数据' type='info' />
                        )
                        : null
                }
            </Spin>
        );
    }
}

export default EventScoreResultHistory;
