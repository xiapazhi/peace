import React, { useState } from 'react';
import {
  Button, Input, Form, Row, Col, Checkbox,
} from 'antd';
import { Func } from '@peace/utils';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

function LeftRender(props) {
  const { pannelJsonSchema, project } = props;

  // 页面style
  const pageDivStyle = {
    ...(pannelJsonSchema?.pageDivStyle || {}),
    height: '100%',
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
    <div style={pageDivStyle}>
      <div style={loginCardStyle}>
        <div style={titleDivStyle}>
          {project?.extra?.systemName || '监测平台'}
        </div>
        <Form
          className="design-login-container"
          {...formItemLayout}
          layout={pannelJsonSchema?.loginCardFormLayout || 'horizontal'}
        >
          <FormItem
            {...formItemUnameProps}
            style={formItemStyle}
          >
            <Input
              style={inputDivStyle}
              type="text"
              placeholder="用户名"
              {...inputUnameProps}
            />
          </FormItem>
          <FormItem {...formItemPwdProps} style={formItemStyle}>
            <Input
              style={inputDivStyle}
              type="password"
              autoComplete="new-password"
              placeholder="密码"
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
              <Col span={5} offset={7}><a style={forgetPassWordStyle}>忘记密码?</a></Col>
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
            >
              登录
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default LeftRender;
