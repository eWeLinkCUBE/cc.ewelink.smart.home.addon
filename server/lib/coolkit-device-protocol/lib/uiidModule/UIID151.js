"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID151_PROTOCOL = void 0;
exports.UIID151_PROTOCOL = {
    uiid: 151,
    initParams: device => {
        const { power = 'off', temperature, small_temperature, wind_speed, wind_swing_lr, wind_swing_ud, power_off_timer, power_off_time_value, power_on_timer, power_on_time_value, mode, indoor_temperature, outdoor_temperature } = device.itemData.params;
        return {
            power,
            temperature,
            small_temperature,
            wind_speed,
            wind_swing_lr,
            wind_swing_ud,
            power_off_timer,
            power_off_time_value,
            power_on_timer,
            power_on_time_value,
            mode,
            indoor_temperature,
            outdoor_temperature
        };
    },
    controlItem: {
        toggle(controlItem) {
            const { power } = controlItem.device.params;
            return power === 'on' ? { power: 'off' } : { power: 'on' };
        },
        setTargetTemp(controlItem) {
            const { targetTemp = 20 } = controlItem;
            return { temperature: Math.floor(targetTemp), small_temperature: targetTemp - Math.floor(targetTemp) };
        },
        setMediaAirCondition(controlItem) {
            const { wind_speed, wind_swing_ud, wind_swing_lr, mediaMode } = controlItem;
            if (typeof wind_speed === 'number') {
                return { wind_speed };
            }
            else if (wind_swing_ud) {
                return { wind_swing_ud };
            }
            else if (wind_swing_lr) {
                return { wind_swing_lr };
            }
            else {
                return { mode: mediaMode };
            }
        }
    }
};
