import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card, Calendar, Row, Col, Popover, Select, Spin, message, Button,
} from 'antd';
import { LayoutContent } from '@peace/components';
import moment from 'moment';
import FileSaver from 'file-saver';
import { PinyinHelper } from '@peace/utils';
import { getStructsList } from '../../actions/integrationInfo';
import { getScheduleMonthList, getScheduleYearList, getScheduleExportList } from '../../actions/schedule';
import NewScheduleModal from '../../components/schedule/newScheduleModal';
import ExportModal from '../../components/schedule/exportModal';
import ScheduleManager from './scheduleManager';
import './style.less';

const { Option } = Select;
const inputName = {
  naturalEnvi: '自然环境',
  constructionStatus: '施工工况',
  supporting: '支护结构',
  surroundings: '周边环境',
  facilities: '监测设施',
};
const manualItemTypeId = 2;// 人工巡检类型

class Default extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorChecked: true,
      normalChecked: true,
      wariningChecked: true,
      systemChecked: true,
      eventChecked: true,
      scheduleModal: '',
      modeTypeDisplay: 'visible',
      selectedProjectIds: null,
      currentMonth: moment().format('YYYY-MM'),
      currentYear: moment().format('YYYY'),
      onMouseDate: null,
      showManger: false,
      selectDate: '',
      selectValue: '',
      exportModalVisible: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch(getStructsList(this.props.user.orgId)).then((res) => {
      const data = this.props.items;
      const dataLength = data == null ? 0 : data.length;
      let projects;
      if (dataLength > 0) {
        projects = {
          projects: [data[0].id],
        };
        this.setState({ selectedProjectIds: [data[0].id.toString()] });
      }
      if (dataLength == 0) { return message.warning('无结构物信息，先配置结构物！'); }
      this.props.dispatch(getScheduleMonthList(this.props.user.id, projects, moment().format('YYYY-MM')));
      this.props.dispatch(getScheduleYearList(this.props.user.id, projects, moment().format('YYYY')));
    });
  }

  handleSelectedChange = (value) => {
    const projects = {
      projects: value,
    };
    this.setState({ selectedProjectIds: value });
    this.props.dispatch(getScheduleMonthList(this.props.user.id, projects, this.state.currentMonth));
    this.props.dispatch(getScheduleYearList(this.props.user.id, projects, this.state.currentYear));
  };

  getListData = (value) => {
    const projects = {
      projects: this.state.selectedProjectIds,
    };
    const month = value.format('YYYY-MM');
    if (month != this.state.currentMonth) { return []; }
    const listData = [];
    const scheduleMonthList = this.props.scheduleMonthList == undefined ? [] : this.props.scheduleMonthList;
    for (let i = 0; i < scheduleMonthList.length; i++) {
      const date = parseInt(scheduleMonthList[i].day);
      if (value.date() == date) {
        for (let k = 0; k < scheduleMonthList[i].schedules.length; k++) {
          const schedule = scheduleMonthList[i].schedules;
          let type = '';
          const content = `${schedule[k].time}   ${schedule[k].content}`;
          if (schedule[k].type.id == 1 && this.state.errorChecked) {
            type = 'error';
          } else if (schedule[k].type.id == 2 && this.state.wariningChecked) {
            type = 'warning';
          } else if (schedule[k].type.id == 3 && this.state.normalChecked) {
            type = 'normal';
          } else if (schedule[k].type.id == 4 && this.state.systemChecked) {
            type = 'system';
          } else if (schedule[k].type.id == 5 && this.state.eventChecked) {
            type = 'event';
          }
          if (type.length > 0) {
            listData.push({ type, content, time: schedule[k].time });
          }
        }
        break;
      }
    }
    return listData || [];
  };

  onMouseOver = (value) => {
    this.setState({
      onMouseDate: value.date(),
    });
  };

  onMouseOut = (value) => {
    this.setState({
      onMouseDate: null,
    });
  };

  handleManager = (value) => {
    this.setState({
      showManger: true,
      selectDate: value.date(),
      selectValue: value,
    });
  };

  closeManager = () => {
    this.setState({
      showManger: false,
    });
  };

  handleContents = (type, content) => {
    let list = '';
    if (type == 'warning') {
      const startIndex = content.indexOf('{');
      const endIndex = content.lastIndexOf('}');
      if (startIndex == -1 || endIndex == -1) {
        list = content;
      } else {
        const jsonStr = content.substring(startIndex, endIndex + 1);
        list = content.substring(0, startIndex);
        const obj = JSON.parse(jsonStr);
        Object.keys(obj).map((o) => list += `${inputName[o]}：${obj[o]}   `);
      }
    } else {
      list = content;
    }
    return list.length > 25 ? `${list.substring(0, 25)}...` : list;
  };

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    listData.sort((a, b) => moment(a.time, 'HH:mm:ss') - moment(b.time, 'HH:mm:ss'));

    return (
      <div>
        <ul className="events">
          {listData.slice(0, 3).map((item) => (
            <li key={item.content}>
              <span className={`event_${item.type}`}>●</span>
              {this.handleContents(item.type, item.content)}
            </li>
          ))}
          {listData.length <= 3 ? '' : (
            <li>
              <span>.....</span>
            </li>
          )}
        </ul>
        {listData.length != 0
          ? (
            <Row className="scheduleCover">
              <Col span={10}>
                <Button size="small" onClick={() => { this.newItemsClick(value, 'add'); }}>新增</Button>
              </Col>
              <Col span={10}>
                <Button size="small" onClick={() => { this.newItemsClick(value, 'manager'); }}>管理</Button>
              </Col>
            </Row>
          )
          : (
            <Row className="scheduleCover">
              <Col span={12} style={{ textAlign: 'center' }}>
                <Button size="small" onClick={() => { this.newItemsClick(value, 'add'); }}>新增</Button>
              </Col>
            </Row>
          )}

      </div>
    );
  };

  getMonthData = (value) => {
    const projects = {
      projects: this.state.selectedProjectIds,
    };
    const year = value.format('YYYY');
    const month = value.month() + 1;
    const scheduleYearList = this.props.scheduleYearList == undefined ? [] : this.props.scheduleYearList;
    for (let i = 0; i < scheduleYearList.length; i++) {
      if (scheduleYearList[i].month.toString() == month) {
        return scheduleYearList[i];
      }
    }
  };

  monthCellRender = (value) => {
    const listData = this.getMonthData(value);
    if (listData == undefined) {
      return null;
    }
    let errorCount = 0;
    let warningCount = 0;
    let normalCount = 0;
    let systemCount = 0;
    let eventCount = 0;
    for (let k = 0; k < listData.schedules.length; k++) {
      if (listData.schedules[k].type.id == 1) {
        errorCount = listData.schedules[k].count;
      } else if (listData.schedules[k].type.id == 2) {
        warningCount = listData.schedules[k].count;
      } else if (listData.schedules[k].type.id == 3) {
        normalCount = listData.schedules[k].count;
      } else if (listData.schedules[k].type.id == 4) {
        systemCount = listData.schedules[k].count;
      } else if (listData.schedules[k].type.id == 5) {
        eventCount = listData.schedules[k].count;
      }
    }

    return (
      <div className="notes_month">
        <section>{listData.count}</section>
        <span className="event_error">
          ●
          {`工程进度：${errorCount}`}
        </span>
        &emsp;&emsp;
        <span className="event_warning">
          ●
          {`人工巡检：${warningCount}`}
        </span>
        <br />
        <span className="event_normal">
          ●
          {`集成配置：${normalCount}`}
        </span>
        &emsp;&emsp;
        <span className="event_ststem">
          ●
          {`系统跟踪：${systemCount}`}
        </span>
        <br />
        <span className="event_event">
          ●
          {`重大事件：${eventCount}`}
        </span>
        <span className="event_event" style={{ visibility: 'hidden' }}>
          ●
          {`重大事件：${eventCount}`}
        </span>
        &emsp;&emsp;
      </div>
    );
  };

  onPanelChange = (value, mode) => {
    const data = this.props.items;
    const dataLength = data == null ? 0 : data.length;
    if (dataLength == 0) { return message.warning('无结构物信息，先配置结构物！'); }
    const projects = {
      projects: this.state.selectedProjectIds,
    };
    this.setState({ currentMonth: value.format('YYYY-MM'), currentYear: value.format('YYYY') });
    if (mode == 'month') {
      this.setState({ modeTypeDisplay: 'visible' });
      this.props.dispatch(getScheduleMonthList(this.props.user.id, projects, value.format('YYYY-MM')));
    } else {
      this.setState({ modeTypeDisplay: 'invisible' });
      this.props.dispatch(getScheduleYearList(this.props.user.id, projects, value.format('YYYY')));
    }
  };

  newItemsClick = (d, use) => {
    const listData = this.getListData(d);
    if (this.state.modeTypeDisplay == 'invisible') { return; }
    const data = this.props.items;
    const dataLength = data == null ? 0 : data.length;
    if (dataLength == 0) { return message.warning('无结构物信息，先配置结构物！'); }
    const projectIds = [];
    for (let i = 0; i < dataLength; i++) {
      projectIds.push(data[i].id);
    }
    const projects = {
      projects: projectIds,
    };
    const date = `${moment(d).format('YYYY-MM-DD')
      } ${moment().format('HH:mm:ss')}`;
    if (use == 'manager') {
      this.setState({
        showManger: true,
        selectDate: d.date(),
        selectValue: d,
      });
    } else if (listData.length == 0 || (listData.length != 0 && use == 'add')) {
      this.setState({
        currentMonth: moment(d).format('YYYY-MM'),
        scheduleModal: <NewScheduleModal
          closeScheduleModal={this.closeScheduleModal}
          date={date}
          use="add"
          userId={this.props.user.id}
          projectList={this.props.items}
          projects={projects}
          selectedMonth={moment(d).format('YYYY-MM')}
          resources={this.props.user.resources}
        />,
      });
    }
  };

  closeScheduleModal = () => {
    const projects = {
      projects: this.state.selectedProjectIds,
    };
    this.props.dispatch(getScheduleMonthList(this.props.user.id, projects, this.state.currentMonth));
    this.props.dispatch(getScheduleYearList(this.props.user.id, projects, this.state.currentYear));
    this.setState({ scheduleModal: '' });
  };

  editSchedule = (item) => { // 编辑事记
    const projects = {
      projects: this.state.selectedProjectIds,
    };
    const date = `${moment(this.state.selectValue).format('YYYY-MM-DD')
      } ${moment().hour()}:${moment().minutes()}:${moment().seconds()}`;
    this.setState({
      scheduleModal: <NewScheduleModal
        closeScheduleModal={this.closeScheduleModal}
        date={date}
        userId={this.props.user.id}
        use="edit"
        editItem={item}
        projectList={this.props.items}
        projects={projects}
        selectedMonth={moment(this.state.selectValue).format('YYYY-MM')}
        resources={this.props.user.resources}
      />,
    });
  };

  handleErrorChange = () => {
    this.setState({ errorChecked: !this.state.errorChecked });
  };

  handleNormalChange = () => {
    this.setState({ normalChecked: !this.state.normalChecked });
  };

  handleWarningChange = () => {
    this.setState({ wariningChecked: !this.state.wariningChecked });
  };

  handleSystemChange = () => {
    this.setState({ systemChecked: !this.state.systemChecked });
  };

  handleEventChange = () => {
    this.setState({ eventChecked: !this.state.eventChecked });
  };

  openExportModal = () => {
    this.setState({
      exportModalVisible: true,
    });
  };

  closeExportModal = () => {
    this.setState({
      exportModalVisible: false,
    });
  };

  export_ = (data) => {
    const { dispatch, user } = this.props;
    dispatch(getScheduleExportList(user.id, data)).then((res) => {
      if (res.type == 'SCHEDULE_EXPORT_LIST_SUCCESS') {
        data = res.payload.data;
        const strs = `\uFEFF${['序号,内容,时间,所属结构物,事记类型'].concat(data.map((d) => {
          let content = '';
          if (d.typeId == manualItemTypeId) {
            const startIndex = d.content.indexOf('{');
            const endIndex = d.content.lastIndexOf('}');
            if (startIndex == -1 || endIndex == -1) {
              content = d.content;
            } else {
              const obj = JSON.parse(d.content);
              content = Object.keys(obj).map((o) => `${inputName[o]}：${obj[o]}  `);
            }
          } else { content = d.content; }
          return [`"${d.index}"`, `"${content}"`, `"${d.time}"`, `"${d.structure}"`, `"${d.type}"`].join(',');
        })).join('\r\n')}`;
        const blob = new Blob([strs], { type: 'text/csv' });
        FileSaver.saveAs(blob, '工程事记.csv');
        this.setState({ exporting: false });
      }
    });
  };

  render() {
    const { exportModalVisible } = this.state;
    const data = this.props.items;
    const dataLength = data == null ? 0 : data.length;
    const options = [];
    const defaultProjectSelectedValue = [];

    for (let i = 0; i < dataLength; i++) {
      if (i == 0) {
        defaultProjectSelectedValue.push(data[i].id.toString());
      }
      options.push(<Option value={data[i].id.toString()} key={`option_project-${i}`}>
        {data[i].name}

      </Option>);
    }

    return (
      <LayoutContent>
        <Spin spinning={this.props.isFetching}>
          <Card>
            <Row>
              <Col span="24">
                <div
                  style={{ marginLeft: 20 }}
                  className={this.state.modeTypeDisplay}
                >
                  <span
                    style={{
                      color: this.state.errorChecked ? '#f50' : '#C1C1C1',
                      fontSize: 20,
                      marginRight: 20,
                      cursor: 'pointer',
                    }}
                    onClick={this.handleErrorChange}
                  >
                    ●
                    <span style={{ fontSize: 14 }}>工程进度</span>
                  </span>
                  <span
                    style={{
                      color: this.state.wariningChecked ? '#fac450' : '#C1C1C1',
                      fontSize: 20,
                      marginRight: 20,
                      cursor: 'pointer',
                    }}
                    onClick={this.handleWarningChange}
                  >
                    ●
                    <span style={{ fontSize: 14 }}>人工巡检</span>
                  </span>
                  <span
                    style={{
                      color: this.state.normalChecked ? '#108ee9' : '#C1C1C1',
                      fontSize: 20,
                      marginRight: 20,
                      cursor: 'pointer',
                    }}
                    onClick={this.handleNormalChange}
                  >
                    ●
                    <span style={{ fontSize: 14 }}>集成配置</span>
                  </span>
                  <span
                    style={{
                      color: this.state.systemChecked ? '#A0522D' : '#C1C1C1',
                      fontSize: 20,
                      marginRight: 20,
                      cursor: 'pointer',
                    }}
                    onClick={this.handleSystemChange}
                  >
                    ●
                    <span style={{ fontSize: 14 }}>系统跟踪</span>
                  </span>
                  <span
                    style={{
                      color: this.state.eventChecked ? '#FFD700' : '#C1C1C1',
                      fontSize: 20,
                      marginRight: 20,
                      cursor: 'pointer',
                    }}
                    onClick={this.handleEventChange}
                  >
                    ●
                    <span style={{ fontSize: 14 }}>重大事件</span>
                  </span>
                  {dataLength > 0
                    ? (
                      <Select
                        mode="tags"
                        size="default"
                        placeholder="结构物筛选"
                        defaultValue={defaultProjectSelectedValue}
                        style={{ width: '50%' }}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0 || PinyinHelper.isPinyinMatched(option.props.children, input)}
                        onChange={this.handleSelectedChange}
                      >
                        {options}
                      </Select>
                    ) : ''}
                  <Button type="primary" onClick={this.openExportModal} style={{ margin: '0 15px' }}>导出</Button>
                </div>

              </Col>
            </Row>
            <Calendar
              // onSelect={this.newItemsClick}
              onPanelChange={this.onPanelChange}
              dateCellRender={this.dateCellRender}
              monthCellRender={this.monthCellRender}
              fullscreen
            />
            {this.state.scheduleModal}
            <ScheduleManager
              dataSource={this.props.scheduleMonthList}
              closeManager={this.closeManager}
              showManger={this.state.showManger}
              selectDate={this.state.selectDate}
              selectValue={this.state.selectValue}
              editSchedule={this.editSchedule}
              projects={this.state.selectedProjectIds}
              userId={this.props.user.id}
              resources={this.props.user.resources}
            />
          </Card>

          <ExportModal
            visible={exportModalVisible}
            closeModal={this.closeExportModal}
            strucList={options}
            export_={this.export_}
          />
        </Spin>
      </LayoutContent>

    );
  }
}

function mapStateToProps(state) {
  const {
    structList, auth, scheduleMonthList, scheduleYearList,
  } = state;
  const isFetching = structList.isRequesting || scheduleMonthList.isRequesting;
  return {
    items: structList.data,
    user: auth.user,
    isFetching,
    scheduleMonthList: scheduleMonthList.data || [],
    scheduleYearList: scheduleYearList.data || [],
  };
}
export default connect(mapStateToProps)(Default);
