'use strict';
import { PinyinHelper } from './pinyin';
import { buildUrl } from './webapi';

export default class Func {
    static formatActionTypes(actionTypes) {
        if (!actionTypes) throw new Error('actionType 必传');
        if (typeof (actionTypes) == 'string') {
            return {
                REQUESTING: `REQUEST_${actionTypes}`,
                REQUEST_SUCCESS: `${actionTypes}_SUCCESS`,
                REQUEST_ERROR: `${actionTypes}_ERROR`,
                CLEARDATA: `${actionTypes}_CLEAR`,
            }
        } else {
            return actionTypes
        }
    };

    static judgeRights(authorizationCode, dom = null) {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        const { portal, resources = [], portals } = userInfo || {};
        let judgeRslt = false;
        if (portal && portal == 'A') {
            judgeRslt = true;
        }else if(Array.isArray(portals) && portals.find(v=> v.portal == 'A')){
            judgeRslt = true;
        } else if (typeof (authorizationCode) == 'object') {
            judgeRslt = authorizationCode.some(a => {
                return resources.includes(a)
            })
        } else {
            judgeRslt = resources.includes(authorizationCode);
        }
        if (dom) {
            return judgeRslt ? dom : '';
        } else {
            return judgeRslt
        }
    }

    static judgeRightsContainsAdmin(authorizationCode, dom = null) {
      const userInfo = JSON.parse(sessionStorage.getItem('user'));
      const { portal, resources = [], portals } = userInfo || {};
      let judgeRslt = false;
      if (typeof (authorizationCode) == 'object') {
          judgeRslt = authorizationCode.some(a => {
              return resources.includes(a)
          })
      } else {
          judgeRslt = resources.includes(authorizationCode);
      }
      if (dom) {
          return judgeRslt ? dom : '';
      } else {
          return judgeRslt
      }
    }

    static selectFilterOption(input, option) {
        let v = input.toLowerCase();
        let src = option.children.toLowerCase();
        return src.includes(v) || PinyinHelper.isPinyinMatched(src, v);
    }

    static getDownloadFileName = (src) => {
      const filePathArr = src?.split('/') || [];
      const fileName = filePathArr.length > 0 ? filePathArr[filePathArr.length - 1] : '';
      return fileName;
    };
  
    static downloadFile = (src) => {
      // 如果是直接访问的地址直接返回
      if (src?.startsWith('http')) {
        return src;
      }
      const filePathArr = src?.split('/') || [];
      const fileName = filePathArr.length > 0 ? filePathArr[filePathArr.length - 1] : '';
      const url = `attachments?src=${src}&filename=${fileName}`;
      return buildUrl(url);
    };
  
    static getRealFile = (root, src) => {
      // 如果是直接访问的地址直接返回
      if (src?.startsWith('http')) {
        return src;
      }
      const filePathArr = src?.split('/') || [];
      const fileName = filePathArr.length > 0 ? filePathArr[filePathArr.length - 1] : '';
      return `${root}/attachments?src=${src}&filename=${fileName}`;
    };
};