import axios, { type AxiosRequestConfig } from 'axios';
import api from './index';
import EReqMethod from './ts/enum/EReqMethod';
import type IResponse from './ts/class/CResponse';
import { apiUrl, appSecret, appId, env } from '@/config';
import { useEtcStore } from '@/store/etc';
import cryptoJS from 'crypto-js';
import _ from 'lodash';
import i18n from '@/i18n';
import { message } from 'ant-design-vue';
import EEnv from '@/ts/enum/EEnv';

function getAuthSign(params: any) {
    let sign = '';
    let str = '';

    try {
        Object.keys(params)
            .sort()
            .forEach((key) => {
                const value = _.get(params, key);
                str += `${key}${typeof value === 'object' ? JSON.stringify(value) : value}`;
            });
        // console.log('str => ', str);
        // console.log('secret => ', appSecret);
        sign = cryptoJS
            .MD5(`${appSecret}${encodeURIComponent(str)}${appSecret}`)
            .toString()
            .toUpperCase();
    } catch (err) {
        console.log('got error here', err);
    }

    return sign;
}

// 初始化axios设置 (Initialize axios settings)
axios.defaults.baseURL = env === EEnv.PROD ? '/api/v1' : apiUrl;
axios.defaults.timeout = 15000;

//生成随机数 (Generate random numbers)
const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

export function createNoce() {
    let result = '';
    for (let i = 0; i < 8; i++) {
        let num = Math.ceil(Math.random() * (chars.length - 1));
        result += chars[num];
    }
    return result;
}

export function createCommonHeader(type: EReqMethod, params: object, at: string | null) {
    //登陆后 使用Bearer,登录前 使用Sign 当前只有post,没有get,get的处理方式不一样
    //After logging in, use Bearer, before logging in, use Sign. Currently there is only post, no get, and get is handled differently.
    // const auth = at ? `Bearer ${at}` : `Sign ` + getAuthSign(params);
    // const auth = at ? `Bearer ${at}` : '';
    const data: any = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        sign: `Sign ${getAuthSign(params)}`,
    };
    if (at) data.Authorization = `Bearer ${at}`;
    return data;
}

export function beforeLoginRequest<T>(url: string, params: object, methodType: EReqMethod) {
    return _httpGetPOSTPutDeleteRequest<T>(url, params, methodType);
}

export function afterLoginRequest<T>(url: string, params: object, methodType: EReqMethod) {
    const at = api.getAt();

    if (!at) {
        // console.warn(`调用此接口(${url})，必须先登录才能获取完整数据!`);
        console.warn(`To call this interface (${url}), you must log in to obtain complete data!`);
    }
    return _httpGetPOSTPutDeleteRequest<T>(url, params, methodType, at);
}

async function _httpGetPOSTPutDeleteRequest<T>(url: string, params: object, methodType: EReqMethod, at: string | null = null) {
    const axiosConfig = {
        url,
        method: methodType,
        params,
    } as AxiosRequestConfig;

    const ts = Date.now();
    if (methodType === 'GET') {
        axiosConfig.params.appid = appId;
        axiosConfig.params.ts = ts;
    } else {
        axiosConfig.params = Object.assign(axiosConfig.params, { ts, appid: appId });
    }

    let headers = createCommonHeader(methodType, params, at);
    axiosConfig.headers = headers;

    if (methodType === EReqMethod.POST || methodType === EReqMethod.PUT || methodType === EReqMethod.DELETE) {
        delete axiosConfig.params;
        axiosConfig['data'] = params;
    }

    // console.log('http request params', axiosConfig);

    try {

        let result = await axios(axiosConfig);
        if (result.data.error === 401) {
            const etcStore = useEtcStore();
            message.error(i18n.global.t('AT_OVERDUE'));
            if (axiosConfig.url === '/user' && axiosConfig.method === 'PUT') {
                return result ? (result.data as IResponse<T>) : ({} as IResponse<T>);
            }
            etcStore.atPastDue();
        }
        // if (result.data.error === 500) {
        //     message.error(i18n.global.t('ERROR_500'))
        // }
        // const { data, status } = result;
        // console.log(`http请求结束 url:${url}`, `method:${methodType}`, 'params:', params);
        // console.log(`http request end url:${url}`, `method:${methodType}`, 'params:', params);
        return result ? (result.data as IResponse<T>) : ({} as IResponse<T>);
    } catch (error) {
        console.log('error => ', error);
        const etcStore = useEtcStore();
        console.log('JSON.stringify(error)', JSON.stringify(error));

        // console.log(" typeof error => ", typeof error);
        if (JSON.stringify(error).includes('timeout')) {
            if ((axiosConfig.url?.includes('/sync') && axiosConfig.method === 'POST') || (axiosConfig.url?.includes('/device') && axiosConfig.method === 'DELETE')) {
                message.error(i18n.global.t('TIMEOUT'));
            }
        }

        // 报错中包含网络错误，即后端接口失效
        // The error report contains a network error, that is, the backend interface is invalid.
        if (JSON.stringify(error).includes('Network Error') || JSON.stringify(error).includes('code 502')) {
            console.log('Network Error');
            console.log('JSON.stringify(error)', JSON.stringify(error));
            // etcStore.setIsLoading(true)
            // window.location.reload();
        } else {
            // etcStore.setIsLoading(false)
        }

        return {} as IResponse<T>;
    }
}
