"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getListenerHook = exports.createDeviceTs = exports.createAppTs = exports.createNonce = void 0;
const enum_1 = require("../ts/enum");
function createNonce() {
    let arr = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];
    const str = Array(8)
        .fill(1)
        .map((v) => arr[Math.round(Math.random() * (arr.length - 1))])
        .join('');
    return str;
}
exports.createNonce = createNonce;
function createAppTs() {
    return Math.round(new Date().getTime() / 1000).toString();
}
exports.createAppTs = createAppTs;
function createDeviceTs() {
    return Number(`${Date.now()}`.substr(0, 10));
}
exports.createDeviceTs = createDeviceTs;
function getListenerHook(config) {
    return config.userAgent !== 'device' ? `${enum_1.EEventType.INIT_WS}${config.apikey}` : `${enum_1.EEventType.INIT_WS}${config.deviceid}`;
}
exports.getListenerHook = getListenerHook;
function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(1);
        }, time);
    });
}
exports.sleep = sleep;
