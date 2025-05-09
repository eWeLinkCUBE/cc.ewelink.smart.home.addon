import { decode } from 'js-base64';
import _ from 'lodash';
import { Request } from 'express';
import EventEmitter from 'events';
import { IHostStateInterface } from '../../../../../ts/interface/IHostState';
import { IReqData } from '../../../../../ts/interface/IReqData';


const event = new EventEmitter();
event.setMaxListeners(0);

interface RequestCache {
    [deviceId: string]: {
        iHostStateObj: IHostStateInterface;
        timeoutId: any,
    }
}

const requestCache: RequestCache = {};

/** 
 * 多通道控制和灯能力控制时，将控制整合起来发送 (When controlling multi-channels and lamp capabilities, the controls are integrated and sent.)
 */
export default async function toCollectIHostState(req: Request): Promise<IHostStateInterface | null> {
    const reqData = req.body as IReqData;
    const { endpoint, payload } = reqData.directive;

    try {
        const iHostState = payload.state
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId } = iHostDeviceData;

        return await collectIHostState(iHostState, deviceId);
    } catch (error: any) {
        return null
    }
}

// 200ms内有新的请求过来，取消掉定时器（A new request comes within 200ms, cancel the timer）
async function collectIHostState(iHostState: IHostStateInterface, deviceId: string): Promise<IHostStateInterface | null> {

    if (!requestCache[deviceId]) {
        initRequestCache(deviceId)
    }
    _.merge(requestCache[deviceId].iHostStateObj, iHostState);
    return new Promise((resolve) => {

        if (requestCache[deviceId].timeoutId) {
            clearTimeout(requestCache[deviceId].timeoutId);
            event.emit('delivered', null);
        }
        event.once('delivered', (res) => { resolve(res); });
        requestCache[deviceId].timeoutId = setTimeout(() => {
            event.emit('delivered', requestCache[deviceId].iHostStateObj);
            initRequestCache(deviceId)
        }, 200);
    });
}

function initRequestCache(deviceId: string) {
    requestCache[deviceId] = {
        iHostStateObj: {},
        timeoutId: null,
    }
}