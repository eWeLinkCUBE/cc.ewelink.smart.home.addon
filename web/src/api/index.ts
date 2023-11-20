

import axios from 'axios';
import smartHome from './smartHome';
import { useEtcStore } from '@/store/etc';
import ErrorCodeHandle from '@/utils/ErrorCodeHandle';
import { emitter } from '@/utils/EventEmitter';

/**
 * 存在at时，必须先调用该方法 初始化at
 * When at exists, this method must be called first to initialize at
 * @param at
 */
function init(at: string) {
    const etc = useEtcStore();
    etc.setAt(at);
}

/**
 * Get at
 * @returns
 */
function getAt() {
    const etc = useEtcStore();
    return etc.at;
}

/**
 * 添加响应拦截器,用于抛出事件给前端异常处理,专门用来处理通用错误返回码.
 * Add a response interceptor to throw events to the front-end exception handling, specifically used to handle general error return codes.
 */
axios.interceptors.response.use((response): any => {
    // console.log('GavinLog ~ axios.interceptors.response.use ~ response', response);
    // console.log('response', response);

    if (response) {
        const {
            status,
            data,
            config: { url },
        } = response;

        const { error } = data;
        const skipCommonError = url && url.includes("initiate-with-offer");
        // console.log('url', url);
        // console.log('status', status);
        // console.log('error', error);

        if (url && status === 200 && error && error != 0 && error.toString().length === 3) {
            if (skipCommonError && error === 500) return response;
            // console.log(`通用错误事件触发 COMMON_ERROR_EVENT ${url}`);
            // console.log(`Generic error event trigger COMMON_ERROR_EVENT ${url}`);
            // console.log('data', data);
            // emitter.emit(`COMMON_ERROR_EVENT`, data);
            // return;
        }

        // 业务接口错误码统一消息提示
        // Business interface error code unified message prompt
        if (url && status === 200 && error && error != 0 && !skipCommonError) {
            ErrorCodeHandle(error);
        }
    }
    // 对响应数据做点什么
    // Do something with the response data
    return response;
});


let IS_SET_EVENT: boolean = false;
/**
 * Listen for events 监听事件
 * @param path interface path 接口路径
 * @param callback
 */
function setEventCallback(callback: EventListener) {
    if (!IS_SET_EVENT) {
        // console.log(`setEventCallback 开始监听通用错误处理`);
        // console.log(`setEventCallback Start listening for general error handling`);
        IS_SET_EVENT = true;
        emitter.on(`COMMON_ERROR_EVENT`, callback);
    } else {
        console.log(`通用错误监听已存在，禁止重复创建`);
    }
}

/**
 * 移除事件监听  (Remove event listener)
 * 注意:callback必须与setEventCallback形参中的callback为同一对象 (Note: callback must be the same object as the callback in the set event callback formal parameter)
 * @param callback
 */
function cleanEventCallback(callback: EventListener) {
    emitter.removeListener(`COMMON_ERROR_EVENT`, callback);
    IS_SET_EVENT = false;
}

export default {
    init,
    getAt,
    setEventCallback,
    cleanEventCallback,
    smartHome,
};
