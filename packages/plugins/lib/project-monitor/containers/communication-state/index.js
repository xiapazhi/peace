import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card, Select, Button, Table, message, Spin,
} from 'antd';
import { Func } from '@peace/utils';
import { getStructs, getStructsDevices, getDevicesAlarms } from '../../actions/communication-state';

const { Option } = Select;

class DtuState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedStructs: null,
      dtuStateData: null,
    };
  }

  UNSAFE_componentWillMount() {
    const { dispatch, user } = this.props;
    dispatch(getStructs(user.orgId)).then((structsRes) => {
      if (structsRes.success) {
        const structs = structsRes.payload.data;
        if (structs) {
          // dispatch(getStructsDevicesLinkState(structs[0].iotaThingId))
          this.queryDevicesAndState(structs[0].iotaThingId);
        }
      } else {
        message.error('获取结构物失败');
      }
    });
  }

  handleChange = (value) => {
    this.setState({ currentSelectedStructs: value });
  };

  query = () => {
    const { structs } = this.props;
    const { currentSelectedStructs } = this.state;
    const selectedStructsid = currentSelectedStructs || structs[0].id;
    const selectedStructsThingId = structs.filter((s) => s.id == selectedStructsid)[0].iotaThingId;
    this.queryDevicesAndState(selectedStructsThingId);
  };

  queryDevicesAndState = (iotaThingId) => {
    const { dispatch } = this.props;
    dispatch(getStructsDevices(iotaThingId)).then((devicesRes) => {
      if (devicesRes.success) {
        const devices = devicesRes.payload.data.instances;
        const dtus = [];
        const dtuIds = [];
        for (const s in devices) {
          if (devices[s].instance.properties && devices[s].instance.properties.deviceType == 'gateway') {
            dtus.push({ name: devices[s].name, deviceId: s, type: devices[s].instance.properties.deviceType });
            dtuIds.push(s);
          }
        }

        if (dtuIds.length) {
          dispatch(getDevicesAlarms(dtuIds)).then((alarmsRes) => {
            if (alarmsRes.success) {
              const deviceStateData = [];
              let key = 1;
              const reg = /.*DTU.*(上线|下线).*/;
              for (const s of alarmsRes.payload.data) {
                const deviceData = dtus.filter((d) => s.deviceId == d.deviceId);
                if (deviceData.length && reg.test(s.alarmContent)) {
                  deviceStateData.push({
                    key: key++,
                    deviceName: deviceData[0].name,
                    historyAlarm: s.alarmContent,
                    createTime: s.startTime,
                    createTimes: s.alarmCount,
                    updateTime: s.endTime,
                  });
                }
              }
              this.setState({ dtuStateData: deviceStateData });
            }
          });
        } else {
          this.setState({ dtuStateData: null });
        }
      }
    });
  };

  render() {
    const { structs, isRequesting } = this.props;
    const { currentSelectedStructs, dtuStateData } = this.state;

    const selecter = structs && structs.length
      ? (
        <Select
          defaultValue={currentSelectedStructs || structs[0].id}
          style={{ width: 300 }}
          showSearch
          optionFilterProp="children"
          onChange={this.handleChange}
          filterOption={(input, option) => Func.selectFilterOption(input, option)}
        >
          {
                    structs ? structs.map((s) => <Option key={s.id} value={s.id}>{s.name}</Option>) : null
                }
        </Select>
      ) : null;

    const columns = [{
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    }, {
      title: '通信状态',
      dataIndex: 'historyAlarm',
      key: 'historyAlarm',
    }, {
      title: '产生时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '产生次数',
      dataIndex: 'createTimes',
      key: 'createTimes',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    ];

    return (
      <div>
        <Card style={{}}>
          {selecter ? null : <Select style={{ width: 300 }} />}
          {selecter || null}
          <Button type="primary" style={{ marginLeft: 30 }} onClick={this.query}>查询</Button>
        </Card>
        <Spin spinning={isRequesting}>
          <Card style={{ marginTop: 16 }}>
            <Table columns={columns} dataSource={dtuStateData} />
          </Card>
        </Spin>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { auth, communicationState } = state;
  return {
    user: auth.user,
    structs: communicationState.data,
    isRequesting: communicationState.isRequesting,
  };
}

export default connect(mapStateToProps)(DtuState);
