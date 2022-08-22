import React from 'react';
import { Spin } from 'antd';
import flvjs from 'flv.js/dist/flv.min';
// 示例地址：http://img.ksbbs.com/asset/Mon_1704/15868902d399b87.flv
class FlvVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.realtimeFlv = null;
  }

  componentDidMount() {
    const { url, domId } = this.props;
    if (flvjs.isSupported()) {
      const videoElement = document.getElementById(domId);
      try {
        this.realtimeFlv = flvjs.createPlayer({
          // 创建播放器
          type: 'flv',
          // cors: true, // 是否允许跨域
          // isLive: false, // 是否是直播
          url,
        });
        this.realtimeFlv.attachMediaElement(videoElement); // 传入对应document元素，用于绑定视频播放
        this.realtimeFlv.load(); // 开始加载
        // eslint-disable-next-line no-underscore-dangle
        const _this = this;
        this.realtimeFlv.on(flvjs.Events.ERROR, (event, data) => {
          // 播放出错时的处理
          _this.setState({
            isLoading: false,
          });
          _this.pausemix();
          // console.log("视频报错：" + event + data);
          if (!_this.state.alreadyAlarm) {
            _this.setState({
              alreadyAlarm: true,
            });
            // message.error("找不到视频文件！请检查nvr配置或网络");
          }
        });
        this.realtimeFlv.on(flvjs.Events.LOADING_COMPLETE, (event, data) => {
          console.log('加载完成');
        });
        this.realtimeFlv.on(flvjs.Events.METADATA_ARRIVED, (event, data) => {
          console.log('arrived');
        });
        videoElement.addEventListener('canplay', (e) => {
          // 当视频可以播放时的监听
          this.setState({
            isLoading: true,
          });
          this.realtimeFlv.play(); // 开始播放视频
        });
      } catch (error) {
        console.log(`error:${error}`);
      }
    }
  }

  componentWillUnmount() {
    console.log('销毁nvr');
    this.pausemix();
  }

  pausemix = () => {
    if (this.realtimeFlv) {
      try {
        this.realtimeFlv.pause();
        this.realtimeFlv.unload();
        this.realtimeFlv.detachMediaElement();
        this.realtimeFlv.destroy();
        this.realtimeFlv = null;
      } catch (error) { }
    }
  };

  render() {
    const {
      domId, width, height, style = {},
    } = this.props;
    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {!this.state.isLoading ? (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin />
          </div>
        ) : null}
        <video
          id={domId}
          style={{
            objectFit: 'fill',
            width,
            height,
          }}
          muted
          controls="controls"
        />
      </div>
    );
  }
}
export default FlvVideo;
