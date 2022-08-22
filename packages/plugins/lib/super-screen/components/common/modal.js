/* 公共模块大屏弹出框组件 */
import React from 'react';
import { Modal, Row } from 'antd';

const designWidth = 2880;
const designHeight = 1080;

function ScreenModal(props) {
  const {
    visible, onCloseModal, children, contentHeight = 500, modalWidth = 1200,
  } = props;

  const w = document.body.clientWidth / designWidth;
  const h = document.body.clientHeight / designHeight;
  const scale = w < h ? w : h;

  const bodyStyle = {
    backgroundImage: "url('/assets/images/screen/cockpit/modal/modal_bg.png')",
    backgroundSize: '100% 100%',
    transform: `scale(${scale})`,
    backgroundColor: '#000',
  };

  const onClose = () => {
    onCloseModal && onCloseModal();
  };

  return (
    <Modal
      maskClosable={false}
      wrapClassName="custom-modal"
      visible={visible}
      closable={false}
      width={`${modalWidth}px`}
      centered
      footer={null}
      bodyStyle={bodyStyle}
    >
      <div id="emergency-command-modal">
        <Row className="close">
          <img
            aria-hidden
            onClick={onClose}
            className="onpoint"
            alt=""
            src="/assets/images/screen/cockpit/modal/close.png"
            width="28px"
          />
        </Row>
        <div className="content flex-column flex-content-around" style={{ height: contentHeight }}>
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default ScreenModal;
