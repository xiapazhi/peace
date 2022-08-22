import React, { useState, useRef, useEffect } from 'react';
import { Input, Form, Collapse } from 'antd';
import {
  AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
} from '@ant-design/icons';
import Upload from '../Upload';
import SketchColor from '../sketchColor';
import PerfectScrollbar from 'perfect-scrollbar';
import { Func } from '@peace/utils';
import {
  ProForm,
  ProFormDigit,
  ProFormSwitch,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form';
import CssEditor from './css-editor';

const FormItem = Form.Item;
const { Panel } = Collapse;

function DesignLogin(props) {
  const {
    setPannelJsonSchema, pannelJsonSchema, contentHeight, initialValues, apiRoot,
  } = props;
  const formRef = useRef();
  const defaultValues = { ...initialValues };
  if (initialValues?.pageBackgroundImage) {
    defaultValues.pageBackgroundImage = [{
      uid: '-1',
      name: Func.getDownloadFileName(initialValues.pageBackgroundImage),
      status: 'done',
      storageUrl: initialValues.pageBackgroundImage,
      url: Func.getRealFile(apiRoot, initialValues.pageBackgroundImage),
    }];
  }
  if (initialValues?.loginCardBackgroundImage) {
    defaultValues.loginCardBackgroundImage = [{
      uid: '-1',
      name: Func.getDownloadFileName(initialValues.loginCardBackgroundImage),
      status: 'done',
      storageUrl: initialValues.loginCardBackgroundImage,
      url: Func.getRealFile(apiRoot, initialValues.loginCardBackgroundImage),
    }];
  }

  const handleColorChangeComplete = (name, color) => {
    formRef?.current?.setFieldsValue({
      [name]: color.hex,
    });
    setPannelJsonSchema({
      ...pannelJsonSchema,
      [name]: color.hex,
    });
  };

  const onValuesChange = (values) => {
    let newValues = {};
    if (Array.isArray(values?.pageBackgroundImage)) {
      newValues = { pageBackgroundImage: values?.pageBackgroundImage[0]?.storageUrl };
    } else if (Array.isArray(values?.loginCardBackgroundImage)) {
      newValues = { loginCardBackgroundImage: values?.loginCardBackgroundImage[0]?.storageUrl };
    } else {
      newValues = values;
    }
    setPannelJsonSchema({
      ...pannelJsonSchema,
      ...newValues,
    });
  };
  const onSaveStyle = (styleName, styleData) => {
    setPannelJsonSchema({
      ...pannelJsonSchema,
      [styleName]: styleData,
    });
  };

  const getPagePannel = () => (
    <Panel header="页面配置" key="page-pannel">
      <FormItem label="css编辑" name="pageDivStyle" tooltip="#main里写css会应用到最外层div">
        <CssEditor styleData={defaultValues?.pageDivStyle || {}} contentHeight={contentHeight} styleName="pageDivStyle" onSaveStyle={onSaveStyle} />
      </FormItem>
      <FormItem label="背景图片" name="pageBackgroundImage">
        <Upload
          listType="picture-card"
          uploadType="image"
          maxFilesNum={1}
          maxFileSize={20}
        />
      </FormItem>
    </Panel>
  );

  const getLoginCardPannel = () => (
    <Panel header="登录卡片配置" key="login-card">
      <FormItem label="css编辑" name="pageLoginCardDivStyle" tooltip="#main里写css会应用到最外层div">
        <CssEditor styleData={defaultValues?.pageLoginCardDivStyle || {}} contentHeight={contentHeight} styleName="pageLoginCardDivStyle" onSaveStyle={onSaveStyle} />
      </FormItem>
      <Collapse defaultActiveKey={['login-card-box']} accordion>
        <Panel header="登录框" key="login-card-box">
          <ProFormDigit
            label="宽度"
            name="loginCardWidth"
            min={200}
            max={800}
          />
          <ProFormDigit
            label="高度"
            name="loginCardHeight"
            min={200}
            max={800}
          />
          <ProFormRadio.Group
            label="位置"
            radioType="button"
            fieldProps={{
              defaultValue: 'flex-end',
            }}
            colProps={{
              span: 20,
            }}
            name="loginCardBackgroundPostion"
            options={[{
              label: <AlignLeftOutlined />,
              value: 'flex-start',
            }, {
              label: <AlignCenterOutlined />,
              value: 'center',
            }, {
              label: <AlignRightOutlined />,
              value: 'flex-end',
            }]}
          />
          <ProFormRadio.Group
            label="背景设置"
            radioType="button"
            fieldProps={{
              defaultValue: '图片',
            }}
            colProps={{
              span: 20,
            }}
            name="loginCardBackgroundType"
            options={['图片', '颜色']}
          />
          <ProFormDependency name={['loginCardBackgroundType']}>
            {({ loginCardBackgroundType }) => (
              loginCardBackgroundType === '颜色'
                ? (
                  <Form.Item
                    label="背景色"
                  >
                    <Form.Item name="loginCardBackgroundColor" noStyle><Input disabled /></Form.Item>
                    <SketchColor
                      color={defaultValues?.loginCardBackgroundColor || '#fff'}
                      width={250}
                      style={{ color: '#333', marginTop: 5 }}
                      onChangeComplete={(color) => handleColorChangeComplete('loginCardBackgroundColor', color)}
                    />
                  </Form.Item>
                ) : (
                  <FormItem label="背景图片" name="loginCardBackgroundImage">
                    <Upload
                      listType="picture-card"
                      uploadType="image"
                      maxFilesNum={1}
                      maxFileSize={10}
                    />
                  </FormItem>
                )
            )}
          </ProFormDependency>
        </Panel>
        <Panel header="标题栏" key="login-card-title">
          <ProFormDigit
            label="高度"
            name="loginCardTitleHeight"
            min={20}
            max={120}
          />
          <Form.Item
            label="文字颜色"
          >
            <Form.Item name="loginCardTitleColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardTitleColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardTitleColor', color)}
            />
          </Form.Item>
          <ProFormDigit
            label="文字大小"
            name="loginCardTitleSize"
            min={12}
            max={42}
          />
        </Panel>
        <Panel header="输入框配置" key="login-card-input">
          <ProFormSwitch
            width="md"
            name="loginCardShowLabel"
            label="显示label"
          />
          <ProFormDependency name={['loginCardShowLabel']}>
            {({ loginCardShowLabel }) => (
              loginCardShowLabel
              && (
                <>
                  <ProFormRadio.Group
                    label="显示位置"
                    radioType="button"
                    fieldProps={{
                      defaultValue: 'horizontal',
                    }}
                    colProps={{
                      span: 20,
                    }}
                    name="loginCardFormLayout"
                    options={[{
                      label: '不换行',
                      value: 'horizontal',
                    }, {
                      label: '换行',
                      value: 'vertical',
                    }]}
                  />
                  <Form.Item
                    label="label文字颜色"
                  >
                    <Form.Item name="loginCardLabelFontColor" noStyle><Input disabled /></Form.Item>
                    <SketchColor
                      color={defaultValues?.loginCardLabelFontColor || '#fff'}
                      width={250}
                      style={{ color: '#333', marginTop: 5 }}
                      onChangeComplete={(color) => handleColorChangeComplete('loginCardLabelFontColor', color)}
                    />
                  </Form.Item>
                </>
              )
            )}
          </ProFormDependency>
          <ProFormSwitch
            width="md"
            name="loginCardShowIcon"
            label="显示Icon"
          />
          <Form.Item
            label="外框颜色"
          >
            <Form.Item name="loginCardInputBorderColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardInputBorderColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardInputBorderColor', color)}
            />
          </Form.Item>
          <Form.Item
            label="背景颜色"
          >
            <Form.Item name="loginCardInputBackgroundColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardInputBackgroundColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardInputBackgroundColor', color)}
            />
          </Form.Item>
          <Form.Item
            label="文字颜色"
          >
            <Form.Item name="loginCardInputFontColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardInputFontColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardInputFontColor', color)}
            />
          </Form.Item>
        </Panel>
        <Panel header="忘记密码行配置" key="login-card-ext">
          <ProFormSwitch
            width="md"
            name="loginCardShowForgetPassWord"
            label="显示忘记密码"
          />
          <ProFormDigit
            label="忘记密码行高度"
            name="loginCardExtRowHeight"
            min={20}
            max={120}
          />
          <Form.Item
            label="忘记密码文字色"
          >
            <Form.Item name="loginCardForgetPassWordColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardForgetPassWordColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardForgetPassWordColor', color)}
            />
          </Form.Item>

        </Panel>
        <Panel header="登录按钮配置" key="login-card-btn">
          <Form.Item
            label="登录按钮背景色"
          >
            <Form.Item name="loginCardBtnBackgroundColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardBtnBackgroundColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardBtnBackgroundColor', color)}
            />
          </Form.Item>
          <Form.Item
            label="登录按钮边框色"
          >
            <Form.Item name="loginCardBtnBorderColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardBtnBorderColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardBtnBorderColor', color)}
            />
          </Form.Item>
          <ProFormDigit
            label="文字大小"
            name="loginCardBtnFontSize"
            min={12}
            max={30}
          />
          <Form.Item
            label="文字颜色"
          >
            <Form.Item name="loginCardBtnFontColor" noStyle><Input disabled /></Form.Item>
            <SketchColor
              color={defaultValues?.loginCardBtnFontColor || '#fff'}
              width={250}
              style={{ color: '#333', marginTop: 5 }}
              onChangeComplete={(color) => handleColorChangeComplete('loginCardBtnFontColor', color)}
            />
          </Form.Item>
        </Panel>
      </Collapse>
    </Panel>
  );

  let scrollbar = null;

  useEffect(() => {
    scrollbar = new PerfectScrollbar('#right-pannel-wrapper', { suppressScrollX: true });
  }, []);
  useEffect(() => {
    const dom = document.getElementById('right-pannel-wrapper');
    if (dom && scrollbar) {
      scrollbar.update();
      dom.scrollTop = 0;
    }
  }, [contentHeight]);

  return (
    <div id="right-pannel-wrapper" style={{ position: 'relative', height: contentHeight - 59 - 48 }}>
      <ProForm
        // labelCol={{ span: 10 }}
        // wrapperCol={{ span: 14 }}
        submitter={false}
        formRef={formRef}
        layout="vertical"
        initialValues={defaultValues}
        onValuesChange={onValuesChange}
      >
        <Collapse defaultActiveKey={['page-pannel']} accordion>
          {getPagePannel()}
          {getLoginCardPannel()}
        </Collapse>
      </ProForm>
    </div>

  );
}

export default DesignLogin;
