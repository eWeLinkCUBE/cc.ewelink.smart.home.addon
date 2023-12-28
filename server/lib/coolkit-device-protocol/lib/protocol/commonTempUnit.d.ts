import { IControlItemParams } from '../ts/interface/IDeviceProtocol';
export declare function commonTempUnit(controlItem: IControlItemParams): {
    tempScale: string;
    tempUnit?: undefined;
} | {
    tempUnit: number;
    tempScale?: undefined;
};
