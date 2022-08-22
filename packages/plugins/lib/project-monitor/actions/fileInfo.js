/**
 * Created by zmh on 2017/6/19.
 */

import {
  Request, RouteRequest, basicAction, buildUrl,
} from '@peace/utils';

import { ApiTable } from '$utils';
import * as types from '../constants/fileInfo';

const apiUrl = {
  uploadFile: 'users/{userId}/netdisk-files/upload',
  deleteFile: 'netdisk-files/{fileId}',
  attachments: 'attachments',
};
export function uploadFile(userId, fileInfo, type) {
  return (dispatch) => {
    dispatch({ type: types.UPLOAD_FILE_REQUEST });
    const url = apiUrl.uploadFile.replace('{userId}', userId);
    return Request.post(url, fileInfo)
      .then(
        (_) => dispatch({ type: types.UPLOAD_FILE_SUCCESS, done: type == 'schedule' ? '' : '文件入库成功' }),
        (error) => dispatch({ type: types.UPLOAD_FILE_FAILURE, error: error.response.body.message }),
      );
  };
}

// export function uploadFile(userId, fileInfo) {
//   return (dispatch) => basicAction({
//     type: 'post',
//     dispatch,
//     actionType: 'UPLOAD_FILE_REQUEST',
//     data: fileInfo,
//     url: apiUrl.uploadFile.replace('{userId}', userId),
//     msg: {
//       option: '保存文件信息',
//     },
//   });
// }

// export function removeFile(fileId, fileName) {
//   return (dispatch) => {
//     dispatch({ type: types.REMOVE_FILE_REQUEST });
//     if (fileId) {
//       return RouteRequest.post('/_upload/cleanup', [fileId])
//         .then(
//           (_) => dispatch({ type: types.REMOVE_FILE_SUCCESS }),
//           (error) => dispatch({ type: types.REMOVE_FILE_FAILURE }),
//         );
//     }
//     return dispatch({ type: types.REMOVE_FILE_SUCCESS });
//   };
// }
export function removeFile(src) {
  return (dispatch) => basicAction({
    type: 'del',
    dispatch,
    actionType: 'REMOVE_FILE_REQUEST',
    url: `${apiUrl.attachments}?src=${src}`,
    msg: {
      option: '删除文件',
    },
  });
}

export function deleteFile(fileId, type) {
  return (dispatch) => {
    dispatch({ type: types.DELETE_FILE_REQUEST });
    const url = apiUrl.deleteFile.replace('{fileId}', fileId);
    return Request.delete(url)
      .then(
        (_) => dispatch({ type: types.DELETE_FILE_SUCCESS, done: type === 'schedule' ? '' : '删除文件成功' }),
        (error) => dispatch({ type: types.DELETE_FILE_FAILURE, error: '删除文件失败' }),
      );
  };
}

export function downloadFile(src, fileName) {
  const url = `${apiUrl.attachments}?src=${src}&filename=${fileName}`;
  return buildUrl(url);
}

export default {
  deleteFile, uploadFile, removeFile, downloadFile,
};
