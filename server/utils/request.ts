import axios, { AxiosRequestConfig } from 'axios';
import EMethod from '../ts/enum/EMethod';
import db from '../utils/db';
import config from '../config';
import logger from '../log';
import _ from 'lodash';

export interface ApiResponse<T> {
    error: number;
    data?: T;
    message: string;
}

axios.defaults.timeout = 60000;

const iHostAxiosInstance = axios.create({
    baseURL: config.iHost.api, //基本请求路径(Basic request path)
    timeout: 60000, //超时设定 (Timeout setting)
});

// 请求拦截器，在请求发出之前添加 Authorization 请求头
// Request interceptor, adding the Authorization request header before the request is issued
iHostAxiosInstance.interceptors.request.use((request: any) => {
    // 白名单请求路径，不需要添加 Authorization 请求头
    // Whitelist request path, no need to add Authorization request header
    const whitelist = ['/bridge/access_token'];

    const at = db.getDbValue('iHostToken');

    const appid = _.get(request.headers, 'X-CK-Appid', '');

    const notEWeLinkApi = appid !== config.coolKit.appId;
    if (request.headers && whitelist.indexOf(request.url as string) < 0 && notEWeLinkApi) {
        request.headers['Authorization'] = at ? `Bearer ${at}` : '';
    }

    return request;
});

/**
 * 通用请求方法,带有error (General request method, with error)
 */
export async function request<RespData>(url: string, method: EMethod, params?: any) {
    const axiosConfig = {
        url,
        method,
        params,
        headers: {
            'Content-Type': 'application/json',
        },
    } as AxiosRequestConfig;

    if (method === EMethod.POST || method === EMethod.PUT || method === EMethod.DELETE) {
        delete axiosConfig.params;
        axiosConfig['data'] = params;
    }
    try {
        const res = await iHostAxiosInstance(axiosConfig);
        return res ? (res.data as ApiResponse<RespData>) : ({} as ApiResponse<RespData>);
    } catch (error) {
        logger.error('get iHost res error----', error);

        return {} as ApiResponse<RespData>;
    }
}

/**
 * 三方请求网关接口 (Third-party request gateway interface)
 */
export async function requestNoError<RespData>(url: string, method: EMethod, params?: any) {
    const axiosConfig = {
        url,
        method,
        params,
        headers: {
            'Content-Type': 'application/json',
        },
    } as AxiosRequestConfig;

    if (method === EMethod.POST || method === EMethod.PUT || method === EMethod.DELETE) {
        delete axiosConfig.params;
        axiosConfig['data'] = params;
    }

    try {
        const res = await iHostAxiosInstance(axiosConfig);
        return res ? (res.data as RespData) : ({} as RespData);
    } catch (error) {
        logger.error('get iHost device error ----', error);

        return {} as RespData;
    }
}
