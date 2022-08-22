import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';

class VideoControl extends Component {
    //云控功能
    videoControl = (controlType, time) => {
        const controlAndTime = {
            command: controlType,
            duration: time
        };
        this.props.videoControl(controlAndTime);
    }
    fullScreen = () => {
        this.props.fullScreen();
    }
    render() {
        const { currSelectedVideoType } = this.props;
        return (
            <Card>
                <h1>云台控制</h1>
                <div>
                    {this.props.hasPTZ ?
                        <div>
                            <Row>
                                <Col span={12} >
                                    <div style={{
                                        textAlign: 'center', width: '100%',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '2px'
                                    }}>
                                        <div style={{ cursor: 'pointer', padding: '20px 0', background: 'rgb(71, 95, 122)', borderRadius: '6px' }}
                                            onClick={this.videoControl.bind(this, 0, 200)} >
                                            <img style={{
                                                verticalAlign: 'middle', width: '30px'
                                            }}
                                                alt="调焦+" title="焦距变大" src="../../../../assets/video/ren.png" />
                                            <div style={{ paddingTop: '3px' }}>
                                                <span style={{ fontSize: '14px' }}>焦距变大</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div style={{
                                        textAlign: 'center', width: '100%',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '2px'
                                    }}>
                                        <div style={{ cursor: 'pointer', padding: '20px 0', background: 'rgb(71, 95, 122)', borderRadius: '6px' }}
                                            onClick={this.videoControl.bind(this, 1, 200)} >
                                            <img style={{
                                                verticalAlign: 'middle', width: '30px'
                                            }}
                                                alt="调焦-" title="焦距变小"
                                                src="../../../../assets/video/sangeren.png" />
                                            <div style={{ paddingTop: '3px' }}>
                                                <span style={{ fontSize: '14px' }}>焦距变小</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            {currSelectedVideoType == "yingshi" ? "" :
                                <Row>
                                    <Col span={12} >
                                        <div style={{
                                            textAlign: 'center', width: '100%',
                                            boxShadow: "0px 1px 3px #3A4D62",
                                            padding: '2px'
                                        }}>
                                            <div style={{ cursor: 'pointer', padding: '20px 0', background: 'rgb(71, 95, 122)', borderRadius: '6px' }}
                                                onClick={this.videoControl.bind(this, 2, 200)} >
                                                <img style={{
                                                    verticalAlign: 'middle', width: '30px'
                                                }}
                                                    alt="聚焦+" title="焦点前调"
                                                    src="../../../../assets/video/jujiao-fangda.png" />
                                                <div style={{ paddingTop: '3px' }}>
                                                    <span style={{ fontSize: '14px' }}>焦点前调</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{
                                            textAlign: 'center', width: '100%',
                                            boxShadow: "0px 1px 3px #3A4D62",
                                            padding: '2px'
                                        }}>
                                            <div style={{ cursor: 'pointer', padding: '20px 0', background: 'rgb(71, 95, 122)', borderRadius: '6px' }}
                                                onClick={this.videoControl.bind(this, 3, 200)} >
                                                <img style={{
                                                    verticalAlign: 'middle', width: '30px'
                                                }}
                                                    alt="聚焦-" title="焦点后调"
                                                    src="../../../../assets/video/jujiao-suoxiao.png" />
                                                <div style={{ paddingTop: '3px' }}>
                                                    <span style={{ fontSize: '14px' }}>焦点后调</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            }
                            <Row>
                                <Col span={12}>
                                    <div style={{
                                        textAlign: 'center', width: '100%',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '2px'
                                    }}>
                                        <div style={{ cursor: 'pointer', padding: '20px 0', background: 'rgb(71, 95, 122)', borderRadius: '6px' }}
                                            onClick={this.videoControl.bind(this, 4, 200)} >
                                            <img style={{
                                                verticalAlign: 'middle', width: '30px'
                                            }}
                                                alt="光圈+" title="光圈扩大"
                                                src="../../../../assets/video/guangquan-fangda.png" />
                                            <div style={{ paddingTop: '3px' }}>
                                                <span style={{ fontSize: '14px' }}>光圈扩大</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div style={{
                                        textAlign: 'center', width: '100%',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '2px'
                                    }}>
                                        <div style={{ cursor: 'pointer', padding: '20px 0', background: 'rgb(71, 95, 122)', borderRadius: '6px' }}
                                            onClick={this.videoControl.bind(this, 5, 200)}>
                                            <img style={{
                                                verticalAlign: 'middle', width: '30px'
                                            }}
                                                alt="光圈-" title="光圈缩小"
                                                src="../../../../assets/video/guangquan-suoxiao.png" />
                                            <div style={{ paddingTop: '3px' }}>
                                                <span style={{ fontSize: '14px' }}>光圈缩小</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '20px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: 'rgb(71, 95, 122)'
                                    }} title="左上" onClick={this.videoControl.bind(this, 10, 200)} >
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px", transform: 'rotate(-45deg)'
                                        }} src="../../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '20px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: '#475F7A'
                                    }} title="上" onClick={this.videoControl.bind(this, 6, 200)} >
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px"
                                        }} src="../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '20px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: 'rgb(71, 95, 122)'
                                    }} title="右上" onClick={this.videoControl.bind(this, 11, 200)} >
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px", transform: 'rotate(45deg)'
                                        }} src="../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '0px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: '#475F7A'
                                    }} title="左" onClick={this.videoControl.bind(this, 8, 200)} >
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px", transform: 'rotate(-90deg)'
                                        }} src="../../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '0px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '10px 0',
                                        borderRadius: '6px',
                                        background: '#475F7A'
                                    }}
                                        title={currSelectedVideoType != 'yingshi' ? "全屏" : ''}
                                        onClick={currSelectedVideoType != 'yingshi' ? this.fullScreen : null}
                                    >
                                        <img style={{
                                            verticalAlign: 'middle', width: "30px",
                                            visibility: currSelectedVideoType != 'yingshi' ? 'visible' : 'hidden'
                                        }} src="../../../../assets/video/fangda.png" />
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '0px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: '#475F7A'
                                    }} title="右" onClick={this.videoControl.bind(this, 9, 200)}>
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px", transform: 'rotate(90deg)'
                                        }} src="../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '20px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: 'rgb(71, 95, 122)'
                                    }} title="左下" onClick={this.videoControl.bind(this, 12, 200)} >
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px", transform: 'rotate(-135deg)'
                                        }} src="../../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '20px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: '#475F7A'
                                    }} title="下" onClick={this.videoControl.bind(this, 7, 200)} >
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px", transform: 'rotate(180deg)'
                                        }} src="../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{
                                        cursor: 'pointer',
                                        textAlign: 'center', width: '80%',
                                        margin: '20px 10px',
                                        boxShadow: "0px 1px 3px #3A4D62",
                                        padding: '15px 0',
                                        borderRadius: '6px',
                                        background: 'rgb(71, 95, 122)'
                                    }} title="右下" onClick={this.videoControl.bind(this, 13, 200)} >
                                        <img style={{
                                            verticalAlign: 'middle', width: "18px", transform: 'rotate(135deg)'
                                        }} src="../../../../assets/video/shang.png" />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        : <div style={{ margin: "25px 15px 25px 25px" }}>无此功能</div>}
                </div>
            </Card>
        );
    }
}

export default VideoControl;