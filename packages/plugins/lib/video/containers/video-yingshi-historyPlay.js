import React, { Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Modal, Card, Button, Row, Col, Slider, message, Spin, DatePicker, Form, Icon } from 'antd';
// import DatePicker from '../../../components/DatePicker';
import { getVideoAccessToken } from '../actions/video';
import * as types from '../constants/msgtype';

class VideoYingShiHistoryPlayModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: this.props.startTime ? this.props.startTime : moment().add(-24, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            endTime: this.props.endTime ? this.props.endTime : moment().format('YYYY-MM-DD HH:mm:ss'),
            sliderInterval: null,
            flag: false,
            curTime: 0,
            heartBeatInterval: null,
            fullScreenFlag: false,
            disabled: false,
            title: '',
            playOcxFlag: false
        }
    }
    componentWillMount() {
        const that = this;
        document.addEventListener("keydown", () => {
            if (window.event.key == 'Esc') {
                that.exitFullscreen()
            }
        });
    }
    componentDidMount() {
        window.PluginEventHandler = this.PluginEventHandler;
        this.props.dispatch(getVideoAccessToken()).then(res => {
            this.queryData();
        });
    }
    componentWillUnmount() {
        clearInterval(this.state.sliderInterval);
        if (this.state.playOcxFlag) {
            var playOcx = document.getElementById("EZUIKit");
            var res = playOcx.StopPlay();
            if (0 != res) {
                alert("StopPlay Error！");
            }
        }
    }
    handleCancel = () => {
        const { closeHistoryYSPlayModal } = this.props;
        closeHistoryYSPlayModal();
    }
    onStartChange = (value) => {
        this.setState({ startTime: value.format('YYYY-MM-DD HH:mm:ss') });
    }
    onEndChange = (value) => {
        this.setState({ endTime: value.format('YYYY-MM-DD HH:mm:ss') });
    }
    TestActiveX() {
        try {
            var ax = new ActiveXObject("EZOPENUIACTIVEXK.EzOpenUIActiveXKCtrl.1");
            return true;
        } catch (e) {
            return message.warning('请使用IE浏览器，并检查EZUIKit控件是否安装！');
        }
    }
    queryData = () => {
        const _this = this;
        const { videoList } = this.props;
        const { startTime, endTime } = this.state;
        let videoInfo = videoList.filter(item => {
            return item.id.toString() == this.props.curSelectedVideoId;
        });
        if (videoInfo.length == 0)
            return message.error('没有相关视频内容！');
        let video = videoInfo[0];
        if (video) {
            this.setState({ title: video.location });
            clearInterval(_this.state.sliderInterval);
        }

        this.props.form.validateFields(['startTimeSelected', 'endTimeSelected'], { force: true });
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('表单中有错误信息!!!');
                return;
            }
            let flag = this.TestActiveX();
            if (flag != true)
                return null
            //得到控件引用

            var playOcx = document.getElementById("EZUIKit");
            const currStartTime = moment(startTime).format('YYYYMMDDHHmmss');
            const currEndTime = moment(endTime).format('YYYYMMDDHHmmss');
            let url = `${video.yingshi.hlsAddress}?begin=${currStartTime}&end=${currEndTime}`;
            if (video.yingshi.serialNo && video.channelNo) {
                url = `ezopen://open.ys7.com/${video.yingshi.serialNo}/${video.channelNo}.rec?begin=${currStartTime}&end=${currEndTime}`
            }
            let text = {
                "AppKey": "5d16a667e1c2423d9d0d634f781810b4",
                "AccessToken": this.props.videoAccessToken.accessToken,
                "Url": url
            }
            var appkey = text.AppKey;
            var accesstoken = text.AccessToken;
            var ezurl = text.Url;
            var res = playOcx.InitWithAppKey(appkey);
            if (0 != res) {
                message.warning("初始化EZUIKit失败!");
                return;
            }
            var res = playOcx.SetAccessToken(accesstoken);
            if (0 != res) {
                message.warning("设置授权token失败!");
                return;
            }
            var playOcx = document.getElementById("EZUIKit");//得到控件引用
            var res = playOcx.StartPlay(ezurl);
            if (0 == res) {
                this.setState({ playOcxFlag: true });
                _this.sliderChangeValue(Date.parse(startTime.replace(/-/g, '/')), Date.parse(endTime.replace(/-/g, '/')), true);
            }
        });
    }

    PluginEventHandler = (lEventType, strErrorCode, lInterErrorCode) => {
        switch (lEventType) {
            case types.EZUI_MSGID_PLAY_START:		//播放开始
                {
                    var info;
                    info = "播放成功!";
                }
                break;
            case types.EZUI_MSGID_PLAY_EXCEPTION:	//播放异常
                {
                    var errinfo;
                    if (strErrorCode == types.EZUI_ERROR_ACCESSTOKEN_EXPIRE) {
                        errinfo = "accesstoken异常或失效，需要重新获取accesstoken，并传入到sdk";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_APPKEY_TOKEN_NOT_MATCH) {
                        errinfo = "ppkey和AccessToken不匹配,建议更换appkey或者AccessToken";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_CHANNEL_NOT_EXIST) {
                        errinfo = "通道不存在，设备参数错误，建议重新获取播放地址";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_DEVICE_NOT_EXIST) {
                        errinfo = "设备不存在，设备参数错误，建议重新获取播放地址";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_PARAM_INVALID) {
                        errinfo = "参数错误，建议重新获取播放地址";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_EZOPEN_URL_INVALID) {
                        errinfo = "播放地址错误,建议重新获取播放地址";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_NO_RESOURCE) {
                        errinfo = "设备连接数过大，停止其他连接后再试试";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_DEVICE_OFFLINE) {
                        errinfo = "设备不在线，确认设备上线之后重试";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_CONNECT_DEVICE_TIMEOUT) {
                        errinfo = "播放失败，请求连接设备超时，检测设备网路连接是否正常.";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_INNER_VERIFYCODE) {
                        errinfo = "视频验证码错误，建议查看设备上标记的验证码";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_PLAY_FAIL) {
                        errinfo = "视频播放失败";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_TERMINAL_BINDING) {
                        errinfo = "当前账号开启了终端绑定，只允许指定设备登录操作";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_DEVICE_INFO_INVALID) {
                        errinfo = "设备信息异常为空，建议重新获取播放地址";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_VIDEO_RECORD_NOTEXIST) {
                        errinfo = "未查找到录像文件";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_VTDU_NO_RESOURCE) {
                        errinfo = "取流并发路数限制,请升级为企业版.";
                    }
                    else if (strErrorCode == types.EZUI_ERROR_UNSUPPORTED) {
                        errinfo = "设备不支持的清晰度类型, 请根据设备预览能力级选择";
                    }

                    var info = "播放失败," + errinfo + ".错误码:" + strErrorCode + ", 内部错误码:" + lInterErrorCode;
                    message.warning(info);
                }
                break;
            case types.EZUI_MSGID_PLAY_STOP:			//播放停止
                {
                }
                break;
            case types.EZUI_MSGID_RECORD_FILE:		//录像搜索成功
                {
                    // gPlaybackSearchRecord = "录像搜索成功:" + strErrorCode;
                    var info = "录像搜索成功" + strErrorCode;
                }
                break;
            case types.EZUI_MSGID_VOICETALK_START:		//对讲开启
                {
                    var info = "对讲开启成功";
                }
                break;
            case types.EZUI_MSGID_VOICETALK_STOP:		//对讲开启
                {
                    var info = "对讲停止成功";
                }
                break;
            case types.EZUI_MSGID_PTZCTRL_SUCCESS:		//云台控制成功
                {
                    var info = "云台控制信令发送成功";
                }
                break;
            case types.EZUI_MSGID_PTZCTRL_FAILED:		//云台控制失败
                {
                    var info = "云台控制失败";
                }
                break;
            default:
        }
    }
    formatter = () => {
        return new Date(parseFloat(this.state.curTime)).Format("yyyy-MM-dd hh:mm:ss");
    };
    onChange = (value) => {
        this.setState({ curTime: value });
    };
    onAfterChange = (value) => {
        const _this = this;
        let flag = this.TestActiveX();
        if (flag != true)
            return null
        const { videoList } = this.props;
        let videoInfo = videoList.filter(item => {
            return item.id.toString() == this.props.curSelectedVideoId;
        });
        if (videoInfo.length == 0)
            return message.error('没有相关视频内容！');
        let video = videoInfo[0];
        clearInterval(this.state.sliderInterval);

        //得到控件引用
        var playOcx = document.getElementById("EZUIKit");
        const currStartTime = new Date(parseFloat(value)).Format("yyyyMMddhhmmss");
        const currEndTime = moment(this.state.endTime).format('YYYYMMDDHHmmss');
        let url = `${video.yingshi.hlsAddress}?begin=${currStartTime}&end=${currEndTime}`;
        if (video.yingshi.serialNo && video.channelNo) {
            url = `ezopen://open.ys7.com/${video.yingshi.serialNo}/${video.channelNo}.rec?begin=${currStartTime}&end=${currEndTime}`
        }
        let text = {
            "AppKey": "5d16a667e1c2423d9d0d634f781810b4",
            "AccessToken": this.props.videoAccessToken.accessToken,
            "Url": url
        }
        var appkey = text.AppKey;
        var accesstoken = text.AccessToken;
        var ezurl = text.Url;
        var res = playOcx.InitWithAppKey(appkey);
        if (0 != res) {
            message.warning("初始化EZUIKit失败!");
            return;
        }
        var res = playOcx.SetAccessToken(accesstoken);
        if (0 != res) {
            message.warning("设置授权token失败!");
            return;
        }
        var playOcx = document.getElementById("EZUIKit");//得到控件引用
        var resStop = playOcx.StopPlay();
        var res = playOcx.StartPlay(ezurl);
        if (0 == res) {
            _this.setState({ playOcxFlag: true });
            _this.sliderChangeValue(value, Date.parse(this.state.endTime.replace(/-/g, '/')), true);
        }
    }
    sliderChangeValue = (start, end, playFlag) => {
        if (playFlag == true) {
            if (start < end) {
                let sliderInterval = null;
                sliderInterval = setInterval(() => {
                    if (start < end) {
                        this.setState({ curTime: start });
                        start = parseInt(start) + 1000;
                    } else {
                        message.info('播放结束!');
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

    checkFull = () => {
        var isFull = document.fullscreen || document.msFullscreenElement;
        if (isFull === undefined) isFull = false;
        return isFull;
    }

    fullScreen = () => {
        const { lanchFullscreen } = this.props;
        const elem = document.getElementById('EZUIKit');
        lanchFullscreen(document.getElementById('historyYingShiVideoDom'));
        setTimeout(function () {
            const clientHeight = document.body.clientHeight;
            elem.style.setProperty('width', '100%', '');
            elem.style.setProperty('height', clientHeight - 36 + 'px', '');
        }, 500)
    }

    checkStartTime = (rule, value, callback) => {
        const { endTime } = this.state;
        if (new Date(value).Format("yyyy-MM-dd hh:mm:ss") < endTime) {
            callback();
        } else callback('开始时间需小于结束时间');
    }
    checkEndTime = (rule, value, callback) => {
        const { startTime } = this.state;
        if (startTime < new Date(value).Format("yyyy-MM-dd hh:mm:ss")) {
            callback();
        } else callback('开始时间需小于结束时间');
    }

    render() {
        const { clientHeight, clientWidth, historyYingShiFullScreenFlag, exitFullscreen } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const clientHeight_ = document.body.clientHeight;
        return (
            <div style={{ position: 'fixed', top: 60 + 15, left: 15, zIndex: 1 }}>
                <Card title={`历史视频${this.state.title ? "（" + this.state.title + "）" : ''}`}
                    bodyStyle={{ padding: 0, width: clientWidth - 30, height: clientHeight - 47 - 30 }}
                    extra={<Icon onClick={this.handleCancel} type="close" style={{ fontSize: 16 }} />}
                >
                    <Spin spinning={this.props.isRequesting}>
                        <div style={{ padding: 10 }} >
                            <div style={{ width: '20%', height: '100%', float: 'left' }}>
                                <Form style={{ marginTop: 20 }}>
                                    <Form.Item label='开始时间:' {...formItemLayout}>
                                        {getFieldDecorator('startTimeSelected', {
                                            rules: [{ validator: this.checkStartTime }],
                                            initialValue: moment(this.state.startTime)
                                        })
                                            (<DatePicker
                                                style={{ width: "95%" }}
                                                placeholder="开始时间"
                                                format="YYYY-MM-DD HH:mm:ss"
                                                showTime
                                                onChange={this.onStartChange}
                                            />)}
                                    </Form.Item>
                                    <Form.Item label='结束时间' {...formItemLayout}>
                                        {getFieldDecorator('endTimeSelected', {
                                            rules: [{ validator: this.checkEndTime }],
                                            initialValue: moment(this.state.endTime)
                                        })
                                            (<DatePicker
                                                style={{ width: "95%" }}
                                                placeholder="结束时间"
                                                format="YYYY-MM-DD HH:mm:ss"
                                                showTime
                                                onChange={this.onEndChange}
                                            />)}
                                    </Form.Item>
                                    <Form.Item label='' {...formItemLayout}>
                                        <Button onClick={this.queryData} type="primary" style={{ float: 'right' }}>播放</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div id="historyYingShiVideoDom" style={{
                                width: historyYingShiFullScreenFlag ? '100%' : '80%',
                                height: '100%',
                                float: 'left',
                                textAlign: 'center',
                                backgroundColor: '#000'
                            }}>
                                <object classID="clsid:54FC7795-1014-4BF6-8BA3-500C61EC1A05"
                                    id="EZUIKit" width="890"
                                    height="650"
                                    name="EZUIKit" >
                                </object>
                                <div
                                    style={Object.assign(historyYingShiFullScreenFlag ? {
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        position: 'absolute',
                                        bottom: 0,
                                    } : {
                                            backgroundColor: 'white',
                                        },
                                        {
                                            width: '100%', lineHeight: '32px', paddingTop: 32
                                        })
                                    }
                                >
                                    <Row id='fullscreenShow' >
                                        <Col span={3}>
                                            <span style={{
                                                float: 'right', marginRight: 16
                                            }}>{this.state.startTime}</span>
                                        </Col>
                                        <Col span={18}>
                                            <Slider
                                                min={Date.parse(this.state.startTime.replace(/-/g, '/'))}
                                                max={Date.parse(this.state.endTime.replace(/-/g, '/'))}
                                                step={1000}
                                                value={this.state.curTime}
                                                tipFormatter={this.formatter}
                                                onChange={this.onChange.bind(this)}
                                                onAfterChange={this.onAfterChange.bind(this)}
                                            />
                                        </Col>
                                        <Col span={3}>
                                            <span style={{ float: 'left', marginLeft: '16px' }}>
                                                <span style={{ marginRight: '5px' }}>
                                                    {this.state.endTime}</span>
                                                <span onClick={historyYingShiFullScreenFlag ? exitFullscreen : this.fullScreen}
                                                    style={{ marginRight: 2, float: 'right' }}>
                                                    <img src={`../../../../assets/video/${historyYingShiFullScreenFlag ? 'suoxiao' : 'fangda'}-hui.png`}
                                                        style={{ height: '13px' }} /></span>
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </Spin>
                </Card>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { global, videoList, videoAccessToken } = state;
    return {
        clientHeight: global.clientHeight,
        clientWidth: global.clientWidth,
        videoList: videoList.items,
        videoAccessToken: videoAccessToken.items,
        isRequesting: videoList.isRequesting || videoAccessToken.isRequesting
    }
}
export default connect(mapStateToProps)(VideoYingShiHistoryPlayModal);