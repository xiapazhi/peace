const videojs = require('video.js');
require('videojs-flash');
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Immutable from 'immutable';
import { Modal, Card, Button, Row, Col, Slider, message, Spin, Icon } from 'antd';
// import DatePicker from '../../../components/DatePicker';
import { getHistoryVideo, getHeartBeatVideo, getCurrentTimeHistoryVideo } from '../actions/videoPlay';

class VideoHistoryPlayModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: this.props.startTime ? this.props.startTime : moment().add(-24, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            endTime: this.props.endTime ? this.props.endTime : moment().format('YYYY-MM-DD HH:mm:ss'),
            sliderStartTime: 0,
            sliderEndTime: 0,
            sliderInterval: null,
            flag: false,
            curTime: 0,
            heartBeatInterval: null,
            disabled: false,
            title: ''
        }
    }
    componentDidMount() {
        this.getHistoryVideoPlay();
    }

    componentWillUnmount() {
        videojs("history_video").dispose();
        clearInterval(this.state.sliderInterval);
        clearInterval(this.state.heartBeatInterval);
    }
    request = () => {
        this.setState({ disabled: false });
        clearInterval(this.state.sliderInterval);
        clearInterval(this.state.heartBeatInterval);
        videojs("history_video").reset();
        this.getHistoryVideoPlay();
    }
    handleCancel = () => {
        const { closeHistoryPlayModal } = this.props;
        closeHistoryPlayModal();
    }
    onDateRangeChange = range => {
        this.setState({
            startTime: range.begin.format('YYYY-MM-DD HH:mm:ss'),
            endTime: range.end.format('YYYY-MM-DD HH:mm:ss')
        });
    }
    getHistoryVideoPlay = () => {
        const { videoList } = this.props;
        let videoInfo = videoList.filter(item => {
            return item.id.toString() == this.props.curSelectedVideoId;
        });
        if (videoInfo.length == 0)
            return message.error('没有相关视频内容！');
        let video = videoInfo[0];
        const nvrInfo = {
            nvr_category: 0,
            nvr_addr: video.nvr.address,
            nvr_port: video.nvr.port,
            nvr_user: video.nvr.username,
            nvr_pwd: video.nvr.password,
            nvr_channel: video.nvr.channelNumber,
            pushServerAddress: video.pushServerAddress,
            startTime: this.state.startTime ? this.state.startTime : null,
            endTime: this.state.endTime ? this.state.endTime : null,
        };
        this.setState({ pushServerAddress: video.pushServerAddress, title: video.location });
        this.props.dispatch(getHistoryVideo(nvrInfo)).then((data) => {
            var videoResult = data.payload.items;
            if (videoResult) {
                if (videoResult.status_code == 200) {
                    this.setState({
                        curTime: moment(data.payload.items.start_time).format('X'),
                        sliderStartTime: Date.parse(new Date(data.payload.items.start_time.replace(/-/g, '/'))),
                        sliderEndTime: Date.parse(new Date(data.payload.items.stop_time.replace(/-/g, '/')))
                    });
                    this.loadVideoHistory(data.payload.items).then(() => {
                        this.setState({ heartBeatMark: true });
                        clearInterval(this.state.sliderInterval);
                        let i = this.state.sliderStartTime;
                        let j = this.state.sliderEndTime;
                        this.setState({ flag: true });
                        if (i > 0) {
                            this.sliderChangeValue(i, j, this.state.flag);
                        }
                        if (this.state.curTime == j) {
                            this.setState({ disabled: true });
                            videojs("history_video").pause();
                            clearInterval(this.state.heartBeatInterval);
                            clearInterval(this.state.sliderInterval);
                        }
                    }).then(() => {
                        this.heartBeat(video.pushServerAddress, data.payload.items.play_handle);
                        this.setState({
                            curPlayHandle: data.payload.items.play_handle
                        })
                    });
                } else {
                    clearInterval(this.state.sliderInterval);
                    clearInterval(this.state.heartBeatInterval);
                    this.setState({
                        curTime: moment(this.state.startTime).format('X'),
                        sliderStartTime: Date.parse(new Date(data.payload.items.start_time.replace(/-/g, '/'))),
                        sliderEndTime: Date.parse(new Date(data.payload.items.stop_time.replace(/-/g, '/')))
                    });
                    if (videoResult.status_code == 600) {
                        message.error('输入参数错误!');
                    } else if (videoResult.status_code == 601) {
                        message.error('桢分时失败!');
                    } else if (videoResult.status_code == 602) {
                        message.error('连接rtmp server错误!');
                    } else if (videoResult.status_code == 604) {
                        message.error('回放播放失败!');
                    } else if (videoResult.status_code == 605) {
                        message.error('未找到播放项!');
                    } else if (videoResult.status_code == 606) {
                        message.error('NVR登录失败!');
                    } else {
                        message.error('未找到视频文件');
                    }
                }
            }
            else {
                clearInterval(this.state.sliderInterval);
                clearInterval(this.state.heartBeatInterval);
                message.error('没有找到视频文件！');
            }
        })
    }
    loadVideoHistory = (data) => {
        if (data != null) {
            let url = data.rtmp_url;
            let myPlayer = videojs("history_video");
            myPlayer.ready(function () {
                myPlayer.src(
                    { type: "rtmp/flv", src: url, withCredentials: true }
                );
                myPlayer.reset();
                setTimeout(function () {
                    myPlayer.play();
                    //resolve();
                }, 100);
                //myPlayer.play();
            });
        }
        return Promise.resolve();
    }
    //心跳
    heartBeat = (address, playHandle) => {
        if (this.state.heartBeatMark) {
            let heartBeatInterval = null;
            let post_data = {
                address: address,
                playHandle: playHandle
            };
            heartBeatInterval = setInterval(() => {
                this.props.dispatch(getHeartBeatVideo(post_data))
                    .then((data) => {
                        if (data.payload.items.status_code == 605) {
                            message.error(`未找到播放项!`);
                            clearInterval(heartBeatInterval);
                        }
                    });
            }, 10000);
            this.setState({
                heartBeatInterval: heartBeatInterval
            });
        } else {
            clearInterval(this.state.heartBeatInterval);
        }
    }
    sliderChangeValue = (start, end, flag) => {
        if (this.state.heartBeatMark && flag == true) {
            if (start < end) {
                let sliderInterval = null;
                sliderInterval = setInterval(() => {
                    if (start < end) {
                        this.setState({ curTime: start });
                        start = parseInt(start) + 1000;
                    } else {
                        message.info('播放结束!');
                        this.setState({ disabled: true });
                        videojs("history_video").pause();
                        clearInterval(this.state.heartBeatInterval);
                        clearInterval(this.state.sliderInterval);
                    }
                }, 1000);
                if (sliderInterval) {
                    this.setState({
                        sliderInterval: sliderInterval
                    });
                }
            }
        } else {
            clearInterval(this.state.sliderInterval);
        }
    }

    showSlider = () => {
        document.getElementById('fullscreenShow').style.display = 'block'
    }
    hiddenSlider = () => {
        document.getElementById('fullscreenShow').style.display = 'none'
    }

    getOptionSlider = () => {
        const { historyFullScreenFlag, exitFullscreen } = this.props;
        const { sliderStartTime, sliderEndTime, curTime, disabled } = this.state;
        return (
            <div
                style={historyFullScreenFlag ? {
                    width: '100%',
                    height: 32,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                } : {}}
                onMouseEnter={historyFullScreenFlag ? this.showSlider : () => { }}
                onMouseLeave={historyFullScreenFlag ? this.hiddenSlider : () => { }}
            >
                <Row
                    id='fullscreenShow'
                    style={Object.assign(
                        historyFullScreenFlag ?
                            {
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                display: 'none',
                            } : {

                            }, {
                        width: '100%',
                        height: 32,
                        lineHeight: '32px'
                    })}
                >
                    <Col span={3}>
                        <span style={{ float: 'right', marginRight: 16 }}>
                            {new Date(sliderStartTime).Format("MM-dd hh:mm")}
                        </span>
                    </Col>
                    <Col span={18}>
                        <Slider
                            min={sliderStartTime} max={sliderEndTime} step={1000}
                            value={curTime} tipFormatter={this.formatter} onChange={this.onChange.bind(this)}
                            onAfterChange={this.onAfterChange.bind(this)}
                            disabled={disabled}
                        />
                    </Col>
                    <Col span={3} style={{ float: 'right' }}>
                        <span style={{ float: 'left', }}>
                            <span style={{ marginLeft: '5px' }}>
                                {new Date(sliderEndTime).Format("MM-dd hh:mm")}
                            </span>
                            <span onClick={historyFullScreenFlag ? exitFullscreen : this.fullScreen} style={{ marginLeft: 8 }}>
                                <img src={`../../../../assets/video/${historyFullScreenFlag ? 'suoxiao' : 'fangda'}-hui.png`}
                                    style={{ height: '13px', position: 'relative', top: 2 }} />
                            </span>
                        </span>
                    </Col>
                </Row>
            </div>
        )
    }

    fullScreen = () => {
        const { lanchFullscreen } = this.props;
        lanchFullscreen(document.getElementById('historyVideoDom'));
    }
    formatter = () => {
        return new Date(parseFloat(this.state.curTime)).Format("yyyy-MM-dd hh:mm:ss");
    };
    onChange = (value) => {
        this.setState({ curTime: value });
    };
    onAfterChange = (value) => {
        this.setState({ curTime: value });
        let curTime = new Date(Date.parse(new Date(value))).Format("yyyy-MM-dd hh:mm:ss");
        const currentTimePostDate = {
            pos_time: curTime,
            pushServerAddress: this.state.pushServerAddress,
            playHandle: this.state.curPlayHandle
        };
        this.props.dispatch(getCurrentTimeHistoryVideo(currentTimePostDate))
            .then((data) => {
                let videoResult = data.payload.items;
                if (videoResult) {
                    if (videoResult.status_code == 200) {
                        clearInterval(this.state.sliderInterval);
                        let x = value;
                        let y = this.state.sliderEndTime;
                        if (x > 0) {
                            this.sliderChangeValue(x, y, this.state.flag);
                        }
                        let myPlayer = videojs("history_video");
                        myPlayer.play();
                        if (value == y || this.state.curTime == y) {
                            this.setState({ disabled: true });
                            videojs("history_video").pause();
                            clearInterval(this.state.heartBeatInterval);
                            clearInterval(this.state.sliderInterval);
                        }
                    } else if (videoResult.status_code == 600) {
                        message.error('输入参数错误!');
                    } else if (videoResult.status_code == 601) {
                        message.error('桢分时失败!');
                    } else if (videoResult.status_code == 602) {
                        message.error('连接rtmp server错误!');
                    } else if (videoResult.status_code == 604) {
                        message.error('回放播放失败!');
                    } else if (videoResult.status_code == 605) {
                        message.error('未找到播放项!');
                    } else if (videoResult.status_code == 606) {
                        message.error('NVR登录失败!');
                    } else {
                        message.error('未找到视频文件');
                    }
                } else {
                    message.error('没有找到视频文件！');
                }
            })
    }
    render() {
        const { clientHeight, clientWidth, historyFullScreenFlag } = this.props;
        const height = clientHeight - 47 - 50 - 10 * 2 - 70;
        const range = this.props.startTime ? Immutable.fromJS({
            type: 'absolute', // or absolute
            begin: this.props.startTime,
            end: this.props.endTime
        }) : Immutable.fromJS({
            type: 'quick', // or absolute
            name: '过去24小时',
            step: 24,
            stepType: 'h',
            reference: 'now' // or dayEnd // monthEnd // yearEnd
        })
        return (
            <div style={{ position: 'fixed', top: 60 + 15, left: 15, zIndex: 1 }}>
                <Card
                    title={`历史视频${this.state.title ? "（" + this.state.title + "）" : ''}`}
                    bodyStyle={{ padding: 0, width: clientWidth - 30, height: clientHeight - 47 - 30 }}
                    extra={<Icon onClick={this.handleCancel} type="close" style={{ fontSize: 16 }} />}
                >
                    <Spin spinning={this.props.isRequesting}>
                        <div className="A12" style={{ padding: '0 25px', height: 50, lineHeight: '50px', fontSize: 14 }}>
                            {/* <DatePicker
                                onTimeRangeSelect={this.onDateRangeChange}
                                range={range}
                            /> */}
                            <Button type="primary" onClick={this.request}>查询</Button>
                        </div>
                        <div style={{ padding: 10 }} >
                            <div id="historyVideoDom" style={{
                                height: historyFullScreenFlag ? "100%" : height,
                                lineHeight: height, width: '100%'
                            }}>
                                <video id="history_video" style={{ height: '100%', width: '100%' }}
                                    className="video-js vjs-default-skin"
                                    preload="none"
                                    data-setup='{"autoplay": true }'
                                // controls
                                >
                                </video>
                                {
                                    this.getOptionSlider()
                                }
                            </div>
                        </div>
                    </Spin>
                </Card>
            </div >
        )
    }
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function mapStateToProps(state) {
    const { global, videoList, heartBeatVideo, historyVideo, currentTimeHistoryVideo } = state;
    let isRequesting = historyVideo.isRequesting || currentTimeHistoryVideo.isRequesting;
    return {
        clientHeight: global.clientHeight,
        clientWidth: global.clientWidth,
        videoList: videoList.items,
        heartBeat: heartBeatVideo.items,
        isRequesting: isRequesting
    }
}
export default connect(mapStateToProps)(VideoHistoryPlayModal)