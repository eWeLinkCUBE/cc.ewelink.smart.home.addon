"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID195_PROTOCOL = void 0;
exports.UIID195_PROTOCOL = {
    uiid: 195,
    initParams(device) {
        const { buzzerAlarm, sysVersion = '', zigbeeVersion = '', securityType, securitySetting1, securitySetting2, securitySetting3 } = device.itemData.params;
        return { buzzerAlarm, sysVersion, zigbeeVersion, securityType, securitySetting1, securitySetting2, securitySetting3 };
    },
    controlItem: {
        setSecurityType(controlItem) {
            const { securityType = 0 } = controlItem;
            return { securityType };
        },
        setAlarmBeeps(controlItem) {
            const { fileName, volume, duration, test } = controlItem;
            return {
                buzzerAlarm: { duration, fileName, test, volume }
            };
        }
    }
};
