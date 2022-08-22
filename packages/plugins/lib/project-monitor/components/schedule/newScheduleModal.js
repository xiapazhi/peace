/**
 * Created by zmh on 2017/6/22.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Modal, Input, Form, Button, Select, Table, Spin, TimePicker, Row, Col, Upload, message, Popconfirm, Card,
} from 'antd';
import { CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthorizationCode, Func } from '$utils';
import { PinyinHelper } from '@peace/utils';
import {
  uploadFile, removeFile, deleteFile, downloadFile,
} from '../../actions/fileInfo';
import {
  getScheduleMonthList, addSchedule, deleteSchedule, editSchedule,
} from '../../actions/schedule';
// const path = require('path');
const FormItem = Form.Item;

const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const ext = {
  video: ['.mp4'],
};
const extImg = {
  image: ['.png', '.jpg'],
};
const manualItemType = '2';// 人工巡检类型
class NewScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProjectId: null,
      add: true,
      currentScheduleId: null,
      previewVisible: false,
      previewVisiblev: false,
      previewImage: '',
      previewVideo: '',
      fileList: [],
      fileListv: [],
      picturesUpload: [],
      videoConfiged: [],
      picturesConfiged: [], // 编辑时展示的图片
      video_configed: [],
      pictures_configed: [], // 编辑打开模态框事记照片(作参照)
      picturesDelete: [], // 编辑后被删除的照片
      itemType: this.props.editItem ? this.props.editItem.type.id.toString() : '1',
    };
    this.formRef = React.createRef();
  }

  // UNSAFE_componentWillMount() {
  //     this.props.dispatch(getScheduleMonthList(this.props.userId, this.props.projects, this.props.selectedMonth));
  // }
  // 编辑事记
  componentDidMount() {
    const { use, editItem, date } = this.props;
    const form = this.formRef.current;
    const videos = []; const
      imgs = [];
    if (use == 'edit') {
      const time = `${moment(date).format('YYYY-MM-DD')} ${editItem.time}`;
      form.setFieldsValue({
        time: moment(time),
        projectSelected: editItem.project.id.toString(),
        itemType: editItem.type.id.toString(),
        // scheduleInfo: editItem.content
      });
      if (editItem.type.id == Number(manualItemType)) {
        const startIndex = editItem.content.indexOf('{');
        const endIndex = editItem.content.lastIndexOf('}');
        let fieldsValue = {};
        if (startIndex == -1 || endIndex == -1) {
          fieldsValue = {};
        } else {
          const obj = JSON.parse(editItem.content);
          Object.keys(obj).map((o) => {
            fieldsValue[o] = obj[o] || '';
          });
        }

        form.setFieldsValue(
          fieldsValue,
        );
      } else {
        form.setFieldsValue({
          scheduleInfo: editItem.content,
        });
      }
      editItem.files.map((item) => {
        if (ext.video.indexOf(item.ext) > -1) {
          videos.push(item);
        } else if (extImg.image.indexOf(item.ext) > -1) {
          imgs.push(item);
        }
      });
      this.setState({
        add: false,
        currentScheduleId: editItem.id,
        videoConfiged: videos,
        picturesConfiged: imgs,
        video_configed: videos,
        pictures_configed: imgs,
      });
    }
  }

  saveVideo = (projectId, time, calendarId) => {
    if (this.state.fileName != null) {
      const extra = {
        projectId: parseInt(projectId),
        calendarId,
      };
      const fileInfo = {
        name: `事件-${time}-${this.state.fileName}`, // {string} 文件名
        ext: this.state.fileExt, // {string} 文件扩展名
        typeId: 1, // {number} 文件类型id，文件类型：{项目文件, 报表文件, 数据文件}
        link: this.state.fileLink, // {string} 文件路径编码
        size: this.state.fileSize, // {number} 文件大小，默认单位：B
        time: moment().format('YYYY-MM-DD HH:mm:ss'), // {datetimeString} 文件创建时间
        extra,
      };
      this.props.dispatch(uploadFile(this.props.user.id, fileInfo, 'schedule')).then((_) => {
        if (_.type == 'UPLOAD_FILE_FAILURE') {
          this.props.dispatch(removeFile(this.state.fileLink, this.state.fileName));
        }
        this.setState({
          fileListv: [], fileName: null, fileExt: null, fileLink: null, fileSize: null,
        });
      }, (error) => {
        this.props.dispatch(removeFile(this.state.fileLink, this.state.fileName));
        this.setState({
          fileListv: [], fileName: null, fileExt: null, fileLink: null, fileSize: null,
        });
      });
    }
  };

  savePictures = (projectId, time, calendarId) => {
    const pistures = this.state.picturesUpload;

    if (pistures.length == 0) {
      return;
    }
    const extra = {
      projectId: parseInt(projectId),
      calendarId,
    };
    pistures.forEach((p) => {
      const fileInfo = {
        name: `事件-${time}-${p.fileName}`, // {string} 文件名
        ext: p.fileExt, // {string} 文件扩展名
        typeId: 1, // {number} 文件类型id，文件类型：{项目文件, 报表文件, 数据文件}
        link: p.fileLink, // {string} 文件路径编码
        size: p.fileSize, // {number} 文件大小，默认单位：B
        time: moment().format('YYYY-MM-DD HH:mm:ss'), // {datetimeString} 文件创建时间
        extra,
      };
      this.props.dispatch(uploadFile(this.props.user.id, fileInfo, 'schedule')).then((_) => {
        if (_.type == 'UPLOAD_FILE_FAILURE') {
          this.props.dispatch(removeFile(p.fileLink, p.fileName));
        }
      }, (error) => {
        this.props.dispatch(removeFile(p.fileLink, p.fileName));
      });
    });
    this.setState({ fileList: [], picturesUpload: [] });
  };

  handleOk = () => {
    const form = this.formRef.current;
    form.validateFields().then((values) => {
      if (this.props.projects.projects.length == 0) {

      } else {
        const tt = `${moment(this.props.date).format('YYYY-MM-DD')} ${values.time.hour()}:${values.time.minutes()}:${values.time.seconds()}`;
        let content = '';
        if (values.itemType == manualItemType) {
          content = JSON.stringify({
            naturalEnvi: values.naturalEnvi || '',
            constructionStatus: values.constructionStatus || '',
            supporting: values.supporting || '',
            surroundings: values.surroundings || '',
            facilities: values.facilities || '',
          });
        } else {
          content = values.scheduleInfo;
        }
        const scheduleInfo = {
          projectId: values.projectSelected,
          content, // {string} 日程内容
          typeId: values.itemType, // {number} 日程级别
          time: moment(this.props.date).startOf('day')
            .add(values.time.hour(), 'hours')
            .add(values.time.minutes(), 'minutes')
            .add(values.time.seconds(), 'seconds'),
          timeIdentify: tt,
        };

        if (this.state.add) {
          this.props.dispatch(addSchedule(this.props.userId, scheduleInfo)).then((_) => {
            // 保存视频和照片
            const { calendarId } = _.payload.data;
            this.saveVideo(values.projectSelected, tt, calendarId);
            this.savePictures(values.projectSelected, tt, calendarId);
          }).then((_) => {
            this.props.dispatch(getScheduleMonthList(this.props.userId, this.props.projects, this.props.selectedMonth));

            if (values.itemType == manualItemType) {
              form.setFieldsValue({
                time: moment(),
                naturalEnvi: '',
                constructionStatus: '',
                supporting: '',
                surroundings: '',
                facilities: '',
              });
            } else {
              form.setFieldsValue({
                time: moment(),
                scheduleInfo: '',
              });
            }
          });
        } else {
          this.props.dispatch(editSchedule(this.state.currentScheduleId, scheduleInfo)).then((_) => {
            // 保存编辑后的图片和视频
            this.saveVideoEdit(values.projectSelected, tt, this.state.currentScheduleId);
            this.savePicturesEdit(values.projectSelected, tt, this.state.currentScheduleId);
          }).then((_) => {
            this.props.closeScheduleModal();// 关闭模态框
            this.props.dispatch(getScheduleMonthList(this.props.userId, this.props.projects, this.props.selectedMonth));
          });
        }
      }
    });
  };

  saveVideoEdit = (projectId, time, calendarId) => {
    if (this.state.videoConfiged.length == 0) {
      // 保存新上传的,删除之前的
      if (this.state.video_configed.length != 0) { // 一开始有视频
        this.props.dispatch(deleteFile(this.state.video_configed[0].id, 'schedule')).then((_) => {
          if (_.type == 'DELETE_FILE_SUCCESS') { this.props.dispatch(removeFile(this.state.video_configed[0].fileLink, this.state.video_configed[0].fileName)); }
        });
      }
    }
    this.saveVideo(projectId, time, calendarId);
  };

  savePicturesEdit = (projectId, time, calendarId) => {
    if (this.state.picturesConfiged.length != this.state.pictures_configed.length) {
      // 删除老的
      this.state.picturesDelete.forEach((pd) => {
        this.props.dispatch(deleteFile(pd.id, 'schedule')).then((_) => {
          if (_.type == 'DELETE_FILE_SUCCESS') {
            this.props.dispatch(removeFile(pd.fileLink, pd.fileName));
          }
        });
      });
    }
    this.savePictures(projectId, time, calendarId);
  };

  handleCancel = () => {
    const { closeScheduleModal } = this.props;
    closeScheduleModal();
  };

  handleSelectedChange = (value) => {
    this.setState({ selectedProjectId: value });
  };

  handleItemTypeChange = (value) => {
    this.setState({ itemType: value });
  };

  beforeUploadv = (file) => {
    let extname = file.name.split('.').pop();
    extname = extname ? `.${extname}` : 'unknown';
    extname = extname.toLowerCase();
    let msgFlag = true;
    if (ext.video.indexOf(extname) < 0) {
      msgFlag = false;
      message.error(`文件格式需是 ：${['mp4'].join('，')}`);
      return msgFlag;
    }
    const isLt2M = file.size / 1024 / 1024 <= 5;
    if (!isLt2M) {
      message.error('视频大小必须比5MB小!');
      return isLt2M;
    }
    return true;
  };

  beforeUpload = (file) => {
    let extname = file.name.split('.').pop();
    extname = extname ? `.${extname}` : 'unknown';
    extname = extname.toLowerCase();
    let msgFlag = true;
    if (extImg.image.indexOf(extname) < 0) {
      msgFlag = false;
      message.error(`文件格式需是 ：${['png', 'jpg'].join('，')}`);
      return msgFlag;
    }
    const isLt2M = file.size / 1024 / 1024 <= 2;
    if (!isLt2M) {
      message.error('图片大小必须比2MB小!');
      return isLt2M;
    }
    return true;
  };

  handlePreview = (file) => {
    this.setState({
      previewImage: downloadFile(file.url, file.name),
      previewVisible: true,
    });
  };

  handlePreviewv = (file) => {
    this.setState({
      previewVideo: downloadFile(file.url, file.name),
      previewVisiblev: true,
    });
  };

  handleCancelImg = () => this.setState({ previewVisible: false });

  handleCancelv = () => this.setState({ previewVisiblev: false });

  // handleChange = ({ fileList }) => this.setState({ fileList })
  handleChange = (info) => {
    const pictures = [];
    const fileList = info.fileList.map((file) => {
      if (file.response && file.status !== 'error') {
        const index = file.name.lastIndexOf('.');
        const len = file.name.length;
        const ext = file.name.substring(index, len).toLowerCase();
        const name = file.name.substring(0, index);
        const { size } = file;
        const oneItem = {
          fileName: name, fileExt: ext, fileLink: file.response.key, fileSize: size,
        };
        pictures.push(oneItem);
        return {
          ...file,
          url: `${file.response.key}`,
        };
      }
      return file;
    });

    this.setState({ fileList, picturesUpload: pictures });
  };

  handleChangev = (info) => {
    let fileList = info.fileList.slice(-1);
    fileList = fileList.map((file) => {
      if (file.response && file.status !== 'error') {
        const index = info.file.name.lastIndexOf('.');
        const len = info.file.name.length;
        const ext = info.file.name.substring(index, len).toLowerCase();
        const name = info.file.name.substring(0, index);
        const { size } = info.file;

        this.setState({
          fileName: name, fileExt: ext, fileLink: file.response.key, fileSize: size,
        });
        return { ...file, url: `${file.response.key}` };
      }
      return file;
    });
    this.setState({ fileListv: fileList });
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  handleRemovev = (file) => {
    if (file.response && this.state.fileName) {
      this.props.dispatch(removeFile(this.state.fileLink, this.state.fileName)).then((_) => {
        this.setState({
          fileList: [], fileName: null, fileLink: null, fileExt: null, fileSize: null,
        });
      });
    }
  };

  showScheduleAppendix = () => {
    const {
      previewVisible, previewVisiblev, previewImage, previewVideo, fileList, fileListv,
    } = this.state;
    const {
      use, editItem, date, apiRoot,
    } = this.props;

    let disabled = false; let
      disabledImg = false;
    if (use == 'edit') {
      disabled = this.state.videoConfiged.length + fileListv.length >= 1;
      disabledImg = this.state.picturesConfiged.length + fileList.length >= 5;
    } else {
      disabled = fileListv.length >= 1;
      disabledImg = fileList.length >= 5;
    }

    return (
      <div style={{ marginTop: 6 }}>
        <Row>
          <Col span={24}>
            <Upload
              action={`${apiRoot}/attachments/video`}
              fileList={fileListv}
              onPreview={this.handlePreviewv}
              beforeUpload={this.beforeUploadv}
              onChange={this.handleChangev}
              onRemove={this.handleRemovev}
            >
              <Button disabled={disabled}>
                <UploadOutlined />
                视频
              </Button>
              <Modal visible={previewVisiblev} footer={null} maskClosable={false} onCancel={this.handleCancelv}>
                <video width="100%" src={previewVideo} controls="controls" />
              </Modal>
            </Upload>
          </Col>
        </Row>
        {
          this.state.videoConfiged.length != 0
            ? (
              <Row>
                <Col span={7} style={{ paddingTop: 15 }}>
                  <video width="100%" src={`${this.state.videoConfiged[0].link}`} controls="controls" />
                </Col>
                <Col span={4} style={{ fontSize: 18, cursor: 'pointer' }}>
                  <Popconfirm
                    title="确认删除该视频?"
                    onConfirm={() => { this.deleteAppendix(this.state.videoConfiged[0], 'video'); }}
                  >
                    <CloseCircleOutlined title="删除" />
                  </Popconfirm>
                </Col>
              </Row>
            )
            : null
        }
        <Row style={{ marginTop: 10 }}>
          <Col span={24}>
            <Upload
              action={`${apiRoot}/attachments/images`}
              // listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              <Button disabled={disabledImg}>
                <UploadOutlined />
                照片
              </Button>
            </Upload>
            <Modal visible={previewVisible} maskClosable={false} footer={null} onCancel={this.handleCancelImg}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Col>
        </Row>
        {
          this.state.picturesConfiged.length != 0

            ? this.state.picturesConfiged.map((img, index) => (
              <Row key={index}>
                <Col span={9} style={{ paddingTop: 15 }}>
                  <img width="100%" src={downloadFile(`${img.link}`, `${img.name}${img.ext}`)} title={img.name} />
                </Col>
                <Col span={1} style={{ fontSize: 18, cursor: 'pointer' }}>
                  <Popconfirm
                    title="确认删除该照片?"
                    onConfirm={() => { this.deleteAppendix(img, 'img'); }}
                  >
                    <CloseCircleOutlined title="删除" />
                  </Popconfirm>

                </Col>
              </Row>
            ))
            : null
        }
      </div>
    );
  };

  deleteAppendix = (media, type) => {
    if (type == 'video') {
      this.setState({ videoConfiged: [] });
    } else {
      const leftOver = [];
      const deletes = this.state.picturesDelete;
      this.state.picturesConfiged.forEach((p) => {
        if (p.id != media.id) {
          leftOver.push(p);
        } else {
          deletes.push(p);
        }
      });
      this.setState({
        picturesConfiged: leftOver,
        picturesDelete: deletes,
      });
    }
  };

  render() {
    const { resources, use } = this.props;
    const AddSchedule = resources.some((r) => r == AuthorizationCode.AddSchedule);

    const data = this.props.projectList;
    const dataLength = data == null ? 0 : data.length;
    const options = [];
    let defaultProjectSelectedValue = '';
    for (let i = 0; i < dataLength; i++) {
      if (i == 0) {
        defaultProjectSelectedValue = data[i].id.toString();
      }
      options.push(<Option value={data[i].id.toString()} key={`option_project-${i}`}>
        {data[i].name}

      </Option>);
    }
    // 新增-权限验证
    let foot = (
      <div>
        <Button type="primary" htmlType="submit" onClick={this.handleOk}>保存</Button>
        <Button key="cancel" onClick={this.handleCancel}>关闭</Button>
      </div>
    );
    if (!AddSchedule && use == 'add') {
      foot = (
        <div>
          <Button key="cancel" onClick={this.handleCancel}>关闭</Button>
        </div>
      );
    }
    const inputName = ['naturalEnvi', 'constructionStatus', 'supporting', 'surroundings', 'facilities'];
    const inputNameDesc = ['自然环境', '施工工况', '支护结构', '周边环境', '监测设施'];
    return (
      <Spin spinning={this.props.isFetching}>
        <Modal
          title="事记"
          visible
          width={730}
          maskClosable={false}
          footer={foot}
          onCancel={this.handleCancel}
        >
          <Form layout="horizontal" ref={this.formRef}>
            <FormItem id="time-span" label="日期" {...formItemLayout}>
              <Row>
                <Col span={7}><Input value={moment(this.props.date).format('YYYY-MM-DD')} readOnly /></Col>
                <Col offset={1} span={2}>—</Col>
                <Col span={14}>
                  <FormItem noStyle name="time" initialValue={moment()}>
                    <TimePicker
                      id="time"
                      disabled={!this.state.add}
                    />
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            {dataLength > 0
              ? (
                <FormItem
                  label="结构物"
                  {...formItemLayout}
                  hasFeedback
                  name="projectSelected"
                  rules={[{ required: true, message: '请选择结构物' }]}
                  initialValue={defaultProjectSelectedValue}
                >

                  <Select
                    id="projectSelected"
                    placeholder="结构物筛选"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const { children } = option.props;
                      return (
                        children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        || PinyinHelper.isPinyinMatched(children, input)
                      );
                    }}
                    onChange={this.handleSelectedChange}
                    disabled={!this.state.add}
                  >
                    {options}
                  </Select>

                </FormItem>
              ) : ''}
            <FormItem
              label="类型"
              {...formItemLayout}
              hasFeedback
              name="itemType"
              rules={[{ required: true, message: '请选择事项类型' }]}
              initialValue="1"
            >

              <Select
                id="itemType"
                placeholder="请选择事项类型"
                onChange={this.handleItemTypeChange}
              >
                <Option value="1">工程进度</Option>
                <Option value="2">人工巡检</Option>
                <Option value="3">集成配置</Option>
                <Option value="4">系统跟踪</Option>
                <Option value="5">重大事件</Option>
                {/* <Option value="other">其他</Option> */}
              </Select>

            </FormItem>
            {this.state.itemType == manualItemType
              ? inputName.map((val, index) => (
                <FormItem
                  key={val}
                  id={`scheduleInfo-input-${val}`}
                  label={inputNameDesc[index]}
                  name={val}
                  rules={[
                    { max: 100, message: '长度最多100个字符' },
                  ]}
                  {...formItemLayout}
                  hasFeedback
                >

                  <Input placeholder="请输入" id={val} type="textarea" rows={3} maxLength={100} style={{ float: 'left' }} />
                </FormItem>
              ))
              : (
                <FormItem
                  id="scheduleInfo-input"
                  label="描述"
                  name="scheduleInfo"
                  rules={[
                    { required: true, message: '不能为空' },
                  ]}
                  {...formItemLayout}
                  hasFeedback
                >

                  <Input placeholder="请输入记录内容" maxLength={1000} type="textarea" rows={4} id="scheduleInfo" style={{ float: 'left' }} />
                </FormItem>
              )}
            <FormItem
              id="appendix-upload"
              label="附件"
              labelCol={{ span: 6 }}
              name="appendix"
            >

              <div>
                <p>视频格式为mp4，单个大小不超过5M，总数不超过1个</p>
                <p>照片格式为png/jpg，单个大小不超过2M，总数不超过5张</p>
                {this.showScheduleAppendix()}
              </div>
            </FormItem>
          </Form>
        </Modal>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  const { auth, global } = state;
  return {
    user: auth.user,
    apiRoot: global.apiRoot,
    // isFetching: scheduleMonthList.isFetching,
    // scheduleMonthList: scheduleMonthList.items,
    // scheduleYearList: scheduleYearList.items
  };
}
export default connect(mapStateToProps)(NewScheduleModal);
