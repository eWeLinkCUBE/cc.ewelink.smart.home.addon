import { IReqData } from '../../ts/interface/IReqData';
import { Request } from 'express';
import logger from '../../log';
import updateLanDeviceData from './updateLanDeviceData';
import { decode } from 'js-base64';
import mDnsDataParse from '../../utils/mDnsDataParse';

import _ from 'lodash';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// 获取电量历史数据 (Get power history data)
export default async function getDayKwsData(req: Request) {
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
        //             start: '2023-02-24T07:00:00.000Z', // 统计电量起始时间, date类型，必选。 (Start time of power statistics, date type, required)
        //             end: '2023-02-24T10:49:00.000Z', // 统计电量结束时间，date类型，必选。 (End time of power statistics, date type, required。)
        //         },
        //     },
        // };
        // iHostState = temp;

        const start = _.get(iHostState, ['power-consumption', 'timeRange', 'start'], '');
        const end = _.get(iHostState, ['power-consumption', 'timeRange', 'end'], '');

        const kwhRes = await updateLanDeviceData.get186DaysKwh(deviceId, devicekey, selfApikey);

        if (!kwhRes || !kwhRes.iv || !kwhRes.data) {
            throw new Error();
        }

        const hoursKwhDataObj = mDnsDataParse.decryptionData({ iv: mDnsDataParse.decryptionBase64(kwhRes.iv), key: devicekey, data: kwhRes.data });

        const { h186DaysKwhData } = hoursKwhDataObj.config;
        logger.info('get electric data origin------------------------', h186DaysKwhData);

        let electricityIntervals = changeKwhDataFormat(h186DaysKwhData, start, end);

        electricityIntervals = filterHistoryDataByTime(electricityIntervals, start, end);

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
    } catch (error: any) {
        logger.info('get dayKws eror---------------------', error);
        return null;
    }
}
interface IHistoryData {
    start: string;
    end: string;
    usage: number;
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

/** h186DaysKwhData ： String 类型，表示最近 186 天的历史用电量，单位位 KWH ，必选。其数据格式为：每一天的电量数据占 6 个字节，
 其中整数部分占 2 个字节且为十六进制形式，而小数部分占 4 个字节且为十进制（如 0101表示十进制下的11（即0.11），
0301表示十进制下的31（即0.31）），186 天的历史用电量数据总共占 1116 个字节 */

/** h186DaysKwhData ： String type, representing the historical electricity consumption in the last 186 days, in KWH, required. The data format is: each day's power data occupies 6 bytes,
 The integer part occupies 2 bytes and is in hexadecimal form, while the decimal part occupies 4 bytes and is in decimal form (For example, 0101 represents 11 in decimal system (that is, 0.11），
0301 represents 31 in decimal (i.e. 0.31)), and the historical power consumption data for 186 days occupies a total of 1116 bytes */

function changeKwhDataFormat(h186DaysKwhDataString: string, startTime: string, endTime: string) {
    const strArr = [];

    //6为要切割的每组的长度
    for (let i = 0; i < h186DaysKwhDataString.length; i += 6) {
        const oneDayKwhString = h186DaysKwhDataString.slice(i, i + 6);

        const intNum = parseInt(oneDayKwhString.slice(0, 2), 10);
        const decimal = extractNonZeroNumbers(oneDayKwhString.slice(2)) / 100;

        strArr.push(intNum + decimal);
    }

    logger.info('nowTime--------------------------------------------------------', endTime, dayjs().format('HH:mm:ss'));

    const h186DaysKwhDataArr = strArr.map((item, index) => {
        const end = dayjs(endTime).subtract(index, 'day').toISOString();

        logger.info('endTime--------------------------------------------------------', end);
        const start = dayjs(end).subtract(1, 'day').toISOString();

        return {
            usage: item,
            start,
            end,
        };
    });

    return h186DaysKwhDataArr.reverse();
}

// 取出后四位中非0的数字 (Remove the number that is not 0 in the last four digits)
function extractNonZeroNumbers(str: string): number {
    const regex = /[1-9]/g;
    const matches = str.match(regex);
    if (matches) {
        const str = matches.join('');
        return Number(str);
    } else {
        return 0;
    }
}
