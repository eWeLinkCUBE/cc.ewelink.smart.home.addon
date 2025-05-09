/* eslint-disable @typescript-eslint/no-var-requires */
import { Request } from 'express';
import { decode } from 'js-base64';
import _ from 'lodash';
import deviceDataUtil from '../../../utils/deviceDataUtil';
import { controlDevice, initDeviceList } from '../../../lib/coolkit-device-protocol/lib';
import wsService from '../../webSocket/wsService';
import logger from '../../../log';
import { IReqData } from '../../../ts/interface/IReqData';


// 获取电量历史数据 (Get power history data)
export default async function getDayKwsData(req: Request) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;
    try {
        const iHostState = payload.state;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, selfApikey } = iHostDeviceData;

        const rlSummarize = _.get(iHostState, ['power-consumption', 'powerConsumption', 'rlSummarize'], null);
        const startTime = _.get(iHostState, ['power-consumption', 'powerConsumption', 'timeRange', 'start'], '');
        const endTime = _.get(iHostState, ['power-consumption', 'powerConsumption', 'timeRange', 'end'], '');

        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
        if (!eWeLinkDeviceData) {
            throw new Error('no eWeLinkDeviceData');
        }
        const { devices } = initDeviceList([eWeLinkDeviceData] as any);
        const device = devices[0];

        if (!device) {
            logger.info('no device', devices);
            return {};
        }
        let proxy;

        if (rlSummarize === true) {
            proxy = controlDevice(device, 'statisticsPower', {
                oneKwh: 'start',
                startTime,
            });
        } else {
            proxy = controlDevice(device, 'statisticsPower', {
                oneKwh: 'end',
                startTime,
                endTime,
            });
        }

        logger.info('proxy--------------------------------', proxy);
        const params = { deviceid: deviceId, ownerApikey: selfApikey, params: proxy };
        const res = await wsService.updateByWs(params);

        logger.info('res--------------------------rlSummarize', rlSummarize, res);
        if (res.error === 0) {
            deviceDataUtil.updateEWeLinkDeviceData(deviceId, 'params', proxy);
            return createSuccessRes(message_id);
        }

        createFailRes(message_id);
    } catch (error: any) {
        logger.info('get websocket dayKws error---------------------', error);
        return createFailRes(message_id);
    }
}

function createSuccessRes(message_id: string) {
    return {
        event: {
            header: {
                name: 'Response',
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
