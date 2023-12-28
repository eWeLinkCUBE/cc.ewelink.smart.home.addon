"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID197_PROTOCOL = void 0;
exports.UIID197_PROTOCOL = {
    uiid: 197,
    initParams(device) {
        const { brightness = 50, color = { temperature: 4500 }, on = true } = device.itemData.params;
        return { brightness, color, on };
    },
    controlItem: {
        toggle(controlItem) {
            const { device: { params: { on } } } = controlItem;
            return {
                capability: 'action.devices.commands.OnOff',
                execParams: {
                    on: !on
                }
            };
        },
        setBrightness(controlItem) {
            const { brightness = 1 } = controlItem;
            return {
                capability: 'action.devices.commands.BrightnessAbsolute',
                execParams: {
                    brightness
                }
            };
        },
        setColorTemperature(controlItem) {
            const { colorTemp = 1 } = controlItem;
            return {
                capability: 'action.devices.commands.ColorAbsolute',
                execParams: {
                    color: {
                        temperature: colorTemp
                    }
                }
            };
        }
    }
};
