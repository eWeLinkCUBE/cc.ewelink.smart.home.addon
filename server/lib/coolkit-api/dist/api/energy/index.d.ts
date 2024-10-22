export declare namespace CoolkitEnergy {
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
    export interface ICreateDeviceEnergyReq extends IDeviceEnergy {
        name: string;
        associatedDeviceid?: string;
    }
    export interface IUpdateDeviceEnergyReq extends IDeviceEnergy {
        id: string;
        name?: string;
    }
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
    export interface IGetDeviceEnergyGroupResp extends IDeviceEnergy {
        id: string;
        name?: string;
    }
    export interface ICreateDeviceEnergyGroupResp {
        id: string;
    }
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
    export {};
}
export declare const energy: {
    getDeviceEnergyGroup(params: {
        deviceid?: string;
    }): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IGetDeviceEnergyGroupResp[]>>;
    deleteDeviceEnergyGroup(params: {
        id: string;
    }): Promise<CoolkitEnergy.IDeviceEnergyResp<any>>;
    createDeviceEnergyGroup(params: CoolkitEnergy.ICreateDeviceEnergyReq): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.ICreateDeviceEnergyGroupResp>>;
    updateDeviceEnergyGroup(params: CoolkitEnergy.IUpdateDeviceEnergyReq): Promise<CoolkitEnergy.IDeviceEnergyResp<any>>;
    getEnergyData(params: CoolkitEnergy.IEnergyDataReq): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IGetDeviceEnergyDataResp>>;
    getEnergyDevices(): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IEnergyDevicesResp[]>>;
};
