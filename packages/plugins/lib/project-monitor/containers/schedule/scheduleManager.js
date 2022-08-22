/**
 * Created by wuqun on 2018/05/03.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal, Button, Row, Col, message, Upload, Card, Popconfirm, Spin, Tag, Tooltip,
} from 'antd';

import moment from 'moment';
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';

import { AuthorizationCode, Func } from '$utils';

import { getScheduleMonthList, deleteSchedule } from '../../actions/schedule';

const inputName = {
  naturalEnvi: '自然环境',
  constructionStatus: '施工工况',
  supporting: '支护结构',
  surroundings: '周边环境',
  facilities: '监测设施',
};
const manualItemType = '2';// 人工巡检类型

const ext = {
  video: ['.mp4'],
};
const extImg = {
  image: ['.png', '.jpg'],
};
class ScheduleManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: null,
      // showOptionModal: true
    };
  }

  handleDelete = (schedule) => {
    this.props.dispatch(deleteSchedule(schedule.id)).then((_) => {
      // const files = schedule.files;
      // files.map(file => {
      //     this.props.dispatch(deleteFile(file.id, "schedule")).then(_ => {
      //         if (_.type == 'DELETE_FILE_SUCCESS') {
      //             this.props.dispatch(removeFile(file.link, file.name))
      //         }
      //     })
      // })
      const projects = {
        projects: this.props.projects,
      };
      this.props.dispatch(getScheduleMonthList(this.props.userId, projects, moment(this.props.selectValue).format('YYYY-MM')));
      // this.props.closeManager();
    });
  };

  handleManage = (item) => {
    this.props.editSchedule(item);
  };

  handleContents = (content) => {
    const startIndex = content.indexOf('{');
    const endIndex = content.lastIndexOf('}');
    let value = '';
    if (startIndex == -1 || endIndex == -1) {
      value = content;
    } else {
      const obj = JSON.parse(content);
      value = Object.keys(obj).map((o) => (
        <span key={o}>
          <span>
            {inputName[o]}
            ：
            {obj[o]}
          </span>
          <br />
        </span>
      ));
    }
    return (
      <div style={{ marginBottom: 10 }}>
        <InfoCircleOutlined style={{ marginRight: 5 }} />
        {value}
      </div>
    );
  };

  getContents = (array, date, ModifySchedule, DeleteSchedule) => {
    const listContent = (
      <div>
        {array.map((item, index) => (
          <div key={index}>
            <Row style={{ marginBottom: 10 }}>
              <Col span={19}>
                <h3 style={{ fontWeight: 'bold' }}>{item.project.name}</h3>
              </Col>
              <Col>
                <div className="operatorList">
                  {ModifySchedule ? <a style={{ marginRight: 4 }} onClick={(e) => this.handleManage(item)}>编辑</a> : ''}
                  {ModifySchedule && DeleteSchedule ? <span>|</span> : ''}
                  {DeleteSchedule
                    ? (
                      <Popconfirm
                        placement="top"
                        title="确认删除该事记？"
                        onConfirm={() => this.handleDelete(item)}
                        okText="是"
                        cancelText="否"
                      >
                        <a style={{ marginLeft: 4 }}>删除</a>
                      </Popconfirm>
                    )
                    : ''}
                </div>
              </Col>
            </Row>
            {item.type.id === manualItemType
              ? this.handleContents(item.content)
              : (
                <div style={{ marginBottom: 10 }}>
                  <InfoCircleOutlined style={{ marginRight: 5 }} />
                  {item.content}
                </div>
              )}
            {this.getVideoAndPcrs(item.files)}
            <p style={{ marginBottom: 10 }}>{`${date} ${item.time}`}</p>
            <hr style={{ width: 400, borderTopWidth: 0, marginBottom: 10 }} />
          </div>
        ))}
      </div>
    );
    return listContent;
  };

  getVideoAndPcrs = (files) => {
    if (files.length === 0) {
      return (
        <p style={{ marginBottom: 10 }}>暂无图片和视频，可编辑添加</p>
      );
    }
    const videos = [];
    const imgs = [];
    files.map((item) => {
      if (ext.video.indexOf(item.ext) > -1) {
        videos.push(item);
      } else if (extImg.image.indexOf(item.ext) > -1) {
        imgs.push(item);
      }
    });
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        {videos.length !== 0
          ? (
            <div style={{ margin: '20px 0 20px 0' }}>
              <video width="45%" src={Func.downloadFile(`${videos[0].link}`)} controls="controls" />
            </div>
          )
          : null}
        {imgs.length != 0
          ? imgs.map((img) => (
            <Tooltip
              key={img.link}
              style={{ width: 250 }}
              placement="bottom"
              title={(
                <img
                  style={{ width: '100%', cursor: 'pointer' }}
                  src={Func.downloadFile(`${img.link}`)}
                />
              )}
            >
              <img
                style={{ width: '18%', marginLeft: 6, cursor: 'pointer' }}
                onClick={() => { this.showPicture(img); }}
                src={Func.downloadFile(`${img.link}`)}
                title={img.link.split('/')[2]}
              />
            </Tooltip>
          ))
          : null}
      </div>
    );
  };

  showPicture = (img) => {
    this.setState({
      previewImage: Func.downloadFile(`${img.link}`),
      previewVisible: true,
    });
  };

  handleCancelImg = () => {
    this.setState({
      previewVisible: false,
      previewImage: null,
    });
  };

  render() {
    const {
      resources, dataSource, selectDate, selectValue, clientHeight, clientWidth,
    } = this.props;
    const ModifySchedule = resources.some((r) => r == AuthorizationCode.ModifySchedule);
    const DeleteSchedule = resources.some((r) => r == AuthorizationCode.DeleteSchedule);
    const dateDes = moment(selectValue).format('YYYY-MM-DD');
    let todoArray = [];
    for (let i = 0; i < dataSource.length; i++) {
      const date = parseInt(dataSource[i].day);
      if (selectDate == date) {
        todoArray = dataSource[i].schedules;
      }
    }
    const Content = this.getContents(todoArray, dateDes, ModifySchedule, DeleteSchedule);
    const cardStyle = this.props.showManger ? { right: 0 } : { right: -480 };
    return (
      <span>
        <Card
          title={dateDes}
          extra={<p className="close_btn" onClick={this.props.closeManager}><CloseOutlined /></p>}
          // className={this.props.showManger ? 'equipment_option' : 'close_equipment_option'}
          style={{
            height: 871,
            zIndex: 99,
            position: 'absolute',
            width: 450,
            top: 0,
            right: 0,
            overflow: 'hidden',
            transition: 'right .5s ease',
            overflowY: 'auto',
            ...cardStyle,
          }}
        >
          {Content}
        </Card>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancelImg}
          closable={false}
          bodyStyle={{
            padding: 0, position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          }}
        >
          <img
            style={{ maxHeight: clientHeight, maxWidth: clientWidth * 0.8 }}
            src={this.state.previewImage}
          />
        </Modal>
      </span>
    );
  }
}

function mapStateToProps(state) {
  const { global } = state;

  return {
    resourceRoot: '',
    clientHeight: global.clientHeight,
    clientWidth: global.clientWidth,
  };
}

export default connect(mapStateToProps)(ScheduleManager);
// export default ScheduleManager
