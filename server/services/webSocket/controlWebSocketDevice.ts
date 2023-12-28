import logger from '../../log';
import { IReqData } from '../../ts/interface/IReqData';
import { Request } from 'express';
import { decode } from 'js-base64';
import deviceDataUtil from '../../utils/deviceDataUtil';
import wsService from './wsService';

//控制websocket设备 (Control device)
export default async function controlWebSocketDevice(req: Request) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;

    try {
        const iHostState = payload.state;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, selfApikey, uiid } = iHostDeviceData;

        if (!uiid) {
            logger.error('control device can not get uiid------------------------', uiid);
            return;
        }

        const lanStateString = deviceDataUtil.iHostStateToLanState(deviceId, iHostState);

        if (!lanStateString) {
            throw new Error('null');
        }

        const lanState = JSON.parse(lanStateString);

        const params = { deviceid: deviceId, ownerApikey: selfApikey, params: lanState };

        logger.info('params----------------', params);

        const res = await wsService.updateByWs(params);
        logger.info('ws----------------res', res);
        if (res.error === 0) {
            deviceDataUtil.updateEWeLinkDeviceData(deviceId, 'params', lanState);
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
                version: '1',
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
                version: '1',
            },
            payload: {
                type: 'ENDPOINT_UNREACHABLE',
            },
        },
    };
}
