/* eslint-disable @typescript-eslint/no-var-requires */
import { IReqData } from '../../ts/interface/IReqData';
import { Request } from 'express';
import logger from '../../log';
import { decode } from 'js-base64';
import wsService from './wsService';
import { initDeviceList, controlDevice } from '../../lib/coolkit-device-protocol';
import _ from 'lodash';
import deviceDataUtil from '../../utils/deviceDataUtil';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// 获取电量历史数据 (Get power history data)
export default async function getWebSocketDayKwsData(req: Request) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;
    try {
        const iHostState = payload.state;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, selfApikey } = iHostDeviceData;

        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
        const { devices } = initDeviceList([eWeLinkDeviceData] as any);
        const device = devices[0];

        if (!device) {
            logger.info('no device', devices);
            return {};
        }

        const proxy = controlDevice(device, 'statisticsPower');

        const params = { deviceid: deviceId, ownerApikey: selfApikey, params: proxy };
        //本次用电量值的10进制字符串表示，精确到小数点后2位,单位是KW.H，取值范围为[0‐50000],如：110.32
        //The decimal string representation of this power consumption value, accurate to 2 decimal places, the unit is kw.h, the value range is [0-50000], such as: 110.32
        const res = (await wsService.updateByWs(params)) as unknown as { error: number; config: { oneKwhData: string } };

        if (res.error !== 0 || !res.config) {
            throw new Error('get rlSummarize error');
        }

        return {
            event: {
                header: {
                    name: 'Response',
                    message_id,
                    version: '1',
                },
                payload: {
                    state: {
                        'power-consumption': {
                            //单位 0.01kwh (Unit 0.01kwh)
                            rlSummarize: parseFloat((Number(res.config.oneKwhData) * 100).toFixed(2)),
                        },
                    },
                },
            },
        };
    } catch (error: any) {
        logger.info('get websocket dayKws error---------------------', error);
        return createFailRes(message_id);
    }
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
