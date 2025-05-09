import { IReqData } from '../../../ts/interface/IReqData';
import { Request } from 'express';
import logger from '../../../log';
import updateLanDeviceData from '../../public/updateLanDeviceData';
import { decode } from 'js-base64';
import mDnsDataParse from '../../../utils/mDnsDataParse';
import dayjs from 'dayjs';
import _ from 'lodash';
import electricityDataUtil from '../../../utils/electricityDataUtil';
import IElectricityData from '../../../ts/interface/IElectricityData';
import deviceDataUtil from '../../../utils/deviceDataUtil';
import wsService from '../../webSocket/wsService';

// 获取电量历史数据 ()
export default async function getKwsDataByWan(req: Request) {
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

        const splitNum = useSplitNum(deviceId);
        const isNewSplitWay = splitNum === 4

        const dataLength = end - start;
        if (electricityDataUtil.hasCacheData(deviceId, startTime, endTime, dataLength, isNewSplitWay)) {
            const electricityHistoryData = electricityDataUtil.getElectricityData(deviceId, startTime, endTime, isNewSplitWay);
            if (electricityHistoryData.length > 0) {
                return responseFunction(message_id, electricityHistoryData);
            }
        }


        const params = {
            deviceid: deviceId, ownerApikey: selfApikey, params: {
                getHoursKwh: {
                    start,
                    end,
                },
            }
        };

        const res = (await wsService.updateByWs(params)) as unknown as { error: number; config: { hoursKwhData: string } };
        if (!res || !res.config) {
            throw new Error();
        }

        const timeRange = {
            startTime,
            endTime,
        };

        const electricityIntervals = generateFinalData(res.config.hoursKwhData, timeRange, deviceId, splitNum);

        electricityDataUtil.updateElectricityData(deviceId, electricityIntervals, isNewSplitWay);


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
};

interface ITimeRange {
    /** 开始时间 (Starting time) */
    startTime: string;
    /** 结束时间 (End Time) */
    endTime: string;
}

/** 根据3位字符获取功耗值 (Get the power consumption value based on 3-digit characters)*/
const getPowerConsumptionByStr = (str: string, splitNum: number) => {
    const intVal = parseInt(`0x${str.slice(0, splitNum - 2)}`);
    return parseFloat(`${intVal}.${str.slice(-2)}`);
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

function generateFinalData(usageData: string, timeRange: ITimeRange, deviceId: string, splitNum: number): IElectricityData[] {
    const { startTime, endTime } = timeRange;
    const finalData: IElectricityData[] = [];

    const data = chunkString(usageData, splitNum).map((str) => getPowerConsumptionByStr(str, splitNum));

    const hoursBetween = dayjs(endTime).diff(dayjs(startTime), 'hour') + 1;

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
/**
 * 选择每几位拆分字符串（Select every few digits to split the string）
 * 1、未登录，保持 3 位解析，已经登录，根据denyFeatures（1. Not logged in, keep 3-digit resolution, logged in, according to denyFeatures）
 */

function useSplitNum(deviceId: string) {
    //登录状态下，根据功能可配置字段判断(In logged-in state, judge based on function configurable fields)
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    if (eWeLinkDeviceData) {
        const denyFeatures = _.get(eWeLinkDeviceData, ['itemData', 'denyFeatures'], []);
        if (denyFeatures.includes('formateKwhDataByFourChars')) {
            return 3;
        } else {
            return 4;
        }
    }

    return 3;
}
