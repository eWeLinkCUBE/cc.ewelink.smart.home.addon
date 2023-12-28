import { IControlItemParams } from '../ts/interface/IDeviceProtocol';
import { TMultiCapability, TSingleSwitchCapalibity } from '../ts/type/TControlType';
export declare function commonSingleToggle(controlItem: IControlItemParams): TSingleSwitchCapalibity;
export declare function commonMultiToggle(controlItem: IControlItemParams): TMultiCapability;
