"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneConfig = exports.fakeTempList = exports.UIID59_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const color_1 = require("../utils/color");
exports.UIID59_PROTOCOL = {
    uiid: 59,
    initParams(device) {
        const { bright = 100, colorR = 255, colorG = 0, colorB = 63, light_type = 1, mode = 1, speed = 100, switch: s = 'on' } = device.itemData.params;
        return { bright, colorR, colorG, colorB, light_type, mode, speed, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness(controlItem) {
            const { brightness } = controlItem;
            return { bright: brightness, mode: 1 };
        },
        setColorTemperature(controlItem) {
            const { colorTemp } = controlItem;
            const [colorR, colorG, colorB] = exports.fakeTempList[colorTemp].split(',');
            return { colorR: +colorR, colorG: +colorG, colorB: +colorB, light_type: 2, mode: 1 };
        },
        setColor(controlItem) {
            const { hue = 0, saturation } = controlItem;
            const [r, g, b] = (0, color_1.hueToRgb)(hue, saturation);
            return { colorR: r, colorG: g, colorB: b, light_type: 1, mode: 1 };
        },
        setLightMode: controlItem => {
            const { colorMode = 'cct', device: { params: { colorR, colorG, colorB } } } = controlItem;
            const lightType = colorMode === 'cct' ? 2 : 1;
            return { mode: 1, light_type: lightType, colorR, colorG, colorB };
        },
        setMultiLightControl: controlItem => {
            var _a;
            const { brightness, colorTemp, hue, saturation } = controlItem;
            const returnObj = {
                switch: 'on'
            };
            if (typeof brightness === 'number') {
                Object.assign(returnObj, { bright: brightness });
            }
            if (typeof colorTemp === 'number') {
                const [colorR = '255', colorG = '0', colorB = '0'] = ((_a = exports.fakeTempList[colorTemp]) !== null && _a !== void 0 ? _a : []).split(',');
                Object.assign(returnObj, {
                    colorR: +colorR,
                    colorG: +colorG,
                    colorB: +colorB,
                    light_type: 2,
                    mode: 1
                });
            }
            if (typeof hue === 'number') {
                const [r, g, b] = (0, color_1.hueToRgb)(hue, saturation);
                Object.assign(returnObj, {
                    colorR: r,
                    colorG: g,
                    colorB: b,
                    light_type: 1,
                    mode: 1
                });
            }
            return returnObj;
        }
    }
};
exports.fakeTempList = [
    '214,225,255',
    '214,225,255',
    '217,225,255',
    '215,226,255',
    '218,226,255',
    '216,227,255',
    '219,226,255',
    '217,227,255',
    '220,227,255',
    '218,228,255',
    '221,228,255',
    '220,229,255',
    '223,229,255',
    '221,230,255',
    '224,230,255',
    '222,230,255',
    '225,231,255',
    '224,231,255',
    '227,232,255',
    '225,232,255',
    '228,233,255',
    '227,233,255',
    '229,233,255',
    '228,234,255',
    '231,234,255',
    '230,235,255',
    '233,236,255',
    '231,236,255',
    '234,237,255',
    '233,237,255',
    '236,238,255',
    '235,238,255',
    '238,239,255',
    '237,239,255',
    '239,240,255',
    '239,240,255',
    '241,241,255',
    '240,241,255',
    '243,243,255',
    '243,242,255',
    '245,244,255',
    '245,243,255',
    '247,245,255',
    '247,245,255',
    '250,247,255',
    '249,246,255',
    '252,248,255',
    '252,247,255',
    '254,250,255',
    '254,249,255',
    '255,249,253',
    '255,249,253',
    '255,249,251',
    '255,248,251',
    '255,248,248',
    '255,246,248',
    '255,247,245',
    '255,245,245',
    '255,246,243',
    '255,244,242',
    '255,245,240',
    '255,243,239',
    '255,244,237',
    '255,242,236',
    '255,243,234',
    '255,240,233',
    '255,241,231',
    '255,239,230',
    '255,240,228',
    '255,238,227',
    '255,239,225',
    '255,236,224',
    '255,238,222',
    '255,235,220',
    '255,237,218',
    '255,233,217',
    '255,235,215',
    '255,232,213',
    '255,234,211',
    '255,230,210',
    '255,232,208',
    '255,228,206',
    '255,231,204',
    '255,227,202',
    '255,229,200',
    '255,225,198',
    '255,228,196',
    '255,223,194',
    '255,226,192',
    '255,221,190',
    '255,225,188',
    '255,219,186',
    '255,223,184',
    '255,217,182',
    '255,221,180',
    '255,215,177',
    '255,219,175',
    '255,213,173',
    '255,217,171',
    '255,211,168',
    '255,215,166',
    '255,209,163',
    '255,213,161',
    '255,206,159',
    '255,211,156',
    '255,204,153',
    '255,208,151',
    '255,201,148',
    '255,206,146',
    '255,199,143',
    '255,203,141',
    '255,196,137',
    '255,201,135',
    '255,193,132',
    '255,198,130',
    '255,190,126',
    '255,195,124',
    '255,187,120',
    '255,192,118',
    '255,184,114',
    '255,189,111',
    '255,180,107',
    '255,185,105',
    '255,177,101',
    '255,182,98',
    '255,173,94',
    '255,178,91',
    '255,169,87',
    '255,174,84',
    '255,165,79',
    '255,170,77',
    '255,161,72',
    '255,166,69',
    '255,157,63',
    '255,162,60',
    '255,152,54',
    '255,157,51',
    '255,147,44',
    '255,152,41',
    '255,142,33',
    '255,146,29',
    '255,137,18',
    '255,141,11'
];
exports.sceneConfig = {
    colorfuls: {
        switch: 'on',
        mode: 1
    },
    colorfulGRA: {
        switch: 'on',
        mode: 2
    },
    colorfulBRE: {
        switch: 'on',
        mode: 3,
        speed: 50,
        colorR: 255,
        colorG: 255,
        colorB: 255
    },
    RGBSTR: {
        switch: 'on',
        mode: 11
    },
    RGBGRA: {
        switch: 'on',
        mode: 8
    },
    RGBPUL: {
        switch: 'on',
        mode: 9
    },
    RGBBRE: {
        switch: 'on',
        mode: 10
    },
    DIYGRA: {
        switch: 'on',
        mode: 4,
        speed: 50,
        colorR: 255,
        colorG: 255,
        colorB: 255
    },
    DIYPUL: {
        switch: 'on',
        mode: 5,
        speed: 50,
        colorR: 255,
        colorG: 255,
        colorB: 255
    },
    DIYBRE: {
        switch: 'on',
        mode: 6,
        speed: 50,
        colorR: 255,
        colorG: 255,
        colorB: 255
    },
    DIYSTR: {
        switch: 'on',
        mode: 7,
        speed: 50,
        colorR: 255,
        colorG: 255,
        colorB: 255
    }
};
