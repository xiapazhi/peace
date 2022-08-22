import React, { useState, useRef } from 'react';
import { ProCard } from '@ant-design/pro-card';
import {
  Button, Space, message, Modal,
} from 'antd';
import { useSize } from 'ahooks';
import LeftRender from './left-render';
import RightPannel from './right-pannel';

function DesignLoginModal(props) {
  const {
    project = {}, apiRoot, onSave, visible, setDesignLoginVisible,
  } = props;

  const initialValues = {
    loginCardShowForgetPassWord: true,
    ...(project?.extra?.loginJsonSchema || {}),
  };
  const [pannelJsonSchema, setPannelJsonSchema] = useState({ ...initialValues });
  const cardRef = useRef();
  const size = useSize(cardRef);

  const onSaveJsonSchema = () => {
    const postData = {
      name: project?.name,
      describe: project?.describe,
      type: project?.type,
      structureIds: [],
      constructionIds: [],
      structuregroupIds: [],
      extra: {
        ...(project?.extra || {}),
        loginJsonSchema: { ...pannelJsonSchema },
      },
    };
    onSave && onSave(postData);
  };

  const renderAction = () => (
    <Space>
      <Button type="primary" onClick={onSaveJsonSchema}>保存</Button>
      <Button type="default" onClick={() => setDesignLoginVisible(false)}>关闭</Button>
    </Space>
  );

  return (
    <Modal
      maskClosable={false}
      style={{
        top: 0, maxWidth: '100%', paddingBottom: 0,
      }}
      title={false}
      closable={false}
      visible={visible}
      footer={null}
      // okText="保存"
      // onOk={onSaveJsonSchema}
      // onCancel={() => {
      //   setDesignLoginVisible(false);
      // }}
      bodyStyle={{ height: '100vh', padding: 0 }}
      mask={false}
      destroyOnClose
      width="100%"
    >
      <ProCard ref={cardRef} split="vertical" style={{ height: '100%' }}>
        <ProCard title="登录页预览" style={{ height: '100%' }} extra={renderAction()}>
          <LeftRender
            project={project}
            pannelJsonSchema={pannelJsonSchema}
          />
        </ProCard>
        <ProCard colSpan="20%" title="页面配置" headerBordered>
          {
            apiRoot && (
              <RightPannel
                apiRoot={apiRoot}
                initialValues={initialValues}
                pannelJsonSchema={pannelJsonSchema}
                setPannelJsonSchema={setPannelJsonSchema}
                contentHeight={size?.height || 600}
              />
            )
          }
        </ProCard>
      </ProCard>
    </Modal>
  );
}

export default DesignLoginModal;
