import { IControlItemParams } from '../ts/interface/IDeviceProtocol';
export declare function commonSingleInching(controlItem: IControlItemParams): {
    pulse: string;
    pulseWidth: number;
};
export declare function commonMultiInching(controlItem: IControlItemParams, width?: number): {
    pulses: {
        pulse: string;
        width: number;
        outlet: number;
        switch?: string | undefined;
    }[];
};
