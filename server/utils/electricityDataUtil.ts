import _ from 'lodash';
import db from './db';
import IElectricityData from '../ts/interface/IElectricityData';
import dayjs from 'dayjs';

/** 更新设备电量历史记录 (Update device battery history)*/
const updateElectricityData = (deviceId: string, electricityList: IElectricityData[]) => {
    const electricityData = db.getDbValue('electricityData');
    if (!electricityData[deviceId]) {
        electricityData[deviceId] = [];
    }

    electricityData[deviceId] = [...electricityData[deviceId], ...electricityList];

    electricityData[deviceId] = _.uniqBy(electricityData[deviceId], 'start');

    //降序排序 (Sort descending)
    electricityData[deviceId].sort((a, b) => dayjs(b.start).valueOf() - dayjs(a.start).valueOf());

    //只保留5000条数据，防止文件太大 (Only 5,000 pieces of data are retained to prevent the file from becoming too large.)
    electricityData[deviceId] = _.take(electricityData[deviceId], 5000);

    db.setDbValue('electricityData', electricityData);
};

/** 获取该设备的电量历史记录 (Get the battery history of this device)*/
const getElectricityData = (deviceId: string, start: string, end: string) => {
    const electricityData = db.getDbValue('electricityData');

    if (electricityData && _.get(electricityData, [deviceId])) {
        const electricityList = electricityData[deviceId];

        const startIndex = _.findIndex(electricityList, (item) => item.start.substring(0, 19) === start.substring(0, 19));

        const endIndex = _.findIndex(electricityList, (item) => item.end.substring(0, 19) === end.substring(0, 19));

        return _.get(electricityData, deviceId).slice(endIndex, startIndex + 2);
    } else {
        return [];
    }
};

/** 确认是否有缓存 (Check if there is cache)*/
const hasCacheData = (deviceId: string, start: string, end: string, dataLength: number) => {
    const electricityData = db.getDbValue('electricityData');
    if (!electricityData[deviceId]) return false;
    const electricityList = electricityData[deviceId];

    const startIndex = _.findIndex(electricityList, (item) => item.start.substring(0, 19) === start.substring(0, 19));

    const endIndex = _.findIndex(electricityList, (item) => item.end.substring(0, 19) === end.substring(0, 19));

    if (startIndex < 0 || endIndex < 0) {
        return false;
    }

    if (startIndex - endIndex + 2 < dataLength) {
        return false;
    }

    return true;
};

/** 清空该设备电量数据缓存 (Clear the device's power data cache)*/
const clearDeviceCache = (deviceId: string) => {
    const electricityData = db.getDbValue('electricityData');
    const deviceElectricList = _.get(electricityData, deviceId, null);
    if (deviceElectricList) {
        electricityData[deviceId] = [];
    }
    db.setDbValue('electricityData', electricityData);
};

export default {
    updateElectricityData,
    getElectricityData,
    hasCacheData,
    clearDeviceCache,
};
