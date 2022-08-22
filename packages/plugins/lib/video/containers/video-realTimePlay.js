const videojs = require('video.js');
// require('videojs-flash');
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Card, Icon, message, Spin } from 'antd';
import { getRealTimeVideo, getHeartBeatVideo } from '../actions/videoPlay';
class VideoRealTimePlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heartBeatInterval: [],
            heartBeatMark: false,
            videoPlayHandle: {}
        }
    }

    componentDidMount() {
        this.getRealTimeVideoPlay(this.props.curSelectedVideoId);
    }
    // componentWillReceiveProps(nextProps) {
    //     if (this.props.checkedValues.sort().toString() != nextProps.checkedValues.sort().toString()) {
    //         this.setState({ heartBeatMark: false });
    //         // clearInterval(this.state.heartBeatInterval);
    //         this.getRealTimeVideoPlay(nextProps.videoId);
    //     }
    // }

    componentWillUnmount() {
        this.state.heartBeatInterval.map(hbi => {
            clearInterval(hbi);
        })
    }
    getRealTimeVideoPlay = (curSelectedVideoId) => {
        const { videoList } = this.props;
        let videoInfo = videoList.filter(item => {
            return item.id == curSelectedVideoId;
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
            pushServerAddress: video.pushServerAddress
        };
        this.props.dispatch(getRealTimeVideo(nvrInfo)).then((data) => {
            let videoResult = data.payload.items;
            if (videoResult) {
                if (videoResult.status_code == 200) {
                    this.loadRealTimeVideo(curSelectedVideoId).then(() => {
                        this.setState({ heartBeatMark: true });
                    }).then(() => {
                        this.heartBeat(video.location, video.pushServerAddress, data.payload.items.play_handle);
                        this.setRealTimeVideoCurInfo(curSelectedVideoId, video.pushServerAddress, data.payload.items.play_handle);
                    });
                } else if (videoResult.status_code == 600) {
                    message.error(`${video.location}-输入参数错误!`);
                } else if (videoResult.status_code == 601) {
                    message.error(`${video.location}-桢分时失败!`);
                } else if (videoResult.status_code == 602) {
                    message.error(`${video.location}-连接rtmp server错误!`);
                } else if (videoResult.status_code == 603) {
                    message.error(`${video.location}-实时播放失败!`);
                } else if (videoResult.status_code == 605) {
                    message.error(`${video.location}-未找到播放项!`);
                } else if (videoResult.status_code == 606) {
                    message.error(`${video.location}-NVR登录失败!`);
                } else {
                    message.error(`${video.location}-未找到视频文件`);
                }
            }
            else {
                message.error('没有找到视频文件！');
            }
        })
    }
    setRealTimeVideoCurInfo = (curSelectedVideoId, pushServerAddress, playHandle) => {
        this.props.videoPlayHandle[curSelectedVideoId.toString()] = {
            curAddress: pushServerAddress,
            playHandle: playHandle
        }
        this.props.realTimeVideoInfo(this.props.videoPlayHandle, this.state.heartBeatInterval);

    }
    loadRealTimeVideo = (curSelectedVideoId) => {
        const { videoUrl } = this.props;
        if (videoUrl != null) {
            let url = videoUrl.rtmp_url;
            let myPlayer = videojs(`real_time_video-${curSelectedVideoId}`);
            myPlayer.ready(function () {
                myPlayer.src(
                    [{ type: "rtmp/flv", src: url, withCredentials: true }]
                );
                myPlayer.reset();
                // myPlayer.load();
                setTimeout(function () {
                    myPlayer.play();
                    //resolve();
                }, 100);

            });
        }
        return Promise.resolve();
    }
    //心跳
    heartBeat = (location, address, playHandle) => {
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
                            message.error(`${location}-未找到播放项!`);
                            clearInterval(heartBeatInterval);
                        }
                    });
            }, 10000);
            this.state.heartBeatInterval.push(heartBeatInterval);
            // this.props.heartBeatInterval.push(heartBeatInterval);
            // this.setState({
            //     heartBeatInterval: this.props.heartBeatInterval
            // });
        } else {
            // this.props.heartBeatInterval.map(hbi => {
            //     clearInterval(hbi);
            // })
            // clearInterval(this.state.heartBeatInterval);
        }
    }
    realTimeVideoOnClick = () => {
        const { videoId } = this.props;
        this.props.realTimeVideoOnClick(videoId);
    }
    maxDisplay = (videoId) => {
        if (!this.props.isMax) {
            this.props.maxDisplay(videoId);
        } else {
            this.props.maxDisplay(0);
        }
    }
    render() {
        const { onViewHistoryPlay, title, clientHeight, videoId, isMax } = this.props;
        const height = clientHeight - (isMax ? 200 : 400);
        return (
            <Card title={`${title ? title : ''}`}
                extra={
                    <div><span style={{ cursor: 'pointer' }}
                        onClick={() => onViewHistoryPlay(videoId)}>历史视频 <Icon type='enter'></Icon> | </span>
                        <span style={{ cursor: 'pointer' }} title={isMax ? '最小化' : '最大化'}
                            onClick={_ => this.maxDisplay(videoId)}>
                            <Icon type={isMax ? 'shrink' : 'arrows-alt'}></Icon> </span>
                    </div>}
                bodyStyle={{ padding: 0 }}
                onClick={this.realTimeVideoOnClick} >
                <Spin spinning={this.props.isRequesting}>
                    <div style={{ height: height, lineHeight: height }}>
                        <video id={`real_time_video-${videoId}`} style={{ height: '100%', width: '100%' }}
                            className="video-js vjs-default-skin"
                            data-setup='{"autoplay": true }'
                        >
                        </video>
                    </div>
                </Spin>
            </Card >
        );
    }
}

function mapStateToProps(state) {
    const { global, videoList, stationVideoInfo, realTimeVideo, heartBeatVideo, ptzControlVideo } = state;
    let isRequesting = realTimeVideo.isRequesting || ptzControlVideo.isRequesting;
    return {
        clientHeight: global.clientHeight,
        videoList: videoList.items,
        stationVideoInfo: stationVideoInfo.items,
        videoUrl: realTimeVideo.items,
        heartBeat: heartBeatVideo.items,
        isRequesting: isRequesting
    }
}

export default connect(mapStateToProps)(VideoRealTimePlay);