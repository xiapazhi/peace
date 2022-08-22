'use strict';

import request from 'superagent';
import noCache from 'superagent-no-cache';
import { basicAction } from './actionHelper';

const rootUrl = '_api';

export const buildUrl = (url, root, userKey = 'user') => {
    const apiurl = root ? root?.startsWith('http') ? `${root}/${url}` : `/${root}/${url}` : `/${rootUrl}/${url}`;
    const user = JSON.parse(sessionStorage.getItem(userKey));
    if (user == null || apiurl?.startsWith('http')) {
        return apiurl;
    }
    let connector = url.indexOf('?') === -1 ? '?' : '&';
    return `${apiurl}${connector}token=${user.token}`;
};

export const buildRoute = (url, userKey = 'user') => {
    const user = JSON.parse(sessionStorage.getItem(userKey));
    if (user == null) {
        return url
    }
    let connector = url.indexOf('?') === -1 ? '?' : '&';
    return `${url}${connector}token=${user.token}`;
};

const setHeader = (userKey) => {
    const user = JSON.parse(sessionStorage.getItem(userKey));
    if (user == null) {
        const token = getToken();
        if (token) {
            return {
                token: token
            };
        } else
            return {};
    } else {
        return {
            token: user.token
        };
    }
};

const getToken = () => {
    let search = window.location.search
    let hasToken = search.includes('token')
    return hasToken ? search.match(/token=(.*)/)[1] : null
}
const resultHandler =
    (resolve, reject, userKey = 'user') =>
        (err, res) => {
            if (err) {
                if (err.status == 401) {
                    // 退出到登录页
                    const user = JSON.parse(sessionStorage.getItem(userKey));
                    sessionStorage.removeItem(userKey);
                    const redirect401 = localStorage.getItem('redirect401');//重定向地址 字符串
                    sessionStorage.removeItem(userKey);
                    if (redirect401) {
                        // window.document.location
                        window.location.href = redirect401
                    } else if (user && user.domain) {
                        window.document.location.replace(`/${user.domain}/signin`)
                    } else {
                        window.document.location.replace('/signin');
                    }
                    reject('unauth');
                } else {
                    reject(err);
                }
            } else {
                resolve(res.body);
            }
        };

const requestMap = {
    get: (url, query, root, header, userKey) => new Promise((resolve, reject) => {
        request.get(buildUrl(url, root, userKey)).set(header || setHeader(userKey)).query(query).use(noCache).end(resultHandler(resolve, reject, userKey));
    }),
    post: (url, data, query, root, header, userKey) => new Promise((resolve, reject) => {
        request.post(buildUrl(url, root, userKey)).set(header || setHeader(userKey)).query(query).use(noCache).send(data).end(resultHandler(resolve, reject, userKey));
    }),
    put: (url, data, query, root, header, userKey) => new Promise((resolve, reject) => {
        request.put(buildUrl(url, root, userKey)).set(header || setHeader(userKey)).send(data).query(query).use(noCache).end(resultHandler(resolve, reject, userKey));
    }),
    delete: (url, query, root, header, userKey) => new Promise((resolve, reject) => {
        request.delete(buildUrl(url, root, userKey)).set(header || setHeader(userKey)).query(query).use(noCache).end(resultHandler(resolve, reject, userKey));
    })
}

export class Request {
    static get = (url, query, root = null, header = null, userKey = null) => requestMap.get(url, query, root, header, userKey);
    static post = (url, data, query, root = null, header = null, userKey = null) => requestMap.post(url, data, query, root, header, userKey)
    static put = (url, data, query, root = null, header = null, userKey = null) => requestMap.put(url, data, query, root, header, userKey)
    static delete = (url, query, root = null, header = null, userKey = null) => requestMap.delete(url, query, root, header, userKey)
}

export class ProxyRequest {
    constructor(rootUrl, userKey) {
        this.root = rootUrl;
        this.userKey = userKey
    }

    get = (url, query) => requestMap.get(url, query, this.root, null, this.userKey);
    post = (url, data, query) => requestMap.post(url, data, query, this.root, null, this.userKey);
    put = (url, data, query) => requestMap.put(url, data, query, this.root, null, this.userKey);
    delete = (url, query) => requestMap.delete(url, query, this.root, null, this.userKey);
}

export class RouteRequest {
    constructor({ userKey = 'user' } = {}) {
        this.userKey = userKey;
    }

    static get = url => new Promise((resolve, reject) => {
        request.get(buildRoute(url, this.userKey)).set(setHeader(this.userKey)).end(resultHandler(resolve, reject, this.userKey));
    });

    static post = (url, data, query) => new Promise((resolve, reject) => {
        request.post(buildRoute(url, this.userKey)).set(setHeader(this.userKey)).query(query).send(data).end(resultHandler(resolve, reject, this.userKey));
    });

    static delete = (url, data, query) => new Promise((resolve, reject) => {
        request.delete(buildRoute(url, this.userKey)).set(setHeader(this.userKey)).query(query).send(data).end(resultHandler(resolve, reject, this.userKey));
    });
}

export class customWebUtils {
    constructor({ userKey = 'user' } = {}) {
        this.userKey = userKey;
    }

    basicAction = (params = {}) => {
        return basicAction(Object.assign(params, { userKey: this.userKey }));
    };

    RouteRequest = () => new RouteRequest({ userKey: this.userKey });
}