import React, { useRef, useEffect, useState } from 'react';
import ProForm, { ProFormText, ProFormDependency } from '@ant-design/pro-form';
import { Form, Row, Col } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { LayoutContent } from '@peace/components';
import { Func } from '$utils';
import { getCheckRecords } from '../actions/record';

const FormItem = Form.Item;
function RecordDetail(props) {
  const {
    checkrecords, match, dispatch,
    actions, myStructList, authorData, user,
  } = props;
  const formRef = useRef();
  const [visible, setVisible] = useState({});
  useEffect(() => {
    dispatch(getCheckRecords());
    dispatch(actions.damCheck.getAuthorList(user?.orgId));
    dispatch(actions.damCheck.getMyStructList(user?.orgId)).then((res) => {
      if (res.success) {
        if (res.payload.data.length > 0) {
          dispatch(actions.damCheck.getStructUsers(res?.payload?.data[0]?.id));
        }
      }
    });
  }, []);

  useEffect(() => () => {
    formRef.current?.resetFields();
  });

  let initialValues = {};
  const id = match?.params?.id;
  let form1 = []; let form2 = []; const
    form3 = [];
  if (id && checkrecords?.length > 0) {
    // 查询所属结构物名称和巡检人名称
    checkrecords.map((s, index) => {
      s.index = index + 1;
      s.name = myStructList.find((x) => x.id == parseInt(s?.DamCheckPlan.structId))?.name; // 查询结构物名称
      authorData.forEach((x) => {
        if (x.members.find((v) => v.id == parseInt(s?.DamCheckPlan.userId))) {
          s.departmentName = x.members.find((v) => v.id == parseInt(s?.DamCheckPlan.userId))?.departmentName;// 查询部门名称
          s.user = x.members.find((v) => v.id == parseInt(s?.DamCheckPlan.userId))?.name; // 查询巡检人名称
        }
      });
      return s;
    });
    const detail = checkrecords.find((s) => s.id == parseInt(id));
    const index = checkrecords.findIndex((s) => s.id == parseInt(id));
    initialValues = {
      ...detail,
      ...detail?.DamCheckPlan,
      start: moment(detail?.DamCheckPlan?.start).format('YYYY-MM-DD HH:mm:ss dddd'),
      end: moment(detail?.DamCheckPlan?.end).format('YYYY-MM-DD HH:mm:ss dddd'),
      time: moment(detail?.time).format('YYYY-MM-DD HH:mm:ss dddd'),
      lastTime: index > 0 && checkrecords[index - 1] ? moment(checkrecords[index - 1].time).format('YYYY-MM-DD HH:mm:ss dddd') : '-',
    };
    form1 = [
      [{ name: 'name', text: '结构物名称' }],
      [{ name: 'start', text: '开始时间' }, { name: 'end', text: '结束时间' }],
      [{ name: 'way', text: '巡检方式' }, { name: 'frequency', text: '巡检频次' }],
      [{ name: 'user', text: '巡检人' }, { name: 'departmentName', text: '巡检单位' }],
    ];

    form2 = [
      [{ name: 'lastTime', text: '上次巡检日期' }, { name: 'time', text: '本次巡检日期' }],
    ];
    Object.keys(detail?.extra).forEach((key) => {
      form3.push({
        name: key,
        ...detail?.extra[key],
      });
      initialValues[`${key}desc`] = detail?.extra[key]?.desc;
      initialValues[key] = detail?.extra[key]?.state;
    });
  }

  return (
    <div perfectScroll={false} style={{ margin: 15, padding: 15, background: '#fff' }}>
      <ProForm
        title=""
        initialValues={initialValues}
        formRef={formRef}
        layout="horizontal"
        // // grid={true}
        // labelCol={{ span: 6 }}
        // wrapperCol={{ span: 14 }}
        submitter={{ render: () => '' }}
      >
        <div className="record-detail-title">巡检要求</div>
        {
          form1.map((s, index) => (
            <ProForm.Group key={`form1${index}`}>
              {
                s.map((x) => (
                  <ProFormText
                    width="lg"
                    key={x.name}
                    name={x.name}
                    label={x.text}
                    disabled
                    colProps={{
                      span: 12,
                    }}
                  />
                ))
              }
            </ProForm.Group>
          ))
        }

        <div className="record-detail-title">巡检结果</div>
        {
          form2.map((s, index) => (
            <ProForm.Group key={`form2${index}`}>
              {
                s.map((x) => (
                  <ProFormText
                    width="lg"
                    key={x.name}
                    name={x.name}
                    label={x.text}
                    disabled
                    colProps={{
                      span: 12,
                    }}
                  />
                ))
              }
            </ProForm.Group>
          ))
        }

        {
          form3.map((s, index) => (
            <div key={`form3-group${index}`}>
              <ProForm.Group>
                <ProFormText
                  width="lg"
                  key={s.name}
                  name={s.name}
                  addonAfter={s.images || s.desc ? (
                    <a onClick={() => {
                      const visibleToSave = { ...visible };
                      visibleToSave[s.name] = !visible[s.name];
                      setVisible(visibleToSave);
                    }}
                    >
                      {visible[s.name] ? '收起详情' : '展开详情'}
                    </a>
                  ) : null}
                  label={s.name}
                  disabled
                  colProps={{
                    span: 12,
                  }}
                />
              </ProForm.Group>
              <ProFormDependency key={`form3-ProFormDependency${index}`} name={[s.name]}>
                {({ item1 }) => {
                  if (visible[s.name]) {
                    return (
                      <>
                        <ProFormText
                          width="lg"
                          name={`${s.name}desc`}
                          key={`${s.name}desc`}
                          disabled
                          label="问题描述"
                        />
                        <FormItem
                          label="现场图片"
                        >
                          <Row style={{ width: '70%' }}>
                            {
                              s.images && s.images.map((v) => {
                                const src = Func.downloadFile(v);
                                return (
                                  <Col span={8}>
                                    {' '}
                                    <img style={{ height: 150, marginTop: 15 }} src={src} />
                                    {' '}
                                  </Col>
                                );
                              })
                            }
                          </Row>
                        </FormItem>
                      </>

                    );
                  }
                }}
              </ProFormDependency>

            </div>
          ))
        }

      </ProForm>
    </div>

  );
}

function mapStateToProps(state) {
  const {
    checkrecords, myDamStructList, global, damAuthorData, auth,
  } = state;
  return {
    loading: checkrecords.isRequesting,
    checkrecords: checkrecords?.data || [],
    myStructList: myDamStructList?.data || [],
    authorData: damAuthorData?.data || [],
    actions: global.actions,
    user: auth.user,
  };
}

export default connect(mapStateToProps)(RecordDetail);
