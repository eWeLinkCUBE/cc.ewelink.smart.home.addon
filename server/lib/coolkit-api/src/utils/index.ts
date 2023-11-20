import CryptoJS from 'crypto-js';
import axios, { AxiosRequestConfig } from 'axios';

import { ReqMethod, ApiResponse } from '../api';
import { getAppId, getAppSecret, getDomain, setDomain, getDebug, getUseTestEnv, getTimeout } from '../store';
import { regionMap } from './regionMap';

/**
 * 获取一个随机字符串
 * @returns nonce str
 */
function getNonce() {
    const chars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
    ];
    let nonce = '';
    for (let i = 0; i < 8; i++)
        nonce += chars[Math.ceil(Math.random() * (chars.length - 1))];
    return nonce;
}

/**
 * 计算 Authorization 的 Sign
 * @param method 请求方法
 * @param params 请求参数
 */
function getAuthSign(method: ReqMethod, params: any): string {
    let str = '';
    let sign = '';

    if (method === 'GET') {
        const paramList: string[] = [];
        Object.keys(params)
            .sort()
            .forEach((key) => {
                paramList.push(`${key}=${params[key]}`);
            });
        str = paramList.join('&');
    } else {
        str = JSON.stringify(params);
    }

    // output for debug
    if (getDebug()) {
        console.log(`authorization sign:\n${str}\n\n`);
    }

    // sign = crypto.createHmac('sha256', getAppSecret()).update(str).digest('base64');
    let tmp = CryptoJS.HmacSHA256(str, getAppSecret());
    sign = CryptoJS.enc.Base64.stringify(tmp);

    return sign;
}

/**
 * 获取 CMS 内容
 * @param params 请求参数
 */
export async function getCmsContent(params: {
    type: string;
    project: string;
    region: string;
    locale: string;
    category?: string[];
    modelName?: string;
    fwVersion?: string;
}): Promise<ApiResponse> {
    const { project, region, locale, type, category, modelName, fwVersion } = params;
    let url = `https://appcms${getUseTestEnv() ? '-test' : ''}.coolkit.cn/appcms-service/v2/${type}.json?project=${project}&region=${region}&locale=${locale}`;

    if (category) {
        url += `&category=${JSON.stringify(params.category).replace(/"/g, '%22')}`;
    }

    if (modelName) {
        url += `&modelName=${modelName}`;
    }

    if (fwVersion) {
        url += `&fwVersion=${fwVersion}`;
    }

    try {
        const res = await axios.get(url);
        return {
            data: res.data.data,
            error: res.data.err,
            msg: res.data.msg
        };
    } catch (err) {
        console.log(err);
        return {
            error: 500,
            msg: 'axios error',
            data: {}
        };
    }
}

/**
 * 发送请求
 * @param url API 的 URL
 * @param method 请求方法
 * @param params 请求参数
 * @param at Access Token
 */
export async function sendRequest(url: string, method: ReqMethod, params: any, at?: string): Promise<ApiResponse> {
    const config: AxiosRequestConfig = {
        url,
        method,
        baseURL: getDomain(),
        headers: {},
        timeout: getTimeout()
    };

    // 设置 headers
    config.headers['X-CK-Nonce'] = getNonce();
    config.headers['X-CK-Appid'] = getAppId();
    if (at) {
        config.headers['Authorization'] = `Bearer ${at}`;
    } else {
        config.headers['Authorization'] = `Sign ${getAuthSign(method, params)}`;
    }
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        config.headers['Content-Type'] = 'application/json';
    }

    // 设置参数
    if (method === 'GET' && params) {
        config.params = params;
    } else if (params) {
        config.data = params;
    }

    // output for debug
    if (getDebug()) {
        console.log(`axios config:\n${JSON.stringify(config, null, 4)}\n\n`);
    }

    try {
        const res = await axios(config);
        // output for debug
        if (getDebug()) {
            console.log(`axios response:\n${JSON.stringify(res.data, null, 4)}\n\n`);
        }
        // redir
        if (res.data.error === 10004) {
            setDomain(getDomainByRegion(res.data.data.region));
            return await sendRequest(url, method, params, at);
        }
        return res.data as ApiResponse;
    } catch (e) {
        console.log(e);
        return {
            error: 500,
            msg: 'axios error',
            data: {},
        };
    }
}

/**
 * 根据国家码获取 URL
 * @param code 国家码
 */
export function getDomainByCountryCode(code: string): string {
    const useTestEnv = getUseTestEnv();
    if (useTestEnv) {
        return getDomainByRegion('test');
    }

    const ret = regionMap.filter((item) => item.countryCode === code);

    if (ret.length === 0) {
        return '';
    } else {
        return getDomainByRegion(ret[0].region);
    }
}

/**
 * 根据区域获取 URL
 * @param region 区域
 */
export function getDomainByRegion(region: string): string {
    let result = '';

    switch (region) {
        case 'cn':
            result = 'https://cn-apia.coolkit.cn';
            break;
        case 'as':
            result = 'https://as-apia.coolkit.cc';
            break;
        case 'us':
            result = 'https://us-apia.coolkit.cc';
            break;
        case 'eu':
            result = 'https://eu-apia.coolkit.cc';
            break;
        case 'test':
            result = 'https://test-apia.coolkit.cn';
            break;
        default:
            result = '';
            break;
    }

    return result;
}
