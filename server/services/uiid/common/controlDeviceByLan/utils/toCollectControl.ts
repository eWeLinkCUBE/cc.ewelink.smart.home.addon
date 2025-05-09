import { decode } from 'js-base64';
import _ from 'lodash';
import { Request } from 'express';
import EventEmitter from 'events';
import { IHostStateInterface } from '../../../../../ts/interface/IHostState';
import { IReqData } from '../../../../../ts/interface/IReqData';
import IResData from '../../../../../ts/interface/IResData';

const event = new EventEmitter();
event.setMaxListeners(0);

interface RequestCache {
    [deviceId: string]: {
        iHostStateObj: IHostStateInterface;
        timeoutId: NodeJS.Timeout | null;
    };
}

const requestCache: RequestCache = {};

/**
 * 多通道控制和灯能力控制时，将控制整合起来发送 (When controlling multi-channels and lamp capabilities, the controls are integrated and sent.)
 */
export default async function toCollectControl(
    req: Request,
    updateLanDeviceStates: (req: Request, iHostState: IHostStateInterface) => Promise<IResData | null>
): Promise<IResData | null> {
    const reqData = req.body as IReqData;
    const { endpoint, payload } = reqData.directive;

    try {
        const iHostState = payload.state;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId } = iHostDeviceData;

        if (!requestCache[deviceId]) {
            initRequestCache(deviceId);
        }
        _.merge(requestCache[deviceId].iHostStateObj, iHostState);

        return new Promise((resolve) => {
            sendParams(resolve, req, updateLanDeviceStates, deviceId);
        });
    } catch (error: any) {
        return null;
    }
}

//等待请求，一起发送 （Wait for the request and send it together）
async function sendParams(resolve: any, req: Request, updateLanDeviceStates: (req: Request, iHostState: IHostStateInterface) => Promise<IResData | null>, deviceId: string) {
    const reqData = req.body as IReqData;
    const { header } = reqData.directive;
    const { message_id } = header;
    if (requestCache[deviceId].timeoutId) {
        clearTimeout(requestCache[deviceId].timeoutId!);
    }
    event.once('delivered', (res) => {
        const newRes = _.cloneDeep(res);
        newRes.event.header.message_id = message_id;
        resolve(newRes);
    });
    requestCache[deviceId].timeoutId = setTimeout(async () => {
        const sendRes = await updateLanDeviceStates(req, requestCache[deviceId].iHostStateObj);
        event.emit('delivered', sendRes);
        delete requestCache[deviceId];
    }, 200);
}

function initRequestCache(deviceId: string) {
    requestCache[deviceId] = {
        iHostStateObj: {},
        timeoutId: null,
    };
}
