import BaseDeviceOperate from '../baseDeviceOperate';
import EUiid from '../../../ts/enum/EUiid';
import _ from 'lodash';
import { toIntNumber } from '../../../utils/tool';
import ECategory from '../../../ts/enum/ECategory';
import ECapability from '../../../ts/enum/ECapability';
import EPermission from '../../../ts/enum/EPermission';
import { ILanState154 } from '../../../ts/interface/ILanState';
import EDeviceControlMode from '../../../ts/enum/EDeviceControlMode';
import { getSensorState } from '../common/lanStateToIHostState/sensor';

/** 新版WIFI门磁（New version of wifi door sensor） */
export default class Uiid154 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_154;

    protected _controlMode = EDeviceControlMode.WAN;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.CONTACT, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
            {
                capability: ECapability.DETECT_HOLD,
                permission: EPermission.UPDATED,
            },
        ],
    };

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState154) {
        const iHostState = {};

        const switchState = _.get(lanState, 'switch', null);
        const type = _.get(lanState, 'type', null);

        if (switchState !== null) {
            _.merge(iHostState, getSensorState(this._iHostDeviceData, switchState === 'on', [ECapability.CONTACT, ECapability.CONTACT]));
        }

        if (switchState !== null && type !== null) {
            //type string | number
            //type 2 open
            //type 3 close
            //type 7 设备状态保持提醒 Device status reminder
            if (switchState === 'on' && type == 2) {
                _.merge(iHostState, getSensorState(this._iHostDeviceData, true, [ECapability.CONTACT, ECapability.CONTACT]));
                _.merge(iHostState, {
                    'detect-hold': {
                        detectHold: 'off',
                    },
                });
            }

            if (switchState === 'off' && type == 3) {
                _.merge(iHostState, getSensorState(this._iHostDeviceData, false, [ECapability.CONTACT, ECapability.CONTACT]));
            }

            if (type == 7) {
                _.merge(iHostState, {
                    'detect-hold': {
                        detectHold: switchState,
                    },
                });
            }
        }

        const battery = _.get(lanState, 'battery', null);

        if (battery !== null) {
            _.merge(iHostState, {
                battery: {
                    battery: toIntNumber(battery),
                },
            });
        }

        return iHostState;
    }
}
