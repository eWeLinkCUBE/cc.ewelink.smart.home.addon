import { IReqData } from '../../ts/interface/IReqData';
import { Request } from 'express';
import logger from '../../log';
import updateLanDeviceData from './updateLanDeviceData';
import { decode } from 'js-base64';
import mDnsDataParse from '../../utils/mDnsDataParse';
import dayjs from 'dayjs';
import _ from 'lodash';
import electricityDataUtil from '../../utils/electricityDataUtil';
import IElectricityData from '../../ts/interface/IElectricityData';

// 获取电量历史数据 ()
export default async function getKwsData(req: Request) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    try {
        const { message_id } = header;

        const iHostState = payload.state;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, devicekey, selfApikey } = iHostDeviceData;

        // const temp = {
        //     'power-consumption': {
        //         timeRange: {
        //             start: '2023-02-24T07:00:00.000Z', // 统计电量起始时间, date类型，必选。(Start time of power statistics, date type, required。)
        //             end: '2023-02-24T10:49:00.000Z', // 统计电量结束时间，date类型，必选。 (End time of power statistics, date type, required.)
        //         },
        //     },
        // };
        // iHostState = temp;

        const startTime = _.get(iHostState, ['power-consumption', 'timeRange', 'start'], '');
        const endTime = _.get(iHostState, ['power-consumption', 'timeRange', 'end'], '');

        const nowTime = dayjs().add(1, 'hour').startOf('hour').toISOString();

        //倒过来 (reverse)
        let end = dayjs(nowTime).diff(dayjs(startTime), 'hours'); //[0,  4535]
        let start = dayjs(nowTime).diff(dayjs(endTime), 'hours'); //[0,  4535]

        if (end < 0) {
            end = 0;
        }
        if (end > 4535) {
            end = 4535;
        }

        if (start < 0) {
            start = 0;
        }

        if (end > 4535) {
            end = 4535;
        }

        const dataLength = end - start;
        if (electricityDataUtil.hasCacheData(deviceId, startTime, endTime, dataLength)) {
            const electricityHistoryData = electricityDataUtil.getElectricityData(deviceId, startTime, endTime);

            if (electricityHistoryData.length > 0) {
                return responseFunction(message_id, electricityHistoryData);
            }
        }
        const kwhRes = await updateLanDeviceData.getHoursKwh(deviceId, devicekey, selfApikey, start, end);

        if (!kwhRes || !kwhRes.iv || !kwhRes.data) {
            throw new Error();
        }

        const hoursKwhDataObj = mDnsDataParse.decryptionData({ iv: mDnsDataParse.decryptionBase64(kwhRes.iv), key: devicekey, data: kwhRes.data });

        const timeRange = {
            startTime,
            endTime,
        };
        const electricityIntervals = generateFinalData(hoursKwhDataObj.hoursKwhData, timeRange);

        electricityDataUtil.updateElectricityData(deviceId, electricityIntervals);

        return responseFunction(message_id, electricityIntervals);
    } catch (error: any) {
        logger.info('get kwh error---------------------', error);
        return null;
    }
}

const responseFunction = (message_id: string, electricityIntervals: IElectricityData[]) => {
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
                        electricityIntervals,
                    },
                },
            },
        },
    };
};

interface ITimeRange {
    /** 开始时间 (Starting time) */
    startTime: string;
    /** 结束时间 (End Time) */
    endTime: string;
}

/** 根据3位字符获取功耗值 (Get the power consumption value based on 3-digit characters)*/
const getPowerConsumptionByStr = (str: string) => {
    const intVal = parseInt(`0x${str.slice(0, 1)}`);
    return parseFloat(`${intVal}.${str.slice(1)}`);
};

/** 将字符串 str 按 width 宽度分组 (Group string str by width)*/
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

    return result;
};

function generateFinalData(usageData: string, timeRange: ITimeRange): IElectricityData[] {
    const { startTime, endTime } = timeRange;
    const finalData: IElectricityData[] = [];
    const data = chunkString(usageData, 3).map((str) => getPowerConsumptionByStr(str));
    const hoursBetween = dayjs(endTime).diff(dayjs(startTime), 'hour') + 1;

    console.log('hours between => ', hoursBetween);

    for (let hour = 0; hour < hoursBetween; hour++) {
        const usage = data[hour];
        const end = dayjs(endTime).subtract(hour, 'hour').toISOString();
        const start = dayjs(end).subtract(1, 'hour').toISOString();
        if (usage === undefined) {
            continue;
        }
        finalData.push({ usage: Number((usage * 100).toFixed()), start, end });
    }

    return finalData;
}
