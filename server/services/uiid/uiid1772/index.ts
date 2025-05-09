import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import iHostStateToLanState from "../common/iHostStateToLanState";
import { ILanStateTrv } from "../../../ts/interface/ILanState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";

/** 温控阀 (thermostat) */
export default class Uiid1772 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_1772;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.THERMOSTAT,
        capabilities: [
            { capability: ECapability.VOLTAGE, permission: EPermission.UPDATED },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.UPDATE_UPDATED_CONFIGURE,
                name: 'manual-mode',
                settings: {
                    temperatureUnit: {
                        type: "enum",
                        permission: "11",
                        value: "c",
                        values: [
                            "c",
                            "f"
                        ]
                    },
                    temperatureRange: {
                        type: "numeric",
                        permission: "01",
                        min: 4,
                        max: 35,
                        step: 0.5
                    }
                },
            },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.UPDATE_UPDATED_CONFIGURE,
                name: 'eco-mode',
                settings: {
                    temperatureUnit: {
                        type: "enum",
                        permission: "11",
                        value: "c",
                        values: [
                            "c",
                            "f"
                        ]
                    },
                    temperatureRange: {
                        type: "numeric",
                        permission: "01",
                        min: 4,
                        max: 35,
                        step: 0.5
                    }
                },
            },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.UPDATED_CONFIGURE,
                name: 'auto-mode',
                settings: {
                    temperatureUnit: {
                        type: "enum",
                        permission: "01",
                        value: "c",
                        values: [
                            "c",
                            "f"
                        ]
                    },
                    temperatureRange: {
                        type: "numeric",
                        permission: "01",
                        min: 4,
                        max: 35,
                        step: 0.5
                    },
                    weeklySchedule: {
                        type: "object",
                        permission: "11",
                        value: {
                            maxEntryPerDay: 6,
                            Sunday: [],
                            Monday: [],
                            Tuesday: [],
                            Wednesday: [],
                            Thursday: [],
                            Friday: [],
                            Saturday: [],
                        }
                    },
                },
            },
            { capability: ECapability.THERMOSTAT, permission: EPermission.UPDATED, name: 'adaptive-recovery-status' },
            {
                capability: ECapability.THERMOSTAT,
                permission: EPermission.UPDATE_UPDATED,
                name: 'thermostat-mode',
                settings: {
                    supportedModes: {
                        type: "enum",
                        permission: "01",
                        values: [
                            "MANUAL",
                            "AUTO",
                            "ECO"
                        ]
                    }
                },
            },
            {
                capability: ECapability.TEMPERATURE,
                permission: EPermission.UPDATED_CONFIGURE,
                settings: {
                    temperatureRange: {
                        type: "numeric",
                        permission: "01",
                        min: -40,
                        max: 80
                    },

                    temperatureUnit: {
                        type: "enum",
                        permission: "11",
                        value: "c",
                        values: [
                            "c",
                            "f"
                        ]
                    },
                    temperatureCalibration: {
                        type: "numeric",
                        permission: "11",
                        min: -7, // 最小值，可选
                        max: 7, // 最大值，可选
                        step: 0.2, // 温度调节步长，单位同temperatureUnit
                        value: 0, // 表示当前温度校准值，number类型，单位同temperatureUnit，必选。
                    }
                },
            },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateTrv) {
        return lanStateToIHostState.trv(lanState, this._eWeLinkDeviceData!);
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        return iHostStateToLanState.trv(iHostState);
    }
}