import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Card, Menu, Icon, Checkbox, message } from 'antd';
import moment from 'moment';
class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultSelectedKeys: [],
            infoTime: moment().subtract(3, 'seconds')
        }
    }
    videoListClick = (checkedValues) => {
        if (checkedValues.length < 5)
            this.props.videoListClick(checkedValues);
        else {
            checkedValues.pop();
            if (moment().subtract(3, 'seconds') >= this.state.infoTime) {
                message.info('最多4个同时播放！');
                this.setState({
                    infoTime: moment()
                })
            }
        }
    }
    renderList = () => {
        const { params, videoList } = this.props;
        let list = [];

        videoList.map(v => {
            list.push(
                <Menu.Item key={`${v.id}`}>
                    <Checkbox value={`${v.id.toString()}`}>{v.location}</Checkbox>
                </Menu.Item>
            );
        });
        return list;
    }
    render() {
        const { params, videoList } = this.props;
        let defaultSelectedKeys = [];
        videoList.map(v => {
            if (defaultSelectedKeys.length < 4) {
                defaultSelectedKeys.push(v.id.toString());
            }
        })

        return (
            <Card>
                <h1>视频列表</h1>
                <div>
                    {
                        params.jump == 'true' ? <div style={{ paddingTop: 5 }}>
                            <div style={{
                                padding: 10, margin: 10, cursor: 'pointer'
                            }} onClick={this.props.getVideoList} >查看所有视频<Icon type="rollback" style={{ float: 'right' }} /></div> </div> : null
                    }  {
                        videoList.length > 0 ?
                            <Checkbox.Group defaultValue={defaultSelectedKeys} onChange={values => this.videoListClick(values)}>
                                <Menu
                                    className="video-menu" mode="vertical"
                                >
                                    {this.renderList()}
                                </Menu>
                            </Checkbox.Group> :
                            null
                    }
                </div>
            </Card >
        );
    }
}

export default connect()(VideoList);