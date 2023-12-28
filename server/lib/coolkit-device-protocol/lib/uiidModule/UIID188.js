"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID188_PROTOCOL = void 0;
const color_1 = require("../utils/color");
exports.UIID188_PROTOCOL = {
    uiid: 188,
    initParams: device => {
        const { switch: state = { switch: { value: 'off' } }, switchLevel = { level: { value: 1, unit: '%' } }, colorControl = {
            saturation: {
                value: 100
            },
            color: { value: 1 },
            hue: {
                value: 0
            }
        }, colorTemperature = {
            colorTemperature: {
                value: 5600
            }
        } } = device.itemData.params;
        const value = typeof state !== 'string' && state.switch ? state.switch.value : 'off';
        return {
            switch: {
                switch: {
                    value
                }
            },
            switchLevel,
            colorControl,
            colorTemperature
        };
    },
    controlItem: {
        toggle: controlItem => {
            const { device } = controlItem;
            const { switch: state } = device.params;
            const value = state.switch.value;
            return {
                commands: [
                    {
                        component: 'main',
                        capability: 'switch',
                        command: value === 'off' ? 'on' : 'off',
                        arguments: []
                    }
                ]
            };
        },
        setBrightness: controlItem => {
            const { brightness } = controlItem;
            return {
                commands: [
                    {
                        component: 'main',
                        capability: 'switchLevel',
                        command: 'setLevel',
                        arguments: [brightness]
                    }
                ]
            };
        },
        setColorTemperature: controlItem => {
            const { colorTemp } = controlItem;
            return {
                commands: [
                    {
                        component: 'main',
                        capability: 'colorTemperature',
                        command: 'setColorTemperature',
                        arguments: [colorTemp]
                    }
                ]
            };
        },
        setColor: controlItem => {
            const { hue = 0 } = controlItem;
            const convertHue = (0, color_1.getValueByScope)(hue, { min: 0, max: 360 }, { min: 0, max: 100 });
            return {
                commands: [
                    {
                        component: 'main',
                        capability: 'colorControl',
                        command: 'setColor',
                        arguments: [
                            {
                                hue: convertHue,
                                saturation: 100
                            }
                        ]
                    }
                ]
            };
        }
    }
};
