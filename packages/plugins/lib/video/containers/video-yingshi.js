import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Icon } from 'antd';

class VideoYingShiPlay extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.play();
    }
    play = () => {
        const { videoId } = this.props;
        let player = new EZUIPlayer(`myPlayer-${videoId}`);
        player.on('play', function () {
            console.log(`myPlayer-${videoId}-play`);
        });
        player.on('error', e => {
            console.log(`myPlayer-${videoId}-error-${e}`);
        });
        player.on('pause', function () {
            console.log(`myPlayer-${videoId}-pause`);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.clientHeight != nextProps.clientHeight) {
            let elem = document.getElementById(`myPlayer-${nextProps.videoId}`);
            let elemEmbed = elem.getElementsByTagName('embed')[0];
            if (elemEmbed) {
                elemEmbed.height = nextProps.clientHeight - (nextProps.isMax ? 200 : 400);
            }
        }
    }
    realTimeVideoOnClick = () => {
        const { videoId } = this.props;
        this.props.realTimeVideoOnClick(videoId);
    }

    render() {
        const { onViewHistoryPlay, video, videoId, clientHeight, isMax } = this.props;
        const title = video.location;
        const height = clientHeight - (isMax ? 200 : 400);
        return (
            <Card title={`${title ? title : ''}`}
                extra={
                    <div>
                        <span style={{ cursor: 'pointer' }}
                            onClick={() => onViewHistoryPlay(videoId)}>历史视频 <Icon type='enter'></Icon></span>
                        {/* <span style={{ cursor: 'pointer' }} title={isMax ? '最小化' : '最大化'}
                            onClick={_ => this.maxDisplay(videoId)}>
                            <Icon type={isMax ? 'shrink' : 'arrows-alt'}></Icon> </span> */}
                    </div>}
                bodyStyle={{ padding: 0 }}
                onClick={this.realTimeVideoOnClick}
            >
                <div style={{ height: height }} className="video">
                    <video id={`myPlayer-${videoId}`} poster="" autoPlay
                        style={{ height: height }}
                    >
                        <source src={video.yingshi.rtmpAddress} type="" />
                    </video>
                </div>
            </Card >
        );
    }
}

function mapStateToProps(state) {
    const { global } = state;
    return {
        clientHeight: global.clientHeight,
    }
}

export default connect(mapStateToProps)(VideoYingShiPlay);