/**
 * hls视频直播
 * 官方参考：https://www.npmjs.com/package/hls.js/v/canary
 * test url https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
 */

import React, { useEffect } from 'react';
import Hls from 'hls.js';

function HLSPlayer(props) {
  const {
    containerId, height, width, url, autoplay, playBack,
  } = props;
  useEffect(() => {
    const video = document.getElementById(`containerId${containerId}`);
    const videoSrc = url;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('加载成功');
        video.play();
      });
    }
  }, [containerId, url]);

  if (!url) return null;
  return (
    // playBack是否是回放  回放视频展示进度条 实时视频隐藏
    <div className={playBack ? '' : 'hls-video'}>
      <video
        style={{ objectFit: 'fill', width: width || '100%', height: height || '100%' }}
        id={`containerId${containerId}`}
        controls
        autoPlay={autoplay || true}
        muted
      />
    </div>
  );
}

export default HLSPlayer;
