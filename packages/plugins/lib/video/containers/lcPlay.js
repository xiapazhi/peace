import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd'
class LCVideoPlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        }
    }

    componentDidMount() {
        SewisePlayer.setup({
            server: "vod",  //服务器给播放器提供的数据请求接口方法   
            type: "m3u8",     //支持视频格式为m3u8
            autostart: "true",   //是否自动播放（true为自动播放，false为不自动播放，默认为true）
            poster: "http://jackzhang1204.github.io/materials/poster.png",  //视频停止时，播放器上面显示的背景图片(若没有设置图片或者图片路径不对，则显示黑色背景)
            videourl: this.props.video.yingshi.rtmpAddress,   //您的视频源的地址
            skin: "vodOrange",  //播放器主题风格（样式）
            title: this.props.video.location,     //视频标题，位于视频的左上角（可以进行修改操作）
            claritybutton: "disable", //清晰度按钮的显示（默认为显示，disable为不显示，enable为显示）
            lang: "zh_CN"   //视频播放器下面的一系列操作元素的提示信息的语言格式（zh_cN为中文）
        }, this.props.video.id);
    }

    render() {
        const { video, clientHeight } = this.props;
        const height = clientHeight - 400;
        const title = video.location;
        return (
            <Card title={`${title ? title : ''}`} >
                <div style={{ height: height }} className="video" >
                    <div id={video.id} style={{ width: '100%', height: '100%' }}></div>
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

export default connect(mapStateToProps)(LCVideoPlay);