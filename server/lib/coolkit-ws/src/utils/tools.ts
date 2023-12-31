import { EEventType } from '../ts/enum';
import { IConfig } from '../ts/interfaces';

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

function createAppTs() {
    return Math.round(new Date().getTime() / 1000).toString();
}

function createDeviceTs() {
    return Number(`${Date.now()}`.substr(0, 10));
}

// 工具函数生成监听名
function getListenerHook(config: IConfig) {
    return config.userAgent !== 'device' ? `${EEventType.INIT_WS}${config.apikey}` : `${EEventType.INIT_WS}${config.deviceid}`;
}


/**
 *
 * 睡眠函数
 * @date 23/06/2022
 * @param {number} time
 */
function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(1);
        }, time)
    })
}

export { createNonce, createAppTs, createDeviceTs, getListenerHook, sleep };
