import { IControlItemParams } from '../ts/interface/IDeviceProtocol';
import { TWifiLightColor, TWifiLightWhite, TZigbeeLightBr } from '../ts/type/TControlType';
export declare function commonWifiBrightness(controlItem: IControlItemParams): any;
export declare function commonWifiColorTemperature(controlItem: IControlItemParams): TWifiLightWhite;
export declare function commonWifiColor(controlItem: IControlItemParams): TWifiLightColor;
export declare function commonZigbeeBrightness(controlItem: IControlItemParams): TZigbeeLightBr;
export declare function commonZigbeeColorTemperature(controlItem: IControlItemParams): {
    switch: string;
    colorTemp: number;
};
export declare function commonZigbeeColor(controlItem: IControlItemParams): {
    switch: string;
    hue: number | undefined;
    saturation: number;
};
export declare function commonZigbeeColorMode(controlItem: IControlItemParams): {
    switch: string;
};
