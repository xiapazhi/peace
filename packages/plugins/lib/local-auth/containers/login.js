import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  Button, Input, Form, Row, Col, message, Modal, Spin, Result,
} from 'antd';
import { UserOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Qs from 'qs';
import { useTheme, Func } from '$utils';
import { login } from '../actions/auth';
import { getProjectInfo, GET_PROJECT_SUCCESS } from '../actions/project';

const QRCode = require('qrcode.react');

const FormItem = Form.Item;

function Login(props) {
  const {
    dispatch, user, error, logining, project, projectError, isRequesting, location,
  } = props;

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [flag, setFlag] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);
  const [clientWidth, setClientWidth] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const changeTheme = useTheme('light');
  const { search } = location;
  const { p = 'default', n, w } = Qs.parse(search, { ignoreQueryPrefix: true });
  const currHref = document.location.href;

  useEffect(() => {
    setClientWidth(document.body.clientWidth);
    setClientHeight(document.body.clientHeight);
    if (!project) {
      dispatch(getProjectInfo(p)).then((action) => {
        setFlag(true);
        if (action.type != GET_PROJECT_SUCCESS) {
          // dispatch(push(`/404`))
        } else if (p && n && w) {
          dispatch(login(n, w, p));
        }
      });
    }
    window.onresize = () => {
      setClientWidth(document.body.clientWidth);
      setClientHeight(document.body.clientHeight);
    };
  }, []);

  useEffect(() => {
    document.title = project?.extra?.systemName || '监测平台';
    const favicon = document.querySelector('link[rel="shortcut icon"]');
    if (favicon && project?.extra?.favicon) {
      favicon.href = Func.downloadFile(project?.extra?.favicon);
    }
  }, [project, p]);

  useEffect(() => {
    if (error) {
      message.error(error);
      setPassword('');
    }
  }, [error]);

  useEffect(() => {
    if (user && user.authorized) {
      dispatch(push('/projectOverview'));
    }
  }, [user]);

  const enterHandler = (e) => {
    if (e.key === 'Enter') {
      setInputChanged(false);
      dispatch(login(username, password, p));
    }
  };

  const handleLogin = () => {
    setInputChanged(false);
    dispatch(login(username, password, p));
  };

  const QRCodeClick = (name, website) => {
    Modal.info({
      title: name,
      content: (
        <div style={{
          textAlign: 'center', position: 'relative', right: 21, marginTop: 30,
        }}
        >
          <QRCode size={150} value={website} />
        </div>
      ),
      okText: '关闭',
      onOk() {
      },
    });
  };

  if (p && n && w) {
    return <div />;
  }

  const pannelJsonSchema = project?.extra?.loginJsonSchema || {};
  // 页面style
  const pageDivStyle = {
    ...(pannelJsonSchema?.pageDivStyle || {}),
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: pannelJsonSchema?.loginCardBackgroundPostion || 'flex-end',
    padding: '0 5%',
    backgroundImage: pannelJsonSchema?.pageBackgroundImage ? `url(${Func.downloadFile(pannelJsonSchema?.pageBackgroundImage)})` : `url(${'../../../../assets/images/bg.png'})`,
    backgroundSize: '100% 100%',
  };

  // 登录卡片style
  const loginCardStyle = {
    ...(pannelJsonSchema?.pageLoginCardDivStyle || {}),
    height: pannelJsonSchema?.loginCardHeight || 358,
    padding: 15,
    borderRadius: 10,
  };
  if (pannelJsonSchema?.loginCardWidth) {
    loginCardStyle.width = pannelJsonSchema?.loginCardWidth;
  } else {
    loginCardStyle.minWidth = 455;
  }
  if (pannelJsonSchema?.loginCardBackgroundType === '颜色') {
    loginCardStyle.backgroundColor = pannelJsonSchema?.loginCardBackgroundColor || '#fff';
  } else {
    loginCardStyle.backgroundImage = pannelJsonSchema?.loginCardBackgroundImage ? `url(${Func.downloadFile(pannelJsonSchema?.loginCardBackgroundImage)})` : `url(${'../../../../assets/images/login_bg.png'})`;
    loginCardStyle.backgroundSize = '100% 100%';
  }
  // 标题栏样式
  const titleDivStyle = {
    fontSize: pannelJsonSchema?.loginCardTitleSize || 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: pannelJsonSchema?.loginCardTitleColor || '#187FBE',
    height: pannelJsonSchema?.loginCardTitleHeight || 60,
  };
  // form样式
  const formItemUnameProps = pannelJsonSchema?.loginCardShowLabel ? { label: '用户名' } : {};
  const formItemPwdProps = pannelJsonSchema?.loginCardShowLabel ? { label: '密 码' } : {};
  const formItemLayout = pannelJsonSchema?.loginCardShowLabel && pannelJsonSchema?.loginCardFormLayout !== 'vertical' ? {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  } : {};
  const formItemStyle = pannelJsonSchema?.loginCardLabelFontColor ? {
    color: pannelJsonSchema?.loginCardLabelFontColor,
  } : {};
  // 输入框样式
  const inputDivStyle = {
    border: pannelJsonSchema?.loginCardInputBorderColor ? `2px solid ${pannelJsonSchema?.loginCardInputBorderColor}` : '2px solid #9BB6E4',
    borderRadius: 5,
    color: pannelJsonSchema?.loginCardInputFontColor ? pannelJsonSchema?.loginCardInputFontColor : '#333',
  };
  if (pannelJsonSchema?.loginCardInputBackgroundColor) {
    inputDivStyle.backgroundColor = pannelJsonSchema?.loginCardInputBackgroundColor;
  }

  const inputUnameProps = pannelJsonSchema?.loginCardShowIcon ? { prefix: <UserOutlined /> } : {};
  const inputPwdProps = pannelJsonSchema?.loginCardShowIcon ? { prefix: <LockOutlined /> } : {};

  // 忘记密码 ROW 样式
  const showExtRow = !!pannelJsonSchema?.loginCardShowForgetPassWord;
  const extRowStyle = {
    height: pannelJsonSchema?.loginCardExtRowHeight || 30,
  };
  const forgetPassWordStyle = pannelJsonSchema?.loginCardForgetPassWordColor ? {
    color: pannelJsonSchema?.loginCardForgetPassWordColor,
  } : {};

  // 登录按钮样式
  const btnStyle = {
    fontSize: pannelJsonSchema?.loginCardBtnFontSize || 16,
    color: pannelJsonSchema?.loginCardBtnFontColor || '#fff',
  };
  if (pannelJsonSchema?.loginCardBtnBackgroundColor) {
    btnStyle.backgroundColor = pannelJsonSchema?.loginCardBtnBackgroundColor;
  }
  if (pannelJsonSchema?.loginCardBtnBorderColor) {
    btnStyle.borderColor = pannelJsonSchema?.loginCardBtnBorderColor;
  }
  return (
    <Spin spinning={isRequesting}>
      {
        project ? (
          <div style={pageDivStyle}>
            <div style={loginCardStyle}>
              <div style={titleDivStyle}>
                {project?.extra?.systemName || '监测平台'}
              </div>
              <Form
                className="design-login-container"
                {...formItemLayout}
                layout={pannelJsonSchema?.loginCardFormLayout || 'horizontal'}
                onKeyDown={enterHandler}
              >
                <FormItem
                  {...formItemUnameProps}
                  style={formItemStyle}
                >
                  <Input
                    style={inputDivStyle}
                    type="text"
                    value={username}
                    placeholder="用户名"
                    onChange={(e) => {
                      setUserName(e.target.value);
                      setInputChanged(true);
                    }}
                    {...inputUnameProps}
                  />
                </FormItem>
                <FormItem {...formItemPwdProps} style={formItemStyle}>
                  <Input
                    style={inputDivStyle}
                    type="password"
                    value={password}
                    placeholder="密码"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setInputChanged(true);
                    }}
                    {...inputPwdProps}
                  />
                </FormItem>
              </Form>
              {
                showExtRow && (
                  <Row style={extRowStyle}>
                    <Col span={12}>
                      {/* <Checkbox
              style={{ color: '#A8A8A8', marginBottom: 8 }}
            >
              <span style={{ color: '#A8A8A8' }}>记住密码</span>
            </Checkbox> */}
                    </Col>
                    <Col span={5} offset={7}><a href={`/forget?p=${p}`} style={forgetPassWordStyle}>忘记密码?</a></Col>
                  </Row>
                )
              }
              <Row style={{ textAlign: 'center' }}>
                <Col span={24}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    style={btnStyle}
                    loading={logining}
                    onClick={handleLogin}
                  >
                    登录
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        ) : flag && (
          <Result
            status="warning"
            title={`[${p}],不存在的pcode码,请输入正确的p参数`}
          />

        )
      }
    </Spin>

  );
}

function mapStateToProps(state) {
  const { auth, project } = state;
  return {
    user: auth.user,
    error: auth.error,
    logining: auth.isRequesting,
    project: project.info,
    isRequesting: project.isRequesting,
    projectError: project.error,
  };
}

export default connect(mapStateToProps)(Login);
