import fs, { writeFileSync } from 'fs';
import _ from 'lodash';
import config from '../config';
import { encode, decode } from 'js-base64';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import IHostDevice from '../ts/interface/IHostDevice';
import logger from '../log';
import IElectricityData from '../ts/interface/IElectricityData';
import dbDataClass from '../ts/class/dbData';

type DbKey = keyof IDbData;

interface IEWeLinkApiInfo {
    at: string;
    rt: string;
    region: string;
    userInfo: {
        account: string;
        autoSyncStatus: boolean;
    };
}
interface IDbData {
    /** api v2 at相关信息  (api v2 at related information)*/
    eWeLinkApiInfo: null | IEWeLinkApiInfo;
    /** at更新时间 (At update time)*/
    atUpdateTime: number;
    /** 易微联设备列表 (eWeLink device list)*/
    eWeLinkDeviceList: IEWeLinkDevice[];
    /** iHost网关凭证  (iHost gateway credentials)*/
    iHostToken: string;
    /** iHost设备列表 (iHost device list)*/
    iHostDeviceList: IHostDevice[];
    /** 自动同步 (Automatic synchronization)*/
    autoSyncStatus: boolean;
    /** 是否第一次启动容器，用于提示前端清空localStorage里的旧登录数据 (Whether to start the container for the first time is used to prompt the front end to clear the old login data in local storage.)*/
    isFirstInit: boolean;
    /** 190电量历史记录，按设备id存储 (190 power history records, stored by device ID)*/
    electricityData: { [deviceId: string]: IElectricityData[] };
}

export const dbDataTmp: IDbData = {
    eWeLinkApiInfo: null,
    atUpdateTime: 0,
    eWeLinkDeviceList: [],
    iHostToken: '',
    iHostDeviceList: [],
    autoSyncStatus: false,
    isFirstInit: true,
    electricityData: {},
};

/** 获取数据库文件所在路径 (Get the path to the database file) */
function getDbPath() {
    return config.nodeApp.dbPath;
}

/** 获取所有数据 (Get all data)*/
function getDb() {
    try {
        if (!dbDataClass.dbDataMap.has('data')) {
            logger.info('has read file ----------------');
            const file = fs.readFileSync(getDbPath(), 'utf-8');
            dbDataClass.dbDataMap.set('data', JSON.parse(decode(file)));
        }
        const data = dbDataClass.dbDataMap.get('data');

        return data as IDbData;
    } catch (error) {
        logger.error('get db file---------------', 'error-----', error, 'data--------');
        // 断电导致文件异常，重新初始化文件 (File abnormality caused by power outage, re-initialize the file)
        fs.writeFileSync(getDbPath(), encode(JSON.stringify(dbDataTmp)), 'utf-8');
        logger.info('init db file------success');
        return null as unknown as IDbData;
    }
}

/** 清除所有数据 (Clear all data)*/
function clearStore() {
    fs.writeFileSync(getDbPath(), encode('{}'), 'utf-8');
}

/** 设置指定的数据库数据 (Set specified database data)*/
function setDbValue(key: 'eWeLinkApiInfo', v: IDbData['eWeLinkApiInfo']): void;
function setDbValue(key: 'atUpdateTime', v: IDbData['atUpdateTime']): void;
function setDbValue(key: 'eWeLinkDeviceList', v: IDbData['eWeLinkDeviceList']): void;
function setDbValue(key: 'iHostToken', v: IDbData['iHostToken']): void;
function setDbValue(key: 'iHostDeviceList', v: IDbData['iHostDeviceList']): void;
function setDbValue(key: 'autoSyncStatus', v: IDbData['autoSyncStatus']): void;
function setDbValue(key: 'isFirstInit', v: IDbData['isFirstInit']): void;
function setDbValue(key: 'electricityData', v: IDbData['electricityData']): void;
function setDbValue(key: DbKey, v: IDbData[DbKey]) {
    try {
        const data = getDb();
        _.set(data, key, v);
        dbDataClass.dbDataMap.set('data', data);
        writeFileSync(getDbPath(), encode(JSON.stringify(data)), 'utf-8');
    } catch (error) {
        const data = getDb();
        logger.error('set db file---------------', 'error-----', error, data);
    }
}

/** 获取指定的数据库数据 (Get specified database data) */
function getDbValue(key: 'eWeLinkApiInfo'): IDbData['eWeLinkApiInfo'];
function getDbValue(key: 'atUpdateTime'): IDbData['atUpdateTime'];
function getDbValue(key: 'eWeLinkDeviceList'): IDbData['eWeLinkDeviceList'];
function getDbValue(key: 'iHostDeviceList'): IDbData['iHostDeviceList'];
function getDbValue(key: 'iHostToken'): IDbData['iHostToken'];
function getDbValue(key: 'autoSyncStatus'): IDbData['autoSyncStatus'];
function getDbValue(key: 'isFirstInit'): IDbData['isFirstInit'];
function getDbValue(key: 'electricityData'): IDbData['electricityData'];
function getDbValue(key: DbKey) {
    const data = getDb();
    try {
        return data[key];
    } catch (error) {
        logger.info('error-------------db', error);
        return '';
    }
}

export default {
    getDb,
    clearStore,
    setDbValue,
    getDbValue,
};
