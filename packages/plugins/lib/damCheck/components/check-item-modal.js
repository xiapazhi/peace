import React from 'react';
import { Button } from 'antd';
import {
  ModalForm,
  ProFormText
} from '@ant-design/pro-form';
import moment from 'moment';
export default function TunnelModal(props) {
  const {
    title,
    triggerRender,
    editData = null,
    onFinish,
    checkitems,
    readOnly,
  } = props;

  const checkName = async (rule, value) => {
    if (editData) {
      if (checkitems.some((v) => editData.id !== v.id && v.name === value)) {
        return Promise.reject(new Error('名称已经存在!'));
      }
    } else if (checkitems.some((v) => v.name === value)) {
      return Promise.reject(new Error('名称已经存在!'));
    }
    return Promise.resolve();
  };

  const initialValues = editData
    ? {
      ...editData,
      time: moment(editData.time).format('YYYY-MM-DD HH:mm:ss')
    } : {};

  return (
    <ModalForm
      title={title || ''}
      initialValues={initialValues}
      trigger={
        triggerRender
        || (
          <Button type="primary" ghost>
            {title || ''}
          </Button>
        )
      }
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => { },
      }}
      onFinish={async (values) => {
        onFinish && (await onFinish(values, editData));
        return true;
      }}
    >
      <ProFormText
        width="lg"
        rules={[
          { required: true, message: '请输入检查项!' },
          { validator: checkName },
          { max: 20, message: '检查项长度不能大于20个字符' },
        ]}
        name="name"
        label="检查项"
        placeholder="请输入检查项"
        disabled={readOnly}
      />

      <ProFormText
        width="lg"
        rules={[
          { required: true, message: '请输入检查位置!' },
          { validator: checkName },
          { max: 20, message: '检查位置长度不能大于20个字符' },
        ]}
        name="location"
        label="检查位置"
        placeholder="请输入检查位置"
        disabled={readOnly}
      />

      {readOnly && <ProFormText
        width="lg"
        name="time"
        label="更新时间"
        disabled
      />}
      {readOnly && <ProFormText
        width="lg"
        name="operator"
        label="操作人"
        disabled
      />}
    </ModalForm>
  );
}
