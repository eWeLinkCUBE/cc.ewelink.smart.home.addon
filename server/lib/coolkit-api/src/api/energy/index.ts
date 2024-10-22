import { getAt } from '../../store';
import { sendRequest } from '../../utils';

enum EnergyHost {
    ENERGY_GROUP = '/v2/device/dem/group',
    GET_ENERGY_DEVICES = '/v2/device/dem/query-energy-devices',
    GET_ENERGY_DASHBOARD = '/v2/device/dem/query-energy'
}

export namespace CoolkitEnergy {
    /**
     * 能耗通用响应接口
     */
    export interface IDeviceEnergyResp<T> {
        error: number;
        msg: string;
        data: T;
    }
    interface IDeviceEnergy {
        devices?: {
            recordId: string;
            uiid: number;
        }[];
        alarm?: {
            switch?: boolean;
            weekVal?: number;
            monthVal?: number;
        };
    }
    /**
     * 创建设备能耗分组
     */
    export interface ICreateDeviceEnergyReq extends IDeviceEnergy {
        name: string;
        associatedDeviceid?: string;
    }
    /**
     * 更新设备能耗分组
     */
    export interface IUpdateDeviceEnergyReq extends IDeviceEnergy {
        id: string;
        name?: string;
    }
    /**
     *	查询指定分组设备能耗数据
     */
    export interface IEnergyDataReq {
        id?: string;
        total?: {
            weekDate?: string;
            monthDate?: string;
            energyDevice?: string;
        };
        summary?: {
            type?: 'm' | 'w' | 'r';
            date?: string;
            recently?: number;
        };
        compare?: {
            type?: 'm' | 'w';
            currentDate?: string;
            targetDate?: string;
            rankingSize?: number;
        };
    }
    /**
     * 查询设备能耗分组 响应
     */
    export interface IGetDeviceEnergyGroupResp extends IDeviceEnergy {
        id: string;
        name?: string;
    }
    /**
     * 创建设备能耗分组 响应
     */
    export interface ICreateDeviceEnergyGroupResp {
        id: string;
    }
    /**
     * 查询用户下所有能耗设备 响应
     */
    export interface IEnergyDevicesResp {
        familyId: string;
        familyName: string;
        devices: {
            recordId: string;
            deviceid: string;
            online: boolean;
            name: string;
            uiid: number;
        }[];
    }
    /**
     * 查询指定分组能耗数据
     */
    export interface IGetDeviceEnergyDataResp {
        total?: {
            week?: {
                totalPower: number;
            };
            month?: {
                totalPower: number;
            };
            energyDevice?: {
                count: number;
            };
        };
        summary?: {
            totalPower?: number;
            dayPower: number[];
        };
        compare?: {
            currentDate?: {
                totalPower?: number;
                dayPower?: number[];
                energyRanking?: {
                    deviceid: string;
                    name: string;
                    uiid: number;
                    familyName: string;
                    power: number;
                    outlet?: number;
                    outletName?: string;
                }[];
            };
            targetDate?: {
                totalPower?: number;
                dayPower: number[];
            };
        };
    }
}

export const energy = {
    /**
     * 查询设备能耗分组
     */
    async getDeviceEnergyGroup(params: { deviceid?: string }): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IGetDeviceEnergyGroupResp[]>> {
        return await sendRequest(EnergyHost.ENERGY_GROUP, 'GET', params, getAt());
    },
    /**
     * 删除设备能耗分组
     */
    async deleteDeviceEnergyGroup(params: { id: string }): Promise<CoolkitEnergy.IDeviceEnergyResp<any>> {
        return await sendRequest(`${EnergyHost.ENERGY_GROUP}?id=${params.id}`, 'DELETE', params, getAt());
    },
    /**
     * 创建设备能耗分组
     */
    async createDeviceEnergyGroup(params: CoolkitEnergy.ICreateDeviceEnergyReq): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.ICreateDeviceEnergyGroupResp>> {
        return await sendRequest(EnergyHost.ENERGY_GROUP, 'POST', params, getAt());
    },
    /**
     * 更新设备能耗分组
     */
    async updateDeviceEnergyGroup(params: CoolkitEnergy.IUpdateDeviceEnergyReq): Promise<CoolkitEnergy.IDeviceEnergyResp<any>> {
        return await sendRequest(EnergyHost.ENERGY_GROUP, 'PUT', params, getAt());
    },
    /**
     *	查询指定分组设备能耗数据
     */
    async getEnergyData(params: CoolkitEnergy.IEnergyDataReq): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IGetDeviceEnergyDataResp>> {
        return await sendRequest(EnergyHost.GET_ENERGY_DASHBOARD, 'POST', params, getAt());
    },
    /**
     * 查询用户下所有能耗设备
     */
    async getEnergyDevices(): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IEnergyDevicesResp[]>> {
        return await sendRequest(EnergyHost.GET_ENERGY_DEVICES, 'GET', null, getAt());
    }
};
