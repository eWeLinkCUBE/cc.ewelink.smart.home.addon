/* eslint-disable @typescript-eslint/no-var-requires */
import { Request } from 'express';
import { decode } from 'js-base64';
import _ from 'lodash';
import { IReqData } from '../../../ts/interface/IReqData';
import { controlDevice, initDeviceList } from '../../../lib/coolkit-device-protocol/lib';
import wsService from '../../webSocket/wsService';
import deviceDataUtil from '../../../utils/deviceDataUtil';
import logger from '../../../log';


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
export default async function getWebSocketDayKwsData(req: Request) {
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

        const start = _.get(iHostState, ['power-consumption', 'timeRange', 'start'], '');
        const end = _.get(iHostState, ['power-consumption', 'timeRange', 'end'], '');
        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
        const { devices } = initDeviceList([eWeLinkDeviceData] as any);
        const device = devices[0];

        if (!device) {
            logger.info('no device', devices);
            return null
        }

        const proxy = controlDevice(device, 'getHistoryPower');

        const params = { deviceid: deviceId, ownerApikey: selfApikey, params: proxy };
        const kwhRes = (await wsService.updateByWs(params)) as unknown as { error: number; config: { hundredDaysKwhData: string } };

        // logger.info('kwhRes--------------------------------', kwhRes);
        if (kwhRes.error !== 0 || !kwhRes.config.hundredDaysKwhData) {
            throw new Error('request error');
        }

        const { hundredDaysKwhData } = kwhRes.config;

        let electricityIntervals = changeKwhDataFormat(hundredDaysKwhData, start, end);

        // logger.info('electricityIntervals--------------------------------1', electricityIntervals);

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
                        'power-consumption': {
                            electricityIntervals,
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
    const chunkArr = chunkString(h186DaysKwhDataString, 6);

    logger.info('chunkArr----------------', chunkArr);

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
 * 根据6位字符获取功耗值
 *  Get the power consumption value based on 6-digit characters
 */
const getPowerConsumptionBySixStr = (str: string) => {
    const intVal = parseInt(`0x${str.slice(0, 2)}`);
    return parseFloat(`${intVal}.${parseInt(str.slice(2, 4))}${parseInt(str.slice(4))}`);
};
