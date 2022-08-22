/**
 * 萤石视频直播（基于萤石云iframe模式，使用方式简单）
 * 官方参考：https://open.ys7.com/console/ezopenIframe.html
 */

import React from "react";

function YSIframePlayer(props) {
  const { containerId, height, width, url, autoplay, token } = props;
  const at = token;
  if (!url || !at) return null;
  const src = `https://open.ys7.com/ezopen/h5/iframe?url=${url}&autoplay=${autoplay ||
    1}&accessToken=${at}`;
  return (
    // eslint-disable-next-line jsx-a11y/iframe-has-title
    <iframe
      frameBorder="0"
      id={containerId || "myPlayer"}
      src={src}
      width={width || 400}
      height={height || 300}
      allowFullScreen
    />
  );
}

export default YSIframePlayer;
