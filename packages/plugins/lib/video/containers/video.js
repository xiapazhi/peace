
const videojs = require('video.js');
require('videojs-flash');
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Spin, Row, Col, message, Card, Icon } from 'antd';
// import QueueAnim from 'rc-queue-anim';
import VideoList from '../components/video/video-list';
import VideoRealTimePlay from './video-realTimePlay';
import VideoHistoryPlayModal from './video-historyPlay';
import VideoYingShiHistoryPlayModal from './video-yingshi-historyPlay';
import YingshiHistoryModal from './ys-history-modal';
import VideoYingShiPlay from './video-yingshi';
import VideoControl from '../components/video/video-control';
import YSIframePlayer from './ys-player-iframe';
import { getVideoList, getStationVideoInfo, getVideoAccessToken } from '../actions/video';
import {
    getRealTimeVideo, getHeartBeatVideo, getPTZControlVideo, stopVideo, getYingshiControl, YINGSHI_CONTROL_SUCCESS,
    stopYingshiControl, STOP_YINGSHI_SUCCESS
} from '../actions/videoPlay';
import LCVideoPlay from './lcPlay';

class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            stationVideoList: [],
            curSelectedVideoId: null,
            currSelectedVideoType: '',
            checkedValues: [],
            hasPTZ: false,
            curAddress: null,
            curPlayHandle: null,
            maxVideoId: 0,
            defaultSelectedKeys: [],
            videoPlayHandle: {},
            heartBeatInterval: [],
            flashTagState: false,
            historyFullScreenFlag: false,
            historyYingShiFullScreenFlag: false,
            VideoHistoryPlayModalVisit: false,
            VideoHistoryPlayYingShiModalVisit: false,
            videoId: null,
        }
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (nextProps.params != this.props.params) {
            this.setState({ title: '' })
        }
    }
    getData = (params) => {
        this.props.dispatch(getVideoAccessToken());//萤石历史视频token
        this.props.dispatch(getVideoList(params.structId)).then(() => {
            let videoIds = [];
            let nvrIds = this.props.videoList.filter(v => v.type == 'original').reduce((p, c) => {
                p = p.concat(c.id.toString()); return p
            }, []);
            if (params.jump == 'true') {
                let stationIds = sessionStorage.getItem('selectedStationIds');
                this.props.dispatch(getStationVideoInfo(stationIds)).then(() => {
                    this.props.stationVideoInfo.map(s => {
                        s.video.map(sv => {
                            if (videoIds.indexOf(sv.id) < 0) {
                                videoIds.push(sv.id);
                            }
                        })
                    })
                    let stationVideoList = [];
                    this.props.videoList.map(v => {
                        if (videoIds.indexOf(v.id) > -1) {
                            stationVideoList.push(v);
                        }
                    })
                    if (stationVideoList.length > 0) {
                        let checkedValues = [];
                        let videoPlayHandle = {};
                        stationVideoList.map(v => {
                            if (checkedValues.length < 4) {
                                checkedValues.push(v.id.toString());
                                videoPlayHandle[v.id] = {
                                    curAddress: null,
                                    playHandle: null
                                }
                            }
                        })
                        this.setState({
                            title: stationVideoList[0].location,
                            curSelectedVideoId: stationVideoList[0].id,
                            currSelectedVideoType: stationVideoList[0].type,
                            hasPTZ: stationVideoList[0].hasPTZ,
                            stationVideoList: stationVideoList,
                            checkedValues: checkedValues,
                            defaultSelectedKeys: checkedValues,
                            videoPlayHandle: videoPlayHandle,
                            nvrIds: nvrIds
                        });
                    }
                });
            } else {
                if (this.props.videoList.length > 0) {
                    let checkedValues = [];
                    let videoPlayHandle = {};
                    this.props.videoList.map(v => {
                        if (checkedValues.length < 4) {
                            checkedValues.push(v.id.toString());
                            videoPlayHandle[v.id] = {
                                curAddress: null,
                                playHandle: null
                            }
                        }
                    })
                    this.setState({
                        title: this.props.videoList[0].location,
                        curSelectedVideoId: this.props.videoList[0].id,
                        currSelectedVideoType: this.props.videoList[0].type,
                        hasPTZ: this.props.videoList[0].hasPTZ,
                        checkedValues: checkedValues,
                        defaultSelectedKeys: checkedValues,
                        videoPlayHandle: videoPlayHandle,
                        nvrIds: nvrIds
                    })
                }
            }
        });
    }

    componentDidMount() {
        const that = this;
        this.isFlashOk();
        function historyFullScreenChange(e) {
            const { historyFullScreenFlag, historyYingShiFullScreenFlag } = that.state;
            let fullDom = document.fullscreenElement || document.msFullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;
            if (fullDom) {// 进入全屏
                let fullDomId = fullDom.id;
                if (fullDomId == 'historyVideoDom') {
                    that.setState({
                        historyFullScreenFlag: true,
                    })
                } else if (fullDomId == 'historyYingShiVideoDom') {
                    that.setState({
                        historyYingShiFullScreenFlag: true,
                    })
                }
            } else {// 退出全屏
                let domId = e.srcElement.id;
                if (domId == 'historyVideoDom' || historyFullScreenFlag) {
                    that.setState({
                        historyFullScreenFlag: false,
                    })
                } else if (domId == 'historyYingShiVideoDom' || historyYingShiFullScreenFlag) {
                    let elem = document.getElementById('EZUIKit');
                    elem.style.setProperty('width', '890px', '');
                    elem.style.setProperty('height', '650px', '');
                    that.setState({
                        historyYingShiFullScreenFlag: false,
                    })
                }
            }
        }
        document.addEventListener('fullscreenchange', function (e) {
            historyFullScreenChange(e)
        });
        document.addEventListener('webkitfullscreenchange', function (e) {
            historyFullScreenChange(e)
        });
        document.addEventListener('mozfullscreenchange', function (e) {
            historyFullScreenChange(e)
        });
        document.addEventListener('MSFullscreenChange', function (e) { // msfullscreenchange
            historyFullScreenChange(e)
        });

        this.getData(this.props.params)
    }

    lanchFullscreen = (e) => {
        if (e.requestFullscreen) {
            e.requestFullscreen();
        } else if (e.mozRequestFullScreen) {
            e.mozRequestFullScreen();
        } else if (e.msRequestFullscreen) {
            e.msRequestFullscreen();
        } else if (e.webkitRequestFullscreen) {
            e.webkitRequestFullscreen();
        } else {
            alert("浏览器不支持全屏API或已被禁用")
        }
    }

    // 退出全屏
    exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
    componentWillUnmount() {
        this.state.checkedValues.filter(cv => this.state.nvrIds.includes(cv)).map(cv => {
            videojs(`real_time_video-${cv}`).dispose();
        });
    }
    openHistoryPlayModal = (videoId) => {
        this.setState({
            VideoHistoryPlayModalVisit: true,
            videoId: videoId,
        })
    };
    openYingShiHistoryPlayModal = (videoId) => {
        this.setState({
            VideoHistoryPlayYingShiModalVisit: true,
            videoId: videoId,
        });
    };
    closeHistoryPlayModal = () => {
        this.setState({
            VideoHistoryPlayModalVisit: false,
            videoId: null,
        });
    };
    closeHistoryYSPlayModal = () => {
        this.setState({
            VideoHistoryPlayYingShiModalVisit: false,
            videoId: null,
        });
    };
    handleGetVideoList = () => {
        const { params } = this.props;
        this.props.dispatch(push(`/struct/${params.structId}/video/false`))
    }
    videoListClick = (checkedValues) => {
        this.state.defaultSelectedKeys.map(dk => {
            if (checkedValues.indexOf(dk) < 0) {
                if (this.state.nvrIds.includes(dk)) {
                    videojs(`real_time_video-${dk}`).dispose();
                    delete this.state.videoPlayHandle[dk];
                }
                if (this.state.curSelectedVideoId.toString() == dk)
                    if (this.state.maxVideoId.toString() == dk)
                        this.setState({ maxVideoId: 0 });
            }
        });
        this.setState({ defaultSelectedKeys: checkedValues });
        let videoInfo = [];
        if (checkedValues.length > 0) {
            videoInfo = this.props.videoList.filter(item => {
                return item.id.toString() == checkedValues[0];
            });
        }
        if (videoInfo.length == 0) {
            this.setState({ title: '', checkedValues: checkedValues, hasPTZ: false })
            return message.info('没有相关视频内容！');
        }
        let video = videoInfo[0];
        this.setState({
            title: video.location, checkedValues: checkedValues,
            hasPTZ: video.hasPTZ, curSelectedVideoId: video.id
        });
    }
    realTimeVideoInfo = (videoPlayHandle, heartBeatInterval) => {
        if (videoPlayHandle[this.state.curSelectedVideoId.toString()]) {
            this.setState({
                videoPlayHandle: videoPlayHandle,
                curAddress: videoPlayHandle[this.state.curSelectedVideoId.toString()].curAddress,
                curPlayHandle: videoPlayHandle[this.state.curSelectedVideoId.toString()].playHandle,
                heartBeatInterval: heartBeatInterval
            })
        }
    }
    realTimeVideoOnClick = (videoId) => {
        let videoInfo = this.props.videoList.filter(item => {
            return item.id.toString() == videoId;
        });
        if (videoInfo.length == 0)
            return message.error('没有相关视频内容！');
        let video = videoInfo[0];
        this.setState({ title: video.location, hasPTZ: video.hasPTZ, curSelectedVideoId: parseInt(videoId), currSelectedVideoType: video.type });

        if (this.state.videoPlayHandle[videoId]) {
            this.setState({
                curAddress: this.state.videoPlayHandle[videoId].curAddress,
                curPlayHandle: this.state.videoPlayHandle[videoId].playHandle
            })
        }
    }
    maxDisplay = (videoId) => {
        this.setState({ maxVideoId: videoId });
    }
    renderRealTimeVideoPlays = () => {
        const { videoList, videoAccessToken, clientHeight } = this.props;
        const realTimePlays = [];
        this.state.checkedValues.map(cv => {
            let videoInfo = videoList.filter(item => {
                return item.id.toString() == cv;
            });
            if (videoInfo.length == 0)
                return null;
            let video = videoInfo[0];
            if (video.type == 'original') {
                if (cv == this.state.maxVideoId.toString()) {
                    realTimePlays.push(<Col key={`video-play-${cv}`} span={24} style={{ marginBottom: 5 }}>
                        <VideoRealTimePlay
                            videoId={cv}
                            onViewHistoryPlay={this.openHistoryPlayModal}
                            title={video.location}
                            curSelectedVideoId={parseInt(cv)}
                            realTimeVideoInfo={this.realTimeVideoInfo}
                            realTimeVideoOnClick={this.realTimeVideoOnClick}
                            checkedValues={this.state.checkedValues}
                            maxDisplay={this.maxDisplay}
                            isMax={true}
                            videoPlayHandle={this.state.videoPlayHandle}
                        // heartBeatInterval={this.state.heartBeatInterval} 
                        />
                    </Col>);
                } else {
                    realTimePlays.push(<Col key={`video-play-${cv}`} span={12} style={{ marginBottom: 5 }}>
                        <VideoRealTimePlay
                            videoId={cv}
                            onViewHistoryPlay={this.openHistoryPlayModal}
                            title={video.location}
                            curSelectedVideoId={parseInt(cv)}
                            realTimeVideoInfo={this.realTimeVideoInfo}
                            realTimeVideoOnClick={this.realTimeVideoOnClick}
                            checkedValues={this.state.checkedValues}
                            maxDisplay={this.maxDisplay}
                            isMax={false}
                            videoPlayHandle={this.state.videoPlayHandle}
                        // heartBeatInterval={this.state.heartBeatInterval}
                        />
                    </Col>);
                }
            }
            else if (video.type == 'yingshi') {
                let casedata = video.yingshi.rtmpAddress.substring(0, 4)
                switch (casedata) {
                    case 'rtmp':
                        if (!this.isIE() && video['yingshi'].serialNo && (video.channelNo || video.channelNo == 0)) {
                            let url = `ezopen://open.ys7.com/${video['yingshi'].serialNo}/${video.channelNo}.live`;
                            realTimePlays.push(
                                <Col key={`video-play-${cv}`} span={12} style={{ marginBottom: 5 }}>
                                    <Card title={`${video.location ? video.location : ''}`}
                                        extra={
                                            <div>
                                                <span style={{ cursor: 'pointer' }}
                                                    onClick={() => this.openYingShiHistoryPlayModal(cv)}>历史视频 <Icon type='enter'></Icon>
                                                </span>
                                            </div>}
                                        bodyStyle={{ padding: 0 }}
                                        onClick={() => this.realTimeVideoOnClick(cv)}
                                    >
                                        <div style={{ height: clientHeight - 400 }} className="video">
                                            <YSIframePlayer
                                                token={videoAccessToken.accessToken}
                                                url={url}
                                                height="100%"
                                                width="100%"
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            )
                        } else {
                            realTimePlays.push(
                                <Col key={`video-play-${cv}`} span={12} style={{ marginBottom: 5 }}>
                                    <VideoYingShiPlay
                                        // 使用 video 元素播放
                                        onViewHistoryPlay={this.openYingShiHistoryPlayModal}
                                        realTimeVideoOnClick={this.realTimeVideoOnClick}
                                        video={video}
                                        videoId={cv}
                                        isMax={false}
                                    />
                                </Col>
                            );
                        }
                        break;
                    case 'http':
                        realTimePlays.push(
                            <Col key={`video-play-${cv}`} span={12} style={{ marginBottom: 5 }}>
                                <LCVideoPlay video={video} />
                            </Col>
                        );
                        break;
                    default:
                        return null
                }


            }
        });
        return realTimePlays;
    }

    yingshiControl = (direction) => {
        //@todo停止上一次的云控
        const { videoList, videoAccessToken } = this.props;
        const { curSelectedVideoId } = this.state;
        let videoInfo = videoList.filter(si => si.id == curSelectedVideoId)[0];
        let accessToken = videoAccessToken.accessToken;
        let deviceSerial = videoInfo.yingshi.serialNo;
        let channelNo = videoInfo.channelNo;

        let controlParam = {
            accessToken: accessToken,
            deviceSerial: deviceSerial,
            channelNo: channelNo,
            direction: direction,
            speed: 1,
        }
        this.props.dispatch(getYingshiControl(controlParam)).then((data) => {
            if (data.type != YINGSHI_CONTROL_SUCCESS) {
                message.error('操作失败！');
            } else {
                if (data.payload.items.body.code != "200") {
                    message.error(data.payload.items.body.msg);
                }
                setTimeout(() => {
                    this.props.dispatch(stopYingshiControl(controlParam)).then((data) => {//停止云控,不然一直转
                        if (data.type != STOP_YINGSHI_SUCCESS) {
                            message.error('操作失败！');
                        } else
                            if (data.payload.items.body.code != "200") {
                                message.error(data.payload.items.body.msg);
                            }
                    });
                }, 500)
            }
        })
    }

    videoControl = (controlAndTime) => {
        const { currSelectedVideoType } = this.state;
        if (currSelectedVideoType == 'yingshi') {
            let command = controlAndTime.command;
            switch (command) {
                case 0: //近焦距
                    command = 10;
                    break;
                case 10: //左上
                    command = 4;
                    break;
                case 6: //上
                    command = 0;
                    break;
                case 11: //右上
                    command = 6;
                    break;
                case 1: //远焦距
                    command = 11;
                    break;
                case 8: //左
                    command = 2;
                    break;
                case 9: //右
                    command = 3;
                    break;
                case 4: //放大
                    command = 8;
                    break;
                case 5: //缩小
                    command = 9;
                    break;
                case 12: //左下
                    command = 5;
                    break;
                case 7: //下
                    command = 1;
                    break;
                case 13: //右下
                    command = 7;
                    break;
                default:
                    command = -1;
            }
            if (command != -1) {
                this.yingshiControl(command);
            }
        } else {
            controlAndTime.pushServerAddress = this.state.curAddress;
            controlAndTime.playHandle = this.state.curPlayHandle;
            this.props.dispatch(getPTZControlVideo(controlAndTime)).then((data) => {
                var videoResult = data.payload.items;
                if (videoResult) {
                    if (videoResult.status_code == 608) {
                        message.error('播放控制失败!');
                    } else if (videoResult.status_code == 609) {
                        message.error('云台控制失败!');
                    }
                }
            })
        }
    }
    fullScreen = () => {
        if (this.state.nvrIds.includes(this.state.curSelectedVideoId.toString())) {
            if (!videojs(`real_time_video-${this.state.curSelectedVideoId}`).isFullscreen_) {
                videojs(`real_time_video-${this.state.curSelectedVideoId}`).requestFullscreen();
            } else {
                videojs(`real_time_video-${this.state.curSelectedVideoId}`).exitFullscreen();
            }
        } else {
            let elem = document.getElementById(`myPlayer-${this.state.curSelectedVideoId}`);
            let elemEmbed = elem.getElementsByTagName('embed')[0];
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
                fullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen();
                fullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
                fullScreen();
            } else {
                elem.msRequestFullscreen();
                elemEmbed.style.setProperty('width', '100%', '');
                elemEmbed.style.setProperty('height', '100%', '');
                window.onresize = function () {
                    if (!checkFull()) {
                        if (elemEmbed.style.getPropertyValue('width') && elemEmbed.style.getPropertyValue('height')) {
                            elemEmbed.style.removeProperty('width');
                            elemEmbed.style.removeProperty('height');
                        }
                    }
                };
            }
            function fullScreen() {
                elemEmbed.style.width = '100%';
                elemEmbed.style.height = '100%';
                window.onresize = function () {
                    if (!checkFull()) {
                        if (elemEmbed.style.width && elemEmbed.style.height) {
                            elemEmbed.style.cssText = '';
                        }
                    }
                };
            }
            function checkFull() {
                var isFull = document.fullscreen || document.msFullscreenElement;
                if (isFull === undefined) isFull = false;
                return isFull;
            }
        }
    }

    isFlashOk = () => {
        let flag = false;
        if (window.ActiveXObject) {
            try {
                let swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                if (swf) {
                    flag = true;
                }
            } catch (e) {

            }
        } else {
            try {
                let swf = navigator.plugins['Shockwave Flash'];
                if (swf) {
                    flag = true;
                }
            } catch (e) {

            }
        }
        if (!flag) {
            this.setState({ flashTagState: true })
            // message.warning("视频加载异常，请启用flash")
        }
    }

    isIE = () => {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { params, videoList, videoAccessToken } = this.props;
        const { flashTagState, VideoHistoryPlayModalVisit, historyFullScreenFlag, videoId, VideoHistoryPlayYingShiModalVisit,
            historyYingShiFullScreenFlag, currSelectedVideoType } = this.state;
        return <div style={{ margin: '30px 10px 30px 10px' }} >
            <Spin spinning={this.props.isRequesting}>
                <Row style={{ margin: '0 -14px' }}>
                    {/* <QueueAnim delay={300} type={"top"}> */}
                    <Col key="video-list" md={4} sm={24} style={{ padding: '0 14px' }}>
                        <VideoList params={params} getVideoList={this.handleGetVideoList}
                            videoList={params.jump == 'true' ? this.state.stationVideoList : videoList}
                            videoListClick={this.videoListClick} />
                    </Col>
                    <Col key="video-play" md={16} sm={24} style={{ padding: '0 14px' }}>
                        <Card>
                            <Row>
                                <Col span={24} style={{ marginBottom: 5 }}>
                                    <div className="A12" style={{ padding: '0 25px', height: 50, lineHeight: '50px', fontSize: 16 }}>
                                        <span>{`实时视频 ${this.state.title ? "(" + this.state.title + ")" : ''}`}</span>
                                        {/* <span style={{ float: 'right', display: `${flashTagState ? 'block' : 'none'}` }}>
                                            <a href="http://www.adobe.com/go/getflashplayer" rel="nofollow" target="_blank" title="升级Flash插件">启用/下载flash</a>
                                        </span> */}
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                {this.renderRealTimeVideoPlays()}
                            </Row>
                        </Card>

                    </Col>
                    <Col key="video-control" md={4} sm={24} style={{ padding: '0 14px' }}>
                        <VideoControl
                            hasPTZ={this.state.hasPTZ}
                            videoControl={this.videoControl}
                            fullScreen={this.fullScreen}
                            currSelectedVideoType={currSelectedVideoType}
                        />
                    </Col>
                    {/* </QueueAnim> */}
                </Row>
                {
                    VideoHistoryPlayModalVisit ?
                        <VideoHistoryPlayModal
                            closeHistoryPlayModal={this.closeHistoryPlayModal}
                            curSelectedVideoId={videoId}
                            lanchFullscreen={this.lanchFullscreen}
                            exitFullscreen={this.exitFullscreen}
                            historyFullScreenFlag={historyFullScreenFlag}
                        /> : ''
                }
                {
                    VideoHistoryPlayYingShiModalVisit ?
                        this.isIE() ?
                            <VideoYingShiHistoryPlayModal
                                closeHistoryYSPlayModal={this.closeHistoryYSPlayModal}
                                curSelectedVideoId={videoId}
                                lanchFullscreen={this.lanchFullscreen}
                                exitFullscreen={this.exitFullscreen}
                                historyYingShiFullScreenFlag={historyYingShiFullScreenFlag}
                            /> :
                            <YingshiHistoryModal
                                closeHistoryYSPlayModal={this.closeHistoryYSPlayModal}
                                videoAccessToken={videoAccessToken.accessToken}
                                curSelectedVideoId={videoId}
                            />
                        : ''
                }
            </Spin>
        </div >
    }
}

function mapStateToProps(state) {
    const { videoList, stationVideoInfo, realTimeVideo, heartBeatVideo, videoAccessToken, global } = state;
    let isRequesting = realTimeVideo?.isRequesting || videoList?.isRequesting || videoAccessToken?.isRequesting;
    return {
        videoList: videoList.items || [],
        stationVideoInfo: stationVideoInfo.items || [],
        videoUrl: realTimeVideo.items || null,
        heartBeat: heartBeatVideo.items || null,
        isRequesting: isRequesting,
        videoAccessToken: videoAccessToken.items || null,
        clientHeight: global.clientHeight,
    }
}

export default connect(mapStateToProps)(Video);