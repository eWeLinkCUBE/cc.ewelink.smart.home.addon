import logger from '../../log';
import { IReqData } from '../../ts/interface/IReqData';
import { Request } from 'express';
import { decode } from 'js-base64';
import deviceDataUtil from '../../utils/deviceDataUtil';
import wsService from './wsService';
import syncWebSocketDeviceStateToIHost from './syncWebSocketDeviceStateToIHost';
import EventEmitter from 'events';

const event = new EventEmitter();
event.setMaxListeners(0);

interface IRequestData {
    req: Request;
    id: string;
    lanState: any; // iHostState 经过转换后的 lanState
}

// 队列用来存储待发送的请求数据
const requestQueue: IRequestData[] = [];

// 是否正在处理请求的标志
let isProcessing = false;
// 将请求加入队列
function addToQueue(requestData: IRequestData): void {
    requestQueue.push(requestData);
    // 如果队列中只有一个请求，并且没有正在处理的请求，则开始处理队列
    if (requestQueue.length === 1 && !isProcessing) {
        processQueue();
    }
}

// 处理队列中的请求
async function processQueue() {
    isProcessing = true;
    while (requestQueue.length > 0) {
        try {
            const processData = requestQueue[0];
            const { req: requestData, lanState } = processData;
            const sendRes = await send(requestData, lanState);
            event.emit(processData.id, sendRes);
        } catch (error) {
            console.error('error:', error);
        } finally {
            // 移除已处理的请求
            requestQueue.shift();
        }
    }
    isProcessing = false;
}

function pending(id: string) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            resolve(createFailRes(''));
        }, 10000);

        event.once(id, (res) => {
            resolve(res);
            clearTimeout(timer);
            return;
        });
    });
}

//控制websocket设备 (Control device)
async function send(req: Request, lanStateString: any) {
    const reqData = req.body as IReqData;
    const { header, endpoint } = reqData.directive;
    const { message_id } = header;

    try {
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, selfApikey, uiid } = iHostDeviceData;

        if (!uiid) {
            logger.error('control device can not get uiid------------------------', uiid);
            return;
        }

        if (!lanStateString) {
            throw new Error('null');
        }

        const lanState = JSON.parse(lanStateString);

        const params = { deviceid: deviceId, ownerApikey: selfApikey, params: lanState };

        logger.info('params----------------', JSON.stringify(params, null, 2));

        const res = await wsService.updateByWs(params);
        logger.info('ws----------------res', res);
        if (res.error === 0) {
            deviceDataUtil.updateEWeLinkDeviceData(deviceId, 'params', lanState);
            //控制成功后推送给iHost，维护操作日志（After the control is successful, push it to iHost and maintain the operation log.）
            syncWebSocketDeviceStateToIHost(deviceId, lanState);
            return createSuccessRes(message_id);
        }
        return createFailRes(message_id);
    } catch (error) {
        logger.error('control webSocket device error---', error);
        return createFailRes(message_id);
    }
}

function createSuccessRes(message_id: string) {
    return {
        event: {
            header: {
                name: 'UpdateDeviceStatesResponse',
                message_id,
                version: '2',
            },
            payload: {},
        },
    };
}

function createFailRes(message_id: string) {
    return {
        event: {
            header: {
                name: 'ErrorResponse',
                message_id,
                version: '2',
            },
            payload: {
                type: 'ENDPOINT_UNREACHABLE',
            },
        },
    };
}

export default async function controlWebSocketDevice(req: Request, lanState: any) {
    logger.info('control webSocket device----------------');
    const id = req.body.directive.header.message_id;
    addToQueue({ req, id, lanState });
    const res = await pending(id);
    return res;
}
