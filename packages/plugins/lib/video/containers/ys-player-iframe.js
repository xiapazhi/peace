/**
 * Created by PengLing on 2019/09/25. 
 * 
 * 萤石视频直播（基于萤石云iframe模式，使用方式简单）
 * 官方参考：https://open.ys7.com/console/ezopenIframe.html
 */
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
// import Cookie from 'js-cookie';

class YSIframePlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        url: PropTypes.string.isRequired
    };

    render() {
        const { containerId, height, width, url, autoplay, token } = this.props;
        const at = token// Cookie.get('ysAccessToken');
        if (!url || !at) return null;
        const src = `https://open.ys7.com/ezopen/h5/iframe?url=${url}&autoplay=${autoplay || 1}&accessToken=${at}`
        return (
            <iframe
                frameBorder="0"
                id={containerId || 'myPlayer'}
                src={src}
                width={width || 400} // https://open.ys7.com/doc/zh/book/index/live_proto.html 单个播放器的长宽比例限制最小为{width: 400px;height: 300px;}
                height={height || 300}
                allowFullScreen
            >
            </iframe>
        )
    }
}

export default YSIframePlayer;
