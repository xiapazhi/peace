import React, { useState, useRef } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import {
  Modal, Button, Tabs, Form, Input, Select, Upload, InputNumber, Tag, Checkbox, Row, Col, message, Text, Popover,
} from 'antd';
import { Upload as Upload_ } from '@peace/components';
import moment from 'moment';
import { damType, reservoirType } from '../constant';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const fileTypeStr = 'report';

export default function (props) {
  const {
    title, text, editData = null, onFinish, onRefresh, bridges, constants, readOnly = false, addStruct, defaults = true,
  } = props;

  const [activeTabKey, setActiveTabKey] = useState('info');
  const [changeTab, setChangeTab] = useState(null);
  const [modalVisit, setModalVisit] = useState(false);
  const [next, setNext] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const fromRef = useRef();

  const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };

  const initialValues = editData ? {
    name: editData.name,
    ...editData.extraInfo,
    createdTime: editData.extraInfo && editData.extraInfo.createdTime ? moment(editData.extraInfo.createdTime).format('YYYYMMDD') : null,
  } : {};

  const hasOpr = (tab) => {
    setChangeTab(tab);
  };
  const resetDot = () => {
    setChangeTab(null);
  };
  const leaveConfirm = (use, tab) => {
    const { confirm } = Modal;

    if (changeTab) {
      confirm({
        content: `当前页面信息已修改，是否放弃保存${use == 1 ? '并至下一页' : ''}？`,
        okText: '是',
        cancelText: '否',
        onOk() {
          // 切走
          if (use == 1) {
            setActiveTabKey(tab);
            setChangeTab(null);
          } else if (use == 2) {
            setModalVisit(false);
            setChangeTab(null);
            setActiveTabKey('info');
            needRefresh && onRefresh();
          }
        },
        onCancel() {

        },
      });
    } else if (use == 1) {
      setActiveTabKey(tab);
    } else if (use == 2) {
      setModalVisit(false);
      setActiveTabKey('info');
      needRefresh && onRefresh();
    }
  };
  const onTabChange = (value) => {
    leaveConfirm(1, value);
  };
  const close = () => {
    setNext(false);
    leaveConfirm(2, null);
  };
  const toNext = () => {
    const tabArray = ['info', 'upper', 'pier', 'abutment', 'project', 'pipeline'];
    const nowIndex = tabArray.findIndex((a) => a == activeTabKey);
    setActiveTabKey(tabArray[nowIndex == 5 ? 0 : nowIndex + 1]);
  };
  const styleWapper = { width: '95%', marginRight: 0 };
  const formItemLayoutOne = {
    labelCol: { span: 2 },
    wrapperCol: { span: 20 },
  };

  async function checkNumeric(rule, value) {
    const errMsg = '请输入数字，最多1位小数';
    if (value) {
      const pattern = /^-?(0|[1-9]\d*)(\.[0-9]{1,2})?$/;
      if (!pattern.test(value)) {
        return Promise.reject(new Error(errMsg));
      }
      try {
        if (parseFloat(value) != value) {
          return Promise.reject(new Error(errMsg));
        }
      } catch (ex) {
        return Promise.reject(new Error(errMsg));
      }
    }
    return Promise.resolve();
  }

  return (
    <ModalForm
      title={title || ''}
      initialValues={initialValues}
      visible={modalVisit}
      // onVisibleChange={setModalVisit}
      trigger={<a onClick={() => { setModalVisit(true); }}>{text}</a>}
      layout="horizontal"
      {...formItemLayout}
      modalProps={{
        destroyOnClose: true,
        onCancel: close,
      }}
      width="90%"
      submitter={{
        render: (props, defaultDoms) => (readOnly ? [
          <Button type="default" key="close" onClick={close}>关闭</Button>,
        ]
          : [
            <Button type="default" key="close" onClick={close}>关闭</Button>,
            <Button
              type="primary"
              key="current"
              onClick={() => {
                setNext(false);
                props.submit();
              }}
            >
              确定
            </Button>,
          ]),
      }}
      onFinish={async (values) => {
        const res = await onFinish(values, editData, next);
        if (res) {
          setNeedRefresh(true);
          if (res.success) {
            if (next) {
              setChangeTab(null);
              toNext();
            } else {
              onRefresh();
            }
          }
        }
        return false;
      }}
    >

      {/* 水库编码number 水库地址address 坝型 damType */}
      <Row>
        <Col span={8}>
          <FormItem
            label="坝型"
            hasFeedback
            name="damType"
            rules={[{
              required: true, message: '请选择类型',
            }]}
          >
            <Select
              placeholder="选择类型"
            >
              {damType.map((s) => <Option value={s}>{s}</Option>)}
            </Select>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            label="水库编码："
            name="number"
            rules={[{
              required: true, message: '请输入水库编码',
            }]}
          >
            <Input style={styleWapper} maxLength="20" placeholder="水库编码最长20个字符" />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="水库地址：" name="address">
            <Input style={styleWapper} maxLength="20" placeholder="水库地址最长20个字符" />
          </FormItem>
        </Col>
      </Row>
      {/* 水库类型reservoirType 所在水系 riverSystem 所在江河 rivers */}
      <Row>
        <Col span={8}>
          <FormItem
            label="水库类型"
            hasFeedback
            name="reservoirType"
            rules={[{
              required: true, message: '请选择类型',
            }]}
          >
            <Select
              placeholder="选择类型"
              showSearch
              optionFilterProp="children"
            >
              {reservoirType.map((s) => <Option value={s}>{s}</Option>)}
            </Select>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            label="所在水系："
            name="riverSystem"
            rules={[{
              required: true, message: '请输入所在水系',
            }]}
          >
            <Input style={styleWapper} maxLength="20" placeholder="所在水系最长20个字符" />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="所在江河：" name="rivers">
            <Input style={styleWapper} maxLength="20" placeholder="所在江河最长20个字符" />
          </FormItem>
        </Col>
      </Row>

      {/* 坝顶高程 damAltitude 所在溪水 stream 管理单位 unit */}
      <Row>
        {
          [
            { name: '坝顶高程', key: 'damAltitude', max: 20 },
            { name: '所在溪水', key: 'stream', max: 20 },
            { name: '管理单位', key: 'unit', max: 20 }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.rules ? s.rules : []}

                >
                  <Input style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))

        }
      </Row>

      {/* 最大坝高 maxDamHeight 水库状态 reservoirState 所属机构 mechanism */}
      <Row>
        {
          [
            {
              name: '最大坝高',
              key: 'maxDamHeight',
              max: 20,
              rules: [
                { validator: checkNumeric },
                { required: false },
              ],
              type: 'number'
            },
            {
              name: '水库状态',
              key: 'reservoirState',
              max: 20,
              rules: [
                { required: false },
              ],
            },
            {
              name: '所属机构',
              key: 'mechanism',
              max: 20,
              rules: [
                { required: false },
              ],
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.rules}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 责任人姓名 dutyName 责任人职位 dutyPost  责任人电话 dutyPhone */}
      <Row>
        {
          [
            {
              name: '责任人姓名', key: 'dutyName', max: 20, required: false,
            },
            {
              name: '责任人职位', key: 'dutyPost', max: 20, required: false,
            },
            {
              name: '责任人电话', key: 'dutyPhone', max: 20, required: false,
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 坝长 reservoirLength 坝高 damHeight 主要功能 function */}
      <Row>
        {
          [
            {
              name: '坝长', key: 'reservoirLength', max: 20, required: true, type: 'number'
            },
            {
              name: '坝高', key: 'damHeight', max: 20, required: true, type: 'number'
            },
            {
              name: '主要功能', key: 'function', max: 20, required: false,
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 年均农业灌溉量(万m³) njnyggl 开工时间 workStart 竣工时间 workEnd */}
      <Row>
        {
          [
            {
              name: '年均农业灌溉量(万m³)', key: 'njnyggl', max: 20, required: false, type: 'number'
            },
            {
              name: '开工时间', key: 'workStart', max: 20, required: false,
            },
            {
              name: '竣工时间', key: 'workEnd', max: 20, required: false,
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 坝宽 damWidth 坝底最大宽度 damMaxWidth 溢洪道类型 spillwayType */}
      <Row>
        {
          [
            {
              name: '坝宽', key: 'damWidth', max: 20, required: true, type: 'number'
            },
            {
              name: '坝底最大宽度', key: 'damMaxWidth', max: 20, required: false, type: 'number'
            },
            {
              name: '溢洪道类型', key: 'spillwayType', max: 20, required: false,
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 正常蓄水位 customPoolLevel 溢流方式 OverflowMode 溢洪道总长 spillwayLength */}
      <Row>
        {
          [
            {
              name: '正常蓄水位', key: 'customPoolLevel', max: 20, required: true, type: 'number'
            },
            {
              name: '溢流方式', key: 'OverflowMode', max: 20, required: false,
            },
            {
              name: '溢洪道总长', key: 'spillwayLength', max: 20, required: false, type: 'number'
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 设计洪水位 designFloodLevel 堰顶高程 WeirCrestElevation 引水渠段长 DiversionCanal */}
      <Row>
        {
          [
            {
              name: '设计洪水位', key: 'designFloodLevel', max: 20, required: true, type: 'number'
            },
            {
              name: '堰顶高程', key: 'WeirCrestElevation', max: 20, required: false, type: 'number'
            },
            {
              name: '引水渠段长', key: 'DiversionCanal', max: 20, required: false, type: 'number'
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 汛限水位 xxsw 渠底高程 qdgc 死水位 ssw */}
      <Row>
        {
          [
            {
              name: '汛限水位', key: 'xxsw', max: 20, required: true, type: 'number'
            },
            {
              name: '渠底高程', key: 'qdgc', max: 20, required: false, type: 'number'
            },
            {
              name: '死水位', key: 'ssw', max: 20, required: true, type: 'number'
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 校核洪水位 jhhsw 死库容 slr 正常蓄水位库容 zcxsw */}
      <Row>
        {
          [
            {
              name: '校核洪水位', key: 'jhhsw', max: 20, required: true, type: 'number'
            },
            {
              name: '死库容', key: 'slr', max: 20, required: false,
            },
            {
              name: '正常蓄水位库容', key: 'zcxsw', max: 20, required: false,
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 兴利库容 xlkr 库容系数 krxs 集雨面积 jymj */}
      <Row>
        {
          [
            {
              name: '兴利库容', key: 'xlkr', max: 20, required: false,
            },
            {
              name: '库容系数', key: 'krxs', max: 20, required: false,
            },
            {
              name: '集雨面积', key: 'jymj', max: 20, required: false,
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 汛期开始时间 xqStart 汛期结束时间 xqEnd 年平均总供水量(万m³) yearAvgWater */}
      <Row>
        {
          [
            {
              name: '汛期开始时间', key: 'xqStart', max: 20, required: false,
            },
            {
              name: '汛期结束时间', key: 'xqEnd', max: 20, required: false,
            },
            {
              name: '年平均总供水量(万m³)', key: 'yearAvgWater', max: 20, required: false, type: 'number'
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>

      {/* 水资源开发利用率 szykf 灌溉农田面积 ggntArea 农村人口饮供水量(万m³) countrysideWater */}
      <Row>
        {
          [
            {
              name: '水资源开发利用率', key: 'szykf', max: 20, required: false,
            },
            {
              name: '灌溉农田面积', key: 'ggntArea', max: 20, required: false, type: 'number'
            },
            {
              name: '农村人口饮供水量(万m³)', key: 'countrysideWater', max: 20, required: false, type: 'number'
            }].map((s) => (
              <Col span={8}>
                <FormItem
                  label={`${s.name}：`}
                  name={s.key}
                  rules={s.required ? [{
                    required: true, message: '不能为空，且最多为20个字符',
                  }] : []}
                >
                  <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
                </FormItem>
              </Col>
            ))
        }
      </Row>
      {/* 下泄生态流量(m³/s) xxstll 防洪限制水位 fhxzsw */}
      <Row>
        {
          [
            {
              name: '下泄生态流量(m³/s)', key: 'xxstll', max: 20, required: false, type: 'number'
            },
            {
              name: '防洪限制水位', key: 'fhxzsw', max: 20, required: false, type: 'number'
            },
            {
              name: '大坝海拔高度', key: 'hbgd', max: 20, required: true, type: 'number'
            },
          ].map((s) => (
            <Col span={8}>
              <FormItem
                label={`${s.name}：`}
                name={s.key}
                rules={s.required ? [{
                  required: true, message: '不能为空，且最多为20个字符',
                }] : []}
              >
                <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
              </FormItem>
            </Col>
          ))
        }
      </Row>

      {/* 安全管理(防汛)预案 调度运用方案 */}
      <Row>
        <Col span={8}>
          <Form.Item
            label="安全管理(防汛)预案"
            name="aqglya"
          >
            <Upload_
              uploadType={fileTypeStr}
              maxFilesNum={1}
              maxFileSize={9}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="调度运用方案"
            name="ddyyfa"
          >
            <Upload_
              uploadType={fileTypeStr}
              maxFilesNum={1}
              maxFileSize={9}
            />
          </Form.Item>
        </Col>
        {
          [
            {
              name: '坝顶宽度', key: 'damTop', max: 20, required: true, type: 'number'
            },
          ].map((s) => (
            <Col span={8}>
              <FormItem
                label={`${s.name}：`}
                name={s.key}
                rules={s.required ? [{
                  required: true, message: '不能为空，且最多为20个字符',
                }] : []}
              >
                <Input type={s?.type || 'text'} style={styleWapper} maxLength={s.max} placeholder={`${s.name}最长20个字符`} />
              </FormItem>
            </Col>
          ))
        }
      </Row>
    </ModalForm>
  );
}
