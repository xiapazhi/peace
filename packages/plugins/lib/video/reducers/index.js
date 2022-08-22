'use strict';

import { videoList, stationVideoInfo, videoAccessToken } from './video';
import { realTimeVideo, historyVideo, currentTimeHistoryVideo, ptzControlVideo, heartBeatVideo } from './videoPlay';
export default {
    videoList, stationVideoInfo, videoAccessToken,
    realTimeVideo, historyVideo, currentTimeHistoryVideo, ptzControlVideo, heartBeatVideo
}