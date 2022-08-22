import React, { useLayoutEffect, forwardRef } from 'react';

import { useAutoResize } from '@jiaminghi/data-view-react';

import './style.less';

const FullScreenContainer = forwardRef(({
  children, className, style, designWidth, designHeight,
}, ref) => {
  const { domRef } = useAutoResize(ref);

  useLayoutEffect(() => {
    // const { width, height } = window.screen;
    // const realWidth = (designWidth && designHeight) ? height * (designWidth / designHeight) : width;
    // const realHeight = (designWidth && designHeight) ? height / (designWidth / width) : height;
    // const displayWidth = realWidth > width ? width : realWidth;
    // const displayHeight = realWidth > width ? realHeight : height;

    Object.assign(domRef.current.style, {
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
    });
    const w = document.body.clientWidth / window.innerWidth;
    const h = document.body.clientHeight / window.innerHeight;
    const scale = w < h ? w : h;
    domRef.current.style.transform = `scale(${scale}) translate(-50%, -50%)`;
  });

  return (
    <div
      id="dv-full-screen-container"
      className={className}
      style={style}
      ref={domRef}
    >
      {children}
    </div>
  );
});

export default FullScreenContainer;
