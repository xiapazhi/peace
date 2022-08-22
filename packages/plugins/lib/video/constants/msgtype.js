
'use strict';

//handle message msgtype
export const EZUI_MSGID_PLAY_EXCEPTION = 0;			//播放异常
export const EZUI_MSGID_PLAY_RECONNECT = 1;			//播放重连
export const EZUI_MSGID_PLAY_RECONNECT_EXCEPTION = 2;			//播放重连异常
export const EZUI_MSGID_PLAY_START = 3;			//播放开始
export const EZUI_MSGID_PLAY_STOP = 4;			//播放停止
export const EZUI_MSGID_PLAY_ARCHIVE_END = 5;			//回放结束
export const EZUI_MSGID_VOICETALK_START = 16;			//语音对讲开始
export const EZUI_MSGID_VOICETALK_STOP = 17;			//语音对讲停止
export const EZUI_MSGID_VOICETALK_EXCEPTION = 18;			//语音对讲异常 
export const EZUI_MSGID_RECORD_FILE = 20;			//查询的录像文件
export const EZUI_MSGID_PTZCTRL_SUCCESS = 46;			//云台控制命令发送成功
export const EZUI_MSGID_PTZCTRL_FAILED = 47;			//云台控制失败

export const EZUI_ERROR_ACCESSTOKEN_EXPIRE = "UE001"; 	///< accesstoken异常或失效，需要重新获取accesstoken，并传入到sdk
export const EZUI_ERROR_APPKEY_TOKEN_NOT_MATCH = "UE002";     ///< appkey和AccessToken不匹配,建议更换appkey或者AccessToken
export const EZUI_ERROR_CHANNEL_NOT_EXIST = "UE004";     ///< 通道不存在，设备参数错误，建议重新获取播放地址
export const EZUI_ERROR_DEVICE_NOT_EXIST = "UE005";     ///< 设备不存在，设备参数错误，建议重新获取播放地址
export const EZUI_ERROR_PARAM_INVALID = "UE006";     ///< 参数错误，建议重新获取播放地址
export const EZUI_ERROR_EZOPEN_URL_INVALID = "UE007";     ///< 播放地址错误,建议重新获取播放地址
export const EZUI_ERROR_NO_RESOURCE = "UE101";	    ///< 设备连接数过大，停止其他连接后再试试
export const EZUI_ERROR_DEVICE_OFFLINE = "UE102"; 	///< 设备不在线，确认设备上线之后重试
export const EZUI_ERROR_CONNECT_DEVICE_TIMEOUT = "UE103"; 	///< 播放失败，请求连接设备超时，检测设备网路连接是否正常.
export const EZUI_ERROR_INNER_VERIFYCODE = "UE104"; 	///< 视频验证码错误，建议查看设备上标记的验证码
export const EZUI_ERROR_PLAY_FAIL = "UE105"; 	///< 视频播放失败
export const EZUI_ERROR_TERMINAL_BINDING = "UE106"; 	///< 当前账号开启了终端绑定，只允许指定设备登录操作
export const EZUI_ERROR_DEVICE_INFO_INVALID = "UE107"; 	///< 设备信息异常为空，建议重新获取播放地址
export const EZUI_ERROR_VIDEO_RECORD_NOTEXIST = "UE108"; 	///< 未查找到录像文件
export const EZUI_ERROR_VTDU_NO_RESOURCE = "UE109"; 	///< 取流并发路数限制,请升级为企业版.
export const EZUI_ERROR_UNSUPPORTED = "UE110"; 	///< 设备不支持的清晰度类型, 请根据设备预览能力级选择.