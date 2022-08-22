import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { push } from 'react-router-redux';
import FullScreenContainer from '../components/full-screen-container';
import ShuikuContainer from './shuikuContainer';
import '../style.less';
import moment from 'moment'


function SuperScreen(props) {
  const { dispatch, match } = props;
  const { params } = match;
  // const { data: weather = {} } = useMockRequest({ url: 'https://sapi.k780.com?app=weather.future&weaid=101240103&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&_c_ip=%253A%253A1' });

  const renderExit = () => (
    <>
      进入后台
      <img
        aria-hidden
        alt=""
        src="/assets/images/screen/exit.png"
        className="exit_png"
        onClick={() => {
          sessionStorage.setItem('selectedKeys', 'dataMonitor-factor');
          dispatch(push('/dataMonitor/factor'))
        }}
      />
    </>
  );

  return (
    <div id="super-screen-wrapper">
      {/* <FullScreenContainer
        designWidth={1920}
        designHeight={1080}
      > */}
      <div className="main-header">
        <div className="left" >
          <div className='weather'>
            26℃ 晴转多云
          </div>
          <div className='date'>
            {moment().format('YYYY-MM-DD')}  {moment().format('dddd')}
          </div>
        </div>
        <div className="middle title-font">
          水库大坝信息化监测平台
        </div>
        <div className="right">
          {params?.menu === 'cockpit' && <Button onClick={showDrawer} ghost>{currentStruct?.name}</Button>}
          {renderExit()}
        </div>
      </div>
      <ShuikuContainer dispatch={dispatch} />
      {/* </FullScreenContainer> */}
    </div>

  );
}

function mapStateToProps(state) {
  const { auth, global } = state;

  return {
    user: auth.user,
    error: auth.error,
    sections: global.sections,
    resourceRoot: global.apiRoot,
  };
}

export default connect(mapStateToProps)(SuperScreen);
