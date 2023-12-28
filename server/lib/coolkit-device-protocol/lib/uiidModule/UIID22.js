"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIVE_COLOR_BULB_LT_BRIGHTNWSS = exports.sceneMap = exports.UIID22_PROTOCOL = void 0;
const color_1 = require("../utils/color");
exports.UIID22_PROTOCOL = {
    uiid: 22,
    initParams(device) {
        const { channel0 = '159', channel1 = '159', channel2 = '0', channel3 = '0', channel4 = '0', state = 'off', type = 'middle', zyx_mode = 1 } = device.itemData.params;
        return { channel0, channel1, channel2, channel3, channel4, state, type, zyx_mode };
    },
    controlItem: {
        toggle(controlItem) {
            const { device: { params }, switch: state } = controlItem;
            if (state) {
                return { state };
            }
            return params.state === 'on' ? { state: 'off' } : { state: 'on' };
        },
        setBrightness(controlItem) {
            const { device: { params: { type } }, brightness = 11 } = controlItem;
            const brightnessValue = exports.FIVE_COLOR_BULB_LT_BRIGHTNWSS[brightness - 1];
            return {
                type,
                channel0: type !== 'warm' ? brightnessValue : '0',
                channel1: type !== 'cold' ? brightnessValue : '0'
            };
        },
        setColorTemperature(controlItem) {
            const { device: { params: { channel0 = '', channel1 = '' } }, colorTemp } = controlItem;
            const lightType = colorTemp === 100 ? 'cold' : colorTemp === 50 ? 'middle' : 'warm';
            const bright = `${Math.max(+channel0, +channel1)}`;
            return {
                type: lightType,
                channel0: ['cold', 'middle'].includes(lightType) ? bright : '0',
                channel1: ['warm', 'middle'].includes(lightType) ? bright : '0'
            };
        },
        setColor(controlItem) {
            const { hue = 360 } = controlItem;
            const [r, g, b] = (0, color_1.hueToRgb)(hue);
            return {
                type: 'middle',
                zyx_mode: 2,
                channel0: '0',
                channel1: '0',
                channel2: r + '',
                channel3: g + '',
                channel4: b + ''
            };
        },
        setLightMode: controlItem => {
            const { colorMode = 'cct' } = controlItem;
            const typeKey = colorMode === 'cct' ? 'white' : 'color';
            return exports.sceneMap.get(typeKey);
        },
        setLightScene: controlItem => {
            const { sceneType } = controlItem;
            return exports.sceneMap.get(sceneType);
        },
        setMultiLightControl: controlItem => {
            const { brightness, colorTemp, hue } = controlItem;
            const returnObj = {
                state: 'on'
            };
            if (typeof colorTemp === 'number') {
                const lightType = colorTemp === 100 ? 'cold' : colorTemp === 50 ? 'middle' : 'warm';
                if (typeof brightness === 'number') {
                    const brightnessValue = exports.FIVE_COLOR_BULB_LT_BRIGHTNWSS[brightness - 1];
                    Object.assign(returnObj, {
                        type: lightType,
                        channel0: lightType !== 'warm' ? brightnessValue : '0',
                        channel1: lightType !== 'cold' ? brightnessValue : '0'
                    });
                }
            }
            if (typeof hue === 'number') {
                const [r, g, b] = (0, color_1.hueToRgb)(hue);
                Object.assign(returnObj, {
                    type: 'middle',
                    zyx_mode: 2,
                    channel0: '0',
                    channel1: '0',
                    channel2: r + '',
                    channel3: g + '',
                    channel4: b + ''
                });
            }
            return returnObj;
        }
    }
};
exports.sceneMap = new Map([
    [
        'white',
        {
            channel0: '159',
            channel1: '159',
            channel2: '0',
            channel3: '0',
            channel4: '0',
            zyx_mode: 1,
            type: 'middle'
        }
    ],
    [
        'color',
        {
            channel0: '0',
            channel1: '0',
            channel2: '255',
            channel3: '0',
            channel4: '0',
            zyx_mode: 2,
            type: 'middle'
        }
    ],
    [
        'goodNight',
        {
            channel0: '0',
            channel1: '0',
            channel2: '189',
            channel3: '118',
            channel4: '0',
            zyx_mode: 3,
            type: 'middle'
        }
    ],
    [
        'read',
        {
            channel0: '0',
            channel1: '0',
            channel2: '255',
            channel3: '255',
            channel4: '255',
            zyx_mode: 4,
            type: 'middle'
        }
    ],
    [
        'party',
        {
            channel0: '0',
            channel1: '0',
            channel2: '207',
            channel3: '56',
            channel4: '3',
            zyx_mode: 5,
            type: 'middle'
        }
    ],
    [
        'leisure',
        {
            channel0: '0',
            channel1: '0',
            channel2: '56',
            channel3: '85',
            channel4: '179',
            zyx_mode: 6,
            type: 'middle'
        }
    ]
]);
exports.FIVE_COLOR_BULB_LT_BRIGHTNWSS = [
    '25',
    '38',
    '40',
    '61',
    '85',
    '103',
    '117',
    '130',
    '141',
    '150',
    '159',
    '167',
    '174',
    '180',
    '186',
    '192',
    '197',
    '202',
    '207',
    '211',
    '255'
];
