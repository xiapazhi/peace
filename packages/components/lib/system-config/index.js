import React, { useRef } from 'react';
import { Modal } from 'antd';
import { Func } from '@peace/utils';
import  Form  from '../form';

function SystemConfigForm(props) {
  const {
    project = {}, visible, apiRoot, setSystemConfigVisible, onSave,
  } = props;
  const formRef = useRef();

  const renderFormItems = () => {
    const formItems = [
      {
        type: 'Input',
        id: 'systemName',
        label: '平台名称',
        rules: [{ whitespace: true }],
        itemProps: {
          maxLength: 30,
          placeholder: '平台名称最长 30 字符',
        },
      }, {
        type: 'FileUpload',
        id: 'favicon',
        label: '浏览器图标',
        itemProps: {
          uploadType: 'image',
          maxFilesNum: 1,
          maxFileSize: 2,
          listType: 'picture-card',
          onChange: (file) => {
            // console.log('%c [ file ]-87', 'font-size:13px; background:pink; color:#bf2c9f;', file);
          },
        },
        containerProps: {
          extra: '业主侧浏览器小图标展示，尺寸建议 32*32 或者 16*16',
        },

      }, {
        type: 'FileUpload',
        id: 'logo',
        label: '项目logo',
        itemProps: {
          uploadType: 'image',
          maxFilesNum: 1,
          maxFileSize: 2,
          listType: 'picture-card',
          onChange: (file) => {
            // console.log('%c [ file ]-87', 'font-size:13px; background:pink; color:#bf2c9f;', file);
          },
        },
        containerProps: {
          extra: '业主侧头部logo展示，尺寸建议 高度不超过40，宽度不超过200',
        },
      },
    ];

    return formItems;
  };

  const submit = () => {
    const { current } = formRef;
    current.validateFields().then((val) => {
      const extra = {
        ...(project.extra || {}),
        systemName: val?.systemName || null,
        favicon: Array.isArray(val?.favicon) ? val?.favicon[0]?.storageUrl : null,
        logo: Array.isArray(val?.logo) ? val?.logo[0]?.storageUrl : null,
      };

      const postData = {
        name: project?.name,
        describe: project?.describe || '',
        structureIds: [],
        constructionIds: [],
        structuregroupIds: [],
        type: project?.type || 'struct',
        extra,
      };
      onSave && onSave(postData);
    });
  };

  const editData = () => (project ? {
    systemName: project?.extra?.systemName,
    favicon: project?.extra?.favicon ? [{
      uid: '-1',
      name: 'favicon.png',
      status: 'done',
      storageUrl: project?.extra?.favicon,
      thumbUrl: Func.getRealFile(apiRoot, project?.extra?.favicon),
      url: Func.getRealFile(apiRoot, project?.extra?.favicon),
    }] : [],
    logo: project?.extra?.logo ? [{
      uid: '-1',
      name: 'favicon.png',
      status: 'done',
      storageUrl: project?.extra?.logo,
      thumbUrl: Func.getRealFile(apiRoot, project?.extra?.logo),
      url: Func.getRealFile(apiRoot, project?.extra?.logo),
    }] : [],
  } : {});

  return (
    <Modal
      maskClosable={false}
      title="系统配置"
      visible={visible}
      // confirmLoading={btnLoading || isRequesting}
      okText="保存"
      onOk={submit}
      onCancel={() => {
        setSystemConfigVisible(false);
      }}
      destroyOnClose
      width={600}
    >
      <Form
        ref={formRef}
        formItems={renderFormItems()}
        formItemLayout={{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }}
        popupContainerId="systemConfigForm"
        dataToEdit={editData()}
      />
    </Modal>
  );
}

export default SystemConfigForm;
