/* eslint-disable @typescript-eslint/no-var-requires */
import { IReqData } from '../../../ts/interface/IReqData';
import { Request } from 'express';
import logger from '../../../log';
import { decode } from 'js-base64';
import { initDeviceList, controlDevice } from '../../../lib/coolkit-device-protocol';
import _ from 'lodash';
import deviceDataUtil from '../../../utils/deviceDataUtil';
import wsService from '../../webSocket/wsService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

interface IHistoryData {
    start: string;
    end: string;
    usage: number;
}

// 获取电量历史数据 (Get power history data)
export default async function getWebSocketDayKwsDataToggle(req: Request) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;
    try {
        const iHostState = payload.state;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, selfApikey } = iHostDeviceData;

        // const temp = {
        //     'power-consumption': {
        //         timeRange: {
        //             start: '2023-02-24T07:00:00.000Z', // 统计电量起始时间, date类型，必选。 (Start time of power statistics, date type, required)
        //             end: '2023-02-24T10:49:00.000Z', // 统计电量结束时间，date类型，必选。 (End time of power statistics, date type, required。)
        //         },
        //     },
        // };
        // const iHostState = temp;

        logger.info('getWebSocketDayKwsDataToggle----------');
        //通道索引（Channel index）
        const name = Object.keys(_.get(iHostState, ['toggle-power-consumption']))[0];

        const channelIndex = Number(name) - 1;

        const start = _.get(iHostState, ['toggle-power-consumption', name, 'timeRange', 'start'], '');
        const end = _.get(iHostState, ['toggle-power-consumption', name, 'timeRange', 'end'], '');
        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
        const { devices } = initDeviceList([eWeLinkDeviceData] as any);
        const device = devices[0];

        if (!device) {
            logger.info('no device', devices);
            throw new Error('request error');
        }

        const proxy = controlDevice(device, 'getHistoryPower', { outlet: channelIndex });

        const params = { deviceid: deviceId, ownerApikey: selfApikey, params: proxy };

        logger.info('params----------------', JSON.stringify(params, null, 2));

        const kwhRes = (await wsService.updateByWs(params)) as unknown as {
            error: number;
            config: { kwhHistories_00: string; kwhHistories_01: string; kwhHistories_02: string; kwhHistories_03: string };
        };

        logger.info('kwhRes---------------', kwhRes);

        type kwhString = 'kwhHistories_00' | 'kwhHistories_01' | 'kwhHistories_02' | 'kwhHistories_03';

        logger.info('kwhRes--------------------------------', kwhRes);

        const kwhHistoriesString = `kwhHistories_0${channelIndex}` as kwhString;

        const kwhHistories = _.get(kwhRes, ['config', kwhHistoriesString], null);

        if (kwhRes.error !== 0 || !kwhHistories) {
            throw new Error('request error');
        }

        let electricityIntervals = changeKwhDataFormat(kwhHistories, start, end);

        logger.info('electricityIntervals--------------------------------1', JSON.stringify(electricityIntervals, null, 2));

        electricityIntervals = filterHistoryDataByTime(electricityIntervals, start, end);

        // logger.info('electricityIntervals--------------------------------2', electricityIntervals);

        return {
            event: {
                header: {
                    name: 'Response',
                    message_id,
                    version: '2',
                },
                payload: {
                    state: {
                        'toggle-power-consumption': {
                            [name]: {
                                electricityIntervals,
                            },
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

// 截取某段时间的电量历史数据
// Intercept the power history data of a certain period of time
function filterHistoryDataByTime(historyDataList: IHistoryData[], start: string, end: string) {
    const startTime = dayjs(start).valueOf();
    const endTime = dayjs(end).valueOf();

    const newHistoryDataList = historyDataList.filter((item) => {
        return dayjs(item.start).valueOf() >= startTime && dayjs(item.end).valueOf() <= endTime;
    });
    return newHistoryDataList;
}

function changeKwhDataFormat(h186DaysKwhDataString: string, startTime: string, endTime: string) {
    const chunkArr = chunkString(h186DaysKwhDataString, 4);

    logger.info('chunkArr----------------', JSON.stringify(chunkArr, null, 2));

    const kwhDataArr = chunkArr.map((item, index) => {
        const end = dayjs(endTime).subtract(index, 'day').toISOString();

        const start = dayjs(end).subtract(1, 'day').toISOString();

        return {
            usage: Number((item * 100).toFixed()),
            start,
            end,
        };
    });

    return kwhDataArr.reverse();
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

/**
 * 将字符串 str 按 width 宽度分组，并转为十进制
 * Group the string str by width and convert it to decimal
 */
const chunkString = (str: string, width: number) => {
    const len = str.length;
    const result: string[] = [];
    let start = 0;
    let end = start + width;
    while (end <= len) {
        result.push(str.slice(start, end));
        start += width;
        end += width;
    }
    return result.map((v) => {
        const getPower = getPowerConsumptionBySixStr;
        return getPower ? getPower(v) : 0;
    });
};

/**
 * 根据4位字符获取功耗值
 *  Get the power consumption value based on 4-digit characters
 */
const getPowerConsumptionBySixStr = (str: string) => {
    const intVal = parseInt(`0x${str.slice(0, 2)}`);
    return Number(`${intVal}.${str.slice(2, 4)}`);
};
