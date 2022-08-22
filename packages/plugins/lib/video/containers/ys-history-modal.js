const videojs = require('video.js');
require('videojs-flash');
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Modal, Card, Button, Row, Col, Form, message, DatePicker, Slider } from 'antd';
import YSIframePlayer from './ys-player-iframe';
import YSUIKitPlayer from './ys-player-uikit';
const FormItem = Form.Item;

class YingshiHistoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currStartTime: moment().add(-4, 'hour').valueOf(),
            currEndTime: moment().valueOf(),

            tempStart: moment().add(-4, 'hour').valueOf(),
            tempEnd: moment().valueOf(),

            sstart: moment().add(-4, 'hour').valueOf(),//'20191114000000'
            eend: moment().valueOf(),//'20191114235959'

            refreshSlider: false
        }
    }

    onSliderChange = (value) => {
        // this.setState({
        //     sstart: '20191114130000',
        //     eend: '20191114235959'
        // });
    };

    onAfterChange = (value) => {
        this.setState({
            sstart: value[0],
            eend: value[1]
        })
    }

    request = () => {
        const { currStartTime, currEndTime } = this.state;
        if (currStartTime > currEndTime) {
            message.warning('开始时间大于结束时间，请重新选择时间！');
            return false;
        }
        this.setState({
            tempStart: currStartTime,
            tempEnd: currEndTime,
            sstart: currStartTime,
            eend: currEndTime,
            refreshSlider: true
        }, () => {
            this.setState({
                refreshSlider: false
            });
        })
    }

    handleCancel = () => {
        const { closeHistoryYSPlayModal } = this.props;
        closeHistoryYSPlayModal();
    }
    // onDateRangeChange = range => {
    //     this.setState({
    //         currStartTime: range.begin,
    //         currEndTime: range.end
    //     });
    // }
    onStartChange = (value) => {
        if (!value) {
            this.setState({
                currStartTime: null
            })
            return message.warning('请选择开始时间！');
        }
        this.onChange('currStartTime', value);
    }

    onEndChange = (value) => {
        if (!value) {
            this.setState({
                currEndTime: null
            })
            return message.warning('请选择结束时间！');
        }
        this.onChange('currEndTime', value);
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    render() {
        const { videoAccessToken, videoList, curSelectedVideoId } = this.props;
        // const { getFieldDecorator } = this.props.form;
        const { sstart, eend, tempStart, tempEnd, currStartTime, currEndTime, refreshSlider } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let startTime = moment(sstart).format("YYYYMMDDHHmmss");
        let endTime = moment(eend).add(5, 'second').format("YYYYMMDDHHmmss");//视频少秒
        let videoInfo = videoList.find(v => v.id == curSelectedVideoId);
        if (!(videoInfo && (videoInfo.yingshi.serialNo || videoInfo.Ti.serialNo) && (videoInfo.channelNo || videoInfo.channelNo == 0))) {
            return '';
        }
        let historyUrl = `ezopen://open.ys7.com/${(videoInfo.yingshi.serialNo || videoInfo.Ti.serialNo)}/${videoInfo.channelNo}.rec?begin=${startTime}&end=${endTime}`
        return (
            <Modal
                title={`历史视频-${videoInfo.location}`}
                visible={true}
                width={910}
                footer={null}
                onCancel={this.handleCancel}
                maskClosable={false}
                bodyStyle={{
                    padding: 8
                }}
            >
                <Row>
                    <div style={{ marginBottom: 8 }}>
                        <Form style={{ marginTop: 5 }} layout="inline">
                            <FormItem
                                {...formItemLayout}
                                label="开始时间"
                                name='startTimeSelected'
                                initialValue={moment(currStartTime)}
                            >
                                <DatePicker
                                    style={{ width: "95%" }}
                                    placeholder="开始时间"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime
                                    onChange={this.onStartChange}
                                />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="结束时间"
                                name='endTimeSelected'
                                initialValue={moment(currEndTime)}
                            >
                                <DatePicker
                                    style={{ width: "95%" }}
                                    placeholder="开始时间"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime
                                    onChange={this.onEndChange}
                                />
                            </FormItem>
                        </Form>
                        <Button type='primary' onClick={this.request}>播放</Button>
                    </div>
                    <div style={{ width: 888, margin: '0 auto' }}>
                        {
                            videoAccessToken ?
                                <YSIframePlayer
                                    containerId={`ys-ipc-${videoInfo.id}-live`}
                                    url={historyUrl}
                                    token={videoAccessToken}
                                    width={'100%'}
                                    height={500}
                                />
                                // <YSUIKitPlayer
                                //     // containerId={`ys-ipc-${videoInfo.id}-live`}
                                //     url={historyUrl}
                                //     token={videoAccessToken}
                                //     width={'100%'}
                                //     height={500}
                                // />
                                : ''
                        }

                        {
                            refreshSlider ? '' :
                                <Slider
                                    // tooltipVisible={true}
                                    tipFormatter={(value) => {
                                        return moment(value).format("YYYY-MM-DD HH:mm:ss")
                                    }}
                                    range
                                    min={tempStart}
                                    max={tempEnd}
                                    defaultValue={[sstart, eend]}
                                    onChange={this.onSliderChange}
                                    onAfterChange={this.onAfterChange}
                                />
                        }
                    </div>
                </Row>
            </Modal >
        )
    }
}

function mapStateToProps(state) {
    const { auth, videoList } = state;
    return {
        videoList: videoList.items,
    }
}
export default connect(mapStateToProps)(YingshiHistoryModal); 