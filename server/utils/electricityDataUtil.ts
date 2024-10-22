import _ from 'lodash';
import db from './db';
import IElectricityData from '../ts/interface/IElectricityData';
import dayjs from 'dayjs';


/** 更新设备电量历史记录 (Update device battery history)*/
const updateElectricityData = (deviceId: string, electricityList: IElectricityData[], isNewSplitWay: boolean) => {
    const electricityData = db.getDbValue('electricityData');
    let symbolString = deviceId;
    if (isNewSplitWay) {
        symbolString = `${deviceId}_newSplitWay`;
    }

    if (!electricityData[symbolString]) {
        electricityData[symbolString] = [];
    }

    electricityData[symbolString] = [...electricityData[symbolString], ...electricityList];

    electricityData[symbolString] = _.uniqBy(electricityData[symbolString], 'start');

    //降序排序 (Sort descending)
    electricityData[symbolString].sort((a, b) => dayjs(b.start).valueOf() - dayjs(a.start).valueOf());

    //只保留5000条数据，防止文件太大 (Only 5,000 pieces of data are retained to prevent the file from becoming too large.)
    electricityData[symbolString] = _.take(electricityData[symbolString], 5000);

    db.setDbValue('electricityData', electricityData);
};

/** 获取该设备的电量历史记录 (Get the battery history of this device)*/
const getElectricityData = (deviceId: string, start: string, end: string, isNewSplitWay: boolean) => {
    const electricityData = db.getDbValue('electricityData');
    let symbolString = deviceId;
    if (isNewSplitWay) {
        symbolString = `${deviceId}_newSplitWay`;
    }

    if (electricityData && _.get(electricityData, [symbolString])) {
        const electricityList = electricityData[symbolString];

        const startIndex = _.findIndex(electricityList, (item) => item.start.substring(0, 19) === start.substring(0, 19));

        const endIndex = _.findIndex(electricityList, (item) => item.end.substring(0, 19) === end.substring(0, 19));

        return _.get(electricityData, symbolString).slice(endIndex, startIndex + 2);
    } else {
        return [];
    }
};

/** 确认是否有缓存 (Check if there is cache)*/
const hasCacheData = (deviceId: string, start: string, end: string, dataLength: number, isNewSplitWay: boolean) => {
    const electricityData = db.getDbValue('electricityData');
    let symbolString = deviceId;
    if (isNewSplitWay) {
        symbolString = `${deviceId}_newSplitWay`;
    }


    if (!electricityData[symbolString]) return false;

    // 把旧的错误缓存数据清掉（Clear old error cache data）
    if (isNewSplitWay) {
        _clearOldDeviceCache(deviceId)
    }

    const electricityList = electricityData[symbolString];

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

    const symbolString = `${deviceId}_newSplitWay`;
    if (electricityData[deviceId]) {
        electricityData[deviceId] = [];
    }
    if (electricityData[symbolString]) {
        electricityData[symbolString] = [];
    }
    db.setDbValue('electricityData', electricityData);
};


/** 清除旧设备历史数据 (Clear old device history data)*/
const _clearOldDeviceCache = (deviceId: string) => {
    const electricityData = db.getDbValue('electricityData');
    if (electricityData[deviceId]) {
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
