import { IControlItemParams } from '../ts/interface/IDeviceProtocol';
export declare function commonSingleStartup(controlItem: IControlItemParams): {
    startup: string;
};
export declare function commonMultiStartup(controlItem: IControlItemParams): {
    configure: {
        startup: string;
        outlet: number;
        enableDelay?: number | undefined;
        width?: number | undefined;
    }[];
};
