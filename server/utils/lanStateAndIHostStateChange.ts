import {
    ILanState190,
    ILanStateLight,
    ILanState44,
    ILanState181and15,
    ILanState126And165,
    ILanState34,
    ILanState28,
    ILanStateButton,
    ILanStateContactSensor,
    ILanStateCurtain,
    ILanStateTemAndHum,
    ILanStateMotionSensor,
    ILanStatePersonExist,
    ILanState22,
    ILanState102,
    ILanState154,
    ILanState36,
    ILanState173And137,
    ILanState59,
    ILanState5,
    ILanStateMonochromeLamp,
    ILanStateBicolorLamp,
    ILanStateFiveColorLamp,
    ILanStateWaterSensor,
    ILanStateSmokeDetector,
    ILanStateContactSensorWithTamperAlert,
    ILanStateTrv,
    TrvWorkMode,
    TrvWorkState,
    ILanStateMotionSensor7002,
    ILanState57,
    ILanState52,
    ILanState11,
    ILanState130,
    ILanStateMultiPress,
} from '../ts/interface/ILanState';
import { IHostStateInterface } from '../ts/interface/IHostState';
import deviceDataUtil from './deviceDataUtil';
import logger from '../log';
import EUiid from '../ts/enum/EUiid';
import { initDeviceList, controlDevice } from '../lib/coolkit-device-protocol';
import { fakeTempList, brightMap, ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST } from '../const';
import { hsvToRgb, rgbToHsv } from '../utils/colorUtils';
import _ from 'lodash';
import { toIntNumber } from './tool';
import { changeVoltageToBattery } from './deviceTool';


//对 uiid 190 特殊处理 (Special handling for uiid 190)
function lanStateToIHostStatePowerDevice(lanState: ILanState190, uiid: number) {
    const iHostState = {};
    const power = _.get(lanState, 'power', null); //功率 (power)
    //是否要乘以100，有些局域网参数会乘100再上报 (Do you want to multiply by 100? Some LAN parameters will be multiplied by 100 before reporting.)
    let unitValue = 1;

    if ([EUiid.uiid_182].includes(uiid)) {
        unitValue = 100;
    }

    if (power !== null) {
        _.assign(iHostState, {
            'electric-power': {
                'electric-power': toIntNumber(power * unitValue),
            },
        });
    }

    const voltage = _.get(lanState, 'voltage', null); //电压 (Voltage)
    if (voltage !== null) {
        _.assign(iHostState, {
            voltage: {
                voltage: toIntNumber(voltage * unitValue),
            },
        });
    }

    const current = _.get(lanState, 'current', null); //电量
    if (current !== null) {
        _.assign(iHostState, {
            'electric-current': {
                'electric-current': toIntNumber(current * unitValue),
            },
        });
    }

    return iHostState;
}

function lanStateToIHostStateLight(lanState: ILanStateLight, uiid: number) {
    const iHostState = {};
    const ltype = _.get(lanState, 'ltype', null); //情景模式 (Scenario)
    if (ltype !== null) {
        const brValue = _.get(lanState, [ltype, 'br'], null);
        let ctValue = _.get(lanState, [ltype, 'ct'], null);
        // 色温数值转换,[0,255]转换成[0，100]
        // Color temperature numerical conversion, [0,255] is converted into [0,100]
        if (ctValue !== null && [EUiid.uiid_103, EUiid.uiid_104].includes(uiid)) {
            ctValue = toIntNumber((ctValue / 255) * 100);
        }

        const redValue = _.get(lanState, [ltype, 'r'], null);
        const greenValue = _.get(lanState, [ltype, 'g'], null);
        const blueValue = _.get(lanState, [ltype, 'b'], null);

        if (brValue !== null) {
            _.assign(iHostState, {
                brightness: {
                    brightness: brValue,
                },
            });
        }

        if (ctValue !== null) {
            _.assign(iHostState, {
                'color-temperature': {
                    colorTemperature: ctValue,
                },
            });
        }

        if (redValue !== null && greenValue !== null && blueValue !== null) {
            _.assign(iHostState, {
                'color-rgb': {
                    red: redValue,
                    green: greenValue,
                    blue: blueValue,
                },
            });
        }
    }

    return iHostState;
}

function iHostStateToLanStateLight(iHostState: IHostStateInterface, deviceId: string, uiid: number) {
    const lanState = deviceDataUtil.getLastLanState(deviceId) as ILanStateLight;

    lanState && delete lanState.switch;
    lanState && delete lanState.fwVersion;
    const brightnessObj = _.get(iHostState, 'brightness', null);
    const colorTemperatureObj = _.get(iHostState, 'color-temperature', null);
    const colorRgbObj = _.get(iHostState, 'color-rgb', null);

    const ltype = _.get(lanState, 'ltype', 'white');
    const br = _.get(lanState, [ltype, 'br'], 0);

    if (brightnessObj) {
        const ltype = _.get(lanState, 'ltype', null);
        let newLanState: any = {};
        // 第一次拿到的局域网设备信息，没有灯模式字段
        // The LAN device information obtained for the first time does not have a light mode field.
        if (ltype === null) {
            newLanState = {
                ltype: 'white',
                white: {
                    br: brightnessObj.brightness,
                    ct: 100,
                },
            };
        } else {
            newLanState[ltype] = {
                br: brightnessObj.brightness,
            };
        }
        _.merge(lanState, newLanState);
    }

    if (colorTemperatureObj) {
        const newLanState: any = {
            ltype: 'white',
        };

        let ct = colorTemperatureObj.colorTemperature;
        // 色温数值转换,[0，100]转换成[0,255]
        // Color temperature numerical conversion, [0, 100] is converted to [0, 255]
        if ([EUiid.uiid_103, EUiid.uiid_104].includes(uiid)) {
            ct = toIntNumber((ct / 100) * 255);
        }

        newLanState['white'] = {
            // 防止一起亮度喝色温一起控制时，亮度不生效
            // Prevent the brightness from not taking effect when the brightness and color temperature are controlled together.
            br: brightnessObj?.brightness ?? br,
            ct,
        };

        _.merge(lanState, newLanState);
        lanState && delete lanState.color;
    }

    if (colorRgbObj) {
        const newLanState: any = {
            ltype: 'color',
        };

        newLanState['color'] = {
            br: brightnessObj?.brightness ?? br,
            r: colorRgbObj.red,
            g: colorRgbObj.green,
            b: colorRgbObj.blue,
        };
        lanState && delete lanState.white;
        _.merge(lanState, newLanState);
    }

    return lanState;
}

function iHostStateToLanState44(iHostState: IHostStateInterface) {
    const lanState = {};

    const brightnessObj = _.get(iHostState, 'brightness');
    if (brightnessObj) {
        _.assign(lanState, {
            brightness: brightnessObj.brightness,
            switch: 'on',
        });
    }
    return lanState;
}

function lanStateToIHostState44(lanState: ILanState44) {
    const iHostState = {};

    const brightness = _.get(lanState, 'brightness');

    if (brightness) {
        _.assign(iHostState, {
            brightness: {
                brightness,
            },
        });
    }

    return iHostState;
}

function lanStateToIHostState181And15(lanState: ILanState181and15, uiid: EUiid) {
    const iHostState = {};

    const currentHumidity = _.get(lanState, 'currentHumidity', null);

    if (currentHumidity !== null && currentHumidity !== 'unavailable') {
        _.assign(iHostState, {
            humidity: {
                humidity: toIntNumber(currentHumidity),
            },
        });
    }

    const currentTemperature = _.get(lanState, 'currentTemperature', null);

    if (currentTemperature !== null && currentTemperature !== 'unavailable') {
        _.assign(iHostState, {
            temperature: {
                temperature: toIntNumber(currentTemperature, 1),
            },
        });
    }
    if (uiid === EUiid.uiid_181) {
        const autoControlEnabled = _.get(lanState, 'autoControlEnabled', null);

        if (autoControlEnabled !== null) {
            _.assign(iHostState, {
                // 0 手动，1 自动。 ( 0 manual, 1 automatic)
                mode: {
                    thermostatMode: {
                        modeValue: autoControlEnabled === 0 ? 'manual' : 'auto',
                    },
                },
            });
        }
    }

    if (uiid === EUiid.uiid_15) {
        const deviceType = _.get(lanState, 'deviceType', null);

        if (deviceType !== null) {
            _.assign(iHostState, {
                // deviceType模式 --- temperature温度控制，humidity湿度控制，normal正常，即手动控制开关状态
                // deviceType mode ---temperature temperature control, humidity control, normal, that is, manual control switch status
                mode: {
                    thermostatMode: {
                        modeValue: deviceType === 'normal' ? 'manual' : 'auto',
                    },
                },
            });
        }
    }

    return iHostState;
}

function iHostStateToLanState15(lanState: any) {
    const newLanState = {
        mainSwitch: _.get(lanState, 'switch', 'on'),
        deviceType: 'normal',
    };

    return newLanState;
}

function lanStateToIHostState126And165(lanState: ILanState126And165) {
    const iHostState = {};

    const currLocation = _.get(lanState, 'currLocation', null);

    if (currLocation !== null) {
        _.assign(iHostState, {
            percentage: {
                percentage: 100 - currLocation,
            },
        });
    }
    const motorTurn = _.get(lanState, 'motorTurn', null); //0-电机停止；1-电机正传；2-电机反转 (0:Motor stops; 1:Motor forwards; 2:Motor reverses)
    const motorTurnArr = ['stop', 'open', 'close'];

    if (motorTurn !== null) {
        _.assign(iHostState, {
            'motor-control': {
                motorControl: motorTurnArr[motorTurn],
            },
        });
    }

    const calibState = _.get(lanState, 'calibState', null);

    if (calibState !== null) {
        _.assign(iHostState, {
            //normal 表示正常模式（已校准），calibration 表示正在校准。
            //normal Indicates normal mode (calibrated），calibration Indicates calibration is in progress。
            'motor-clb': {
                motorClb: calibState === 0 ? 'calibration' : 'normal',
            },
        });
    }

    return iHostState;
}

function iHostStateToLanState126And165(iHostState: IHostStateInterface, deviceId: string, isWebSocket: boolean) {
    let lanState = {};

    const motorControl = _.get(iHostState, 'motor-control', null);
    const motorTurnObj = {
        stop: 0,
        open: 1,
        close: 2,
    };
    if (motorControl) {
        _.assign(lanState, {
            //0-电机停止；1-电机正传；2-电机反转。
            //0 The motor stops; 1 The motor rotates forward; 2 The motor rotates reversely.
            motorTurn: motorTurnObj[motorControl.motorControl],
        });
    }

    const percentage = _.get(iHostState, 'percentage', null);

    if (percentage) {
        //局域网控制，0和100百分比的时候设备没反应
        //LAN control, the device does not respond at 0 and 100 percentages
        if (percentage.percentage === 0) {
            _.assign(lanState, {
                motorTurn: 1,
            });
            return lanState;
        }

        if (percentage.percentage === 100) {
            _.assign(lanState, {
                motorTurn: 2,
            });
            return lanState;
        }

        _.assign(lanState, {
            location: 100 - percentage.percentage,
        });
    }
    // 设备处于websocket模式（Device is in websocket mode）
    if (isWebSocket) {
        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);

        const workMode = _.get(eWeLinkDeviceData, 'itemData.params.workMode', 1);
        // 1 开关，2 电机,3 电表模式（ 1 switch, 2 motor 3 Meter mode）
        if (workMode === 1) {
            // 设备处于开关模式，去掉电机控制字段（The device is in switch mode, remove the motor control field）
            lanState = _.omit(lanState, ['motorTurn', 'location']);
        } else if (workMode === 2) {
            // 设备处于电机模式，去掉开关字段（The device is in motor mode, remove the switch field）
            lanState = _.omit(lanState, ['switches']);
        } else if (workMode === 3) {
            // 设备处于电表模式，去掉所有控制字段（The device is in meter mode, with all control fields removed）
            lanState = {};
        }
    }

    return lanState;
}

function lanStateToIHostState34(lanState: ILanState34) {
    const iHostState = {};

    const light = _.get(lanState, 'light', null);

    if (light !== null) {
        _.merge(iHostState, {
            toggle: {
                1: { toggleState: light },
            },
        });
    }

    const fan = _.get(lanState, 'fan', null);
    if (fan !== null) {
        _.merge(iHostState, {
            toggle: {
                2: { toggleState: fan },
            },
        });
    }

    const speed = _.get(lanState, 'speed', null);
    const speedList = ['low', 'medium', 'high'];
    if (speed !== null) {
        _.merge(iHostState, {
            mode: {
                fanLevel: {
                    modeValue: speedList[speed - 1],
                },
            },
        });
    }

    return iHostState;
}

function iHostStateToLanState34(iHostState: IHostStateInterface) {
    const lanState = {};

    const toggleState1 = _.get(iHostState, ['toggle', '1', 'toggleState']);
    const toggleState2 = _.get(iHostState, ['toggle', '2', 'toggleState']);

    if (toggleState1) {
        _.assign(lanState, {
            light: toggleState1,
        });
    }

    if (toggleState2) {
        _.assign(lanState, {
            fan: toggleState2,
        });
    }

    const mode = _.get(iHostState, ['mode', 'fanLevel', 'modeValue'], null);
    if (mode) {
        const speedObj = {
            low: 1,
            medium: 2,
            high: 3,
        };
        _.assign(lanState, {
            speed: speedObj[mode as 'low' | 'medium' | 'high'],
            fan: 'on',
        });
    }

    return lanState;
}

function iHostStateToLanState28(iHostState: IHostStateInterface, isWebSocket: boolean) {
    const lanState = {};
    const pressObj = _.get(iHostState, ['press']);
    if (pressObj) {
        _.assign(lanState, {
            rfChl: Number(pressObj.press),
        });
    }

    // if (isWebSocket) {
    //     _.assign(lanState, {
    //         cmd: 'transmit',
    //     });
    // }
    return lanState;
}
//rfTrig20: '2023-05-17T02:35:34.000Z',
function lanStateToIHostState28(lanState: ILanState28, actions: string[], isWebSocket: boolean) {
    const iHostState = {};

    if (isWebSocket) {
        const rfChl = _.get(lanState, 'rfChl');
        return {
            press: {
                press: rfChl.toString(),
            },
        };
    }

    if (!lanState) {
        return iHostState;
    }

    const lanStateArr = Object.entries(lanState);

    const rfItemArr = lanStateArr.find((item) => item[0].indexOf('rfTrig') > -1); // [ 'rfTrig0','2023-05-18T06:08:30.000Z']

    if (!rfItemArr) {
        return iHostState;
    }
    let rfChl = rfItemArr[0].split('rfTrig')[1];
    const _updateTime = rfItemArr[1];
    rfChl = `${rfChl}`;

    if (!actions.includes(rfChl)) {
        return iHostState;
    }

    _.merge(iHostState, {
        press: {
            press: rfChl,
        },
        //加入updateTime标识，解决一个问题，防止推送多次设备状态，记得每次推送时删除掉这个updateTime
        //Add the update time identifier to solve a problem and prevent the device status from being pushed multiple times. Remember to delete this update time each time you push it.
        _updateTime,
    });

    return iHostState;
}

function lanStateToIHostStateButton(lanState: ILanStateButton) {
    // 无线按键：0单击，1双击，2长按
    // Wireless buttons: 0 click, 1 double click, 2 long press
    const BUTTON_PRESS_MAP = {
        0: 'singlePress',
        1: 'doublePress',
        2: 'longPress',
    };
    const iHostState = {};

    const pressKey = _.get(lanState, 'key', null);

    if (pressKey !== null) {
        _.merge(iHostState, {
            press: {
                press: BUTTON_PRESS_MAP[pressKey],
            },
        });
    }

    const battery = _.get(lanState, 'battery', null);

    if (battery !== null) {
        _.merge(iHostState, {
            battery: {
                battery: toIntNumber(battery)
            },
        });
    }

    return iHostState;
}

function lanStateToIHostStateContactSensor(lanState: ILanStateContactSensor) {
    // 门窗传感器：0关闭，1开门 (Door and window sensor: 0 to close, 1 to open the door)
    // iHost 门窗传感器 detected，false关闭，1打开 (iHost door and window sensor detected, false to turn off, 1 to turn on)
    const DOOR_SENSOR_LOCK_MAP = {
        0: false,
        1: true,
    };
    const iHostState = {};

    const lockStatus = _.get(lanState, 'lock', null);

    if (lockStatus !== null) {
        _.merge(iHostState, {
            detect: {
                detected: DOOR_SENSOR_LOCK_MAP[lockStatus],
            },
        });
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

function lanStateToIHostStateContactSensorWithTamperAlert(lanState: ILanStateContactSensorWithTamperAlert) {
    const iHostState = lanStateToIHostStateContactSensor(lanState);
    // 在zigbee-P上，局域网sse和 websocket 都上报了 “被装上” 和 “被拆下” (On zigbee-P, both LAN SSE and websocket reported "mounted" and "removed")
    // 在zigbee-U上，websocket只上报了 “被拆下”(On zigbee-U, websocket only reports "removed")

    // 检测到拆除，split 字段存在时值只能为1 (When demolition is detected, the value of split field can only be 1 when it exists.)
    const split = _.get(lanState, 'split', null);
    if (split !== null) {
        _.merge(iHostState, {
            'tamper-alert': {
                tamper: split === 1 ? 'detected' : 'clear',
            },
        });
    }

    return iHostState;
}

function lanStateToIHostStateCurtain(lanState: ILanStateCurtain, uiid: EUiid.uiid_7006 | EUiid.uiid_7015, deviceId: string) {
    const iHostState = {};
    logger.info('lanStateToIHostStateCurtain-----------0', lanState);
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);

    const curPercent = _.get(lanState, 'curPercent', null);

    if (curPercent !== null) {
        _.merge(iHostState, {
            percentage: {
                percentage: curPercent,
            },
        });
    }

    if (uiid === EUiid.uiid_7006) {
        const motorClb = _.get(lanState, 'motorClb', null);

        if (motorClb !== null) {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb,
                },
            });
        }
    }

    /**
     * 7015 校准常态异常，未校准时上报 motorClb: normal 且 curPercent: 255 (7015 Calibration normal is abnormal. When not calibrated, motorClb: normal and curPercent: 255 are reported.)
     * 当 7015 curPercent = 255 时，同步为未校准状态 (When 7015 curPercent = 255, synchronization is uncalibrated)
     */
    if (uiid === EUiid.uiid_7015) {
        const eWeLinkUpperLimitState = _.get(eWeLinkDeviceData, ['itemData', 'params', 'upperLimitState'], null);
        const eWeLinkLowerLimitState = _.get(eWeLinkDeviceData, ['itemData', 'params', 'lowerLimitState'], null);

        const upperLimitState = _.get(lanState, 'upperLimitState', eWeLinkUpperLimitState);
        const lowerLimitState = _.get(lanState, 'lowerLimitState', eWeLinkLowerLimitState);

        // 上限位校准状态 String	"calibrated "：已校准"uncalibrated"：未校准 (Upper limit calibration status String "calibrated ": calibrated "uncalibrated": not calibrated)
        if (upperLimitState === 'calibrated' && lowerLimitState === 'calibrated') {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb: 'normal',
                },
            });
        } else {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb: 'calibration',
                },
            });
        }
        if (curPercent === 255) {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb: 'calibration',
                },
            });
        }
    }
    logger.info('lanStateToIHostStateCurtain-----------1', iHostState);

    return iHostState;
}

function iHostStateToLanStateCurtain(iHostState: IHostStateInterface) {
    const MOTOR_CONTROL_MAP = {
        open: 'open',
        close: 'close',
        stop: 'pause',
    };

    const lanState = {};
    const percentage = _.get(iHostState, ['percentage']);
    if (percentage) {
        _.assign(lanState, {
            openPercent: percentage.percentage,
        });
    }

    const motorControl = _.get(iHostState, ['motor-control']);
    if (motorControl) {
        _.assign(lanState, {
            curtainAction: MOTOR_CONTROL_MAP[motorControl.motorControl],
        });
    }
    return lanState;
}

function lanStateToIHostStateTemAndHum(lanState: ILanStateTemAndHum) {
    const iHostState = {};

    const temperature = _.get(lanState, 'temperature', null);

    if (temperature !== null) {
        _.merge(iHostState, {
            temperature: {
                temperature: Number(temperature) / 100,
            },
        });
    }
    const humidity = _.get(lanState, 'humidity', null);

    if (humidity !== null) {
        _.merge(iHostState, {
            humidity: {
                humidity: toIntNumber(Number(humidity) / 100),
            },
        });
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

function lanStateToIHostStateMotionSensor(lanState: ILanStateMotionSensor) {
    const MOTION_MAP = {
        0: false,
        1: true,
    };

    const iHostState = {};

    const motion = _.get(lanState, 'motion', null);

    if (motion !== null) {
        _.merge(iHostState, {
            detect: {
                detected: MOTION_MAP[motion],
            },
        });
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

function lanStateToIHostStateMotionSensor7002(lanState: ILanStateMotionSensor7002) {
    const iHostState = lanStateToIHostStateMotionSensor(lanState);

    // uiid 7002 移动传感器需要同步光照等级数据 (uiid 7002 motion sensor need to sync illumination-level data)
    const brState = _.get(lanState, 'brState', null);
    if (brState !== null) {
        _.merge(iHostState, {
            'illumination-level': {
                level: brState,
            },
        });
    }

    return iHostState;
}

function lanStateToIHostStatePersonExist(lanState: ILanStatePersonExist) {
    const HUMAN_MAP = {
        0: false,
        1: true,
    };

    const iHostState = {};

    const human = _.get(lanState, 'human', null);

    if (human !== null) {
        _.merge(iHostState, {
            detect: {
                detected: HUMAN_MAP[human],
            },
        });
    }

    const brState = _.get(lanState, 'brState', null);

    if (brState !== null) {
        _.merge(iHostState, {
            'illumination-level': {
                level: brState,
            },
        });
    }

    return iHostState;
}

function lanStateToIHostState22(lanState: ILanState22) {
    const iHostState = {};

    const powerState = _.get(lanState, 'state', null);

    if (powerState !== null) {
        _.merge(iHostState, {
            power: {
                powerState,
            },
        });
    }

    const channel0 = _.get(lanState, 'channel0', null);
    const channel1 = _.get(lanState, 'channel1', null);

    if (channel0 !== null && channel1 !== null) {
        const originBright = Math.max(Number(channel0), Number(channel1));
        let index = brightMap.findIndex((v) => Number(v) === originBright);
        index = index > -1 ? index + 1 : 11;
        const brightness = percentTranslateToHundred(index, [1, 21]);
        if (brightness) {
            _.assign(iHostState, {
                brightness: {
                    brightness,
                },
            });
        }

        let compare = Number(channel0) - Number(channel1);
        if (compare > 0) {
            compare = 100;
        } else if (compare === 0) {
            compare = 50;
        } else {
            compare = 0;
        }

        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: compare,
            },
        });
    }

    const redValue = _.get(lanState, 'channel2', null);
    const greenValue = _.get(lanState, 'channel3', null);
    const blueValue = _.get(lanState, 'channel4', null);

    if (redValue !== null && greenValue !== null && blueValue !== null) {
        _.merge(iHostState, {
            'color-rgb': {
                red: Number(redValue),
                green: Number(greenValue),
                blue: Number(blueValue),
            },
        });
    }

    return iHostState;
}

function lanStateToIHostState102(lanState: ILanState102, deviceId: string) {
    const iHostState = {};

    const switchState = _.get(lanState, 'switch', null);

    if (switchState !== null) {
        _.merge(iHostState, {
            detect: {
                detected: switchState === 'on',
            },
        });
    }

    const battery = _.get(lanState, 'battery', null);

    if (battery !== null) {
        const eWelinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);

        const batteryPercentage = changeVoltageToBattery(battery, eWelinkDeviceData)
        logger.info('battery voltage:', battery, 'batteryPercentage:', batteryPercentage, deviceId)
        _.merge(iHostState, {
            battery: {
                battery: toIntNumber(batteryPercentage),
            },
        });
    }
    return iHostState;
}

function lanStateToIHostState154(lanState: ILanState154) {
    const iHostState = {};

    const switchState = _.get(lanState, 'switch', null);
    const type = _.get(lanState, 'type', null);

    if (switchState !== null) {
        _.merge(iHostState, {
            detect: {
                detected: switchState === 'on',
            },
        });
    }

    if (switchState !== null && type !== null) {
        //type string | number
        //type 2 open
        //type 3 close
        //type 7 设备状态保持提醒 Device status reminder
        if (switchState === 'on' && type == 2) {
            _.merge(iHostState, {
                detect: {
                    detected: true,
                },
                'detect-hold': {
                    detectHold: 'off',
                },
            });
        }

        if (switchState === 'off' && type == 3) {
            _.merge(iHostState, {
                detect: {
                    detected: false,
                },
            });
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

function lanStateToIHostState36(lanState: ILanState36) {
    const iHostState = {};

    const brightness = _.get(lanState, 'bright', null);

    if (brightness !== null) {
        // 将10-100的值转换成1-100 Convert the value of 10 100 to 1 100
        const brightValue = percentTranslateToHundred(brightness, [10, 100]);
        _.merge(iHostState, {
            brightness: {
                brightness: brightValue,
            },
        });
    }
    return iHostState;
}

/**
 * 范围转换 (range conversion)
 * @param originValue 要转换的设备值 (device value to convert)
 * @param source 设备范围 (Device value range)
 * @returns 转换后的 1-100 (Converted  1-100)
 */
function percentTranslateToHundred(originValue: number, source: [number, number], isBrightness = true) {
    //亮度条最小是1，色温条最小是0（The minimum brightness bar is 1, and the minimum color temperature bar is 0）
    if (originValue === source[0]) {
        return isBrightness ? 1 : 0;
    }
    if (originValue === source[1]) return 100;
    const sourceRange = source[1] - source[0] + 1;
    let value = parseInt(((originValue - source[0] + 1) / sourceRange) * 100 + '');
    value < 0 && (value = 1);
    value > 100 && (value = 100);
    return value;
}

/**
 * 范围转换 (range conversion)
 * @param originValue 要转换的设备值 (device value to convert)
 * @param source 设备范围 (Device brightness range)
 * @returns 转换后的 1-100 (Converted  1-100)
 */
function percentTranslateFromHundred(originValue: number, target: [number, number]) {
    const value = (originValue / 100) * (target[1] - target[0]) + target[0];
    if (originValue === 0) return target[0];
    if (originValue === 100) return target[1];
    return Math.round(value);
}

function lanStateToIHostState173And137(lanState: ILanState173And137) {
    const iHostState = {};
    // logger.info('1------------------------lanState', lanState);

    const brightness = _.get(lanState, 'bright', null);

    if (brightness !== null) {
        _.merge(iHostState, {
            brightness: {
                brightness,
            },
        });
    }
    // logger.info('2------------------------', iHostState);

    const colorTemp = _.get(lanState, 'colorTemp', null);

    if (colorTemp !== null) {
        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: 100 - colorTemp,
            },
        });
    }

    const redValue = _.get(lanState, 'colorR', null);
    const greenValue = _.get(lanState, 'colorG', null);
    const blueValue = _.get(lanState, 'colorB', null);

    if (redValue !== null && greenValue !== null && blueValue !== null) {
        _.merge(iHostState, {
            'color-rgb': {
                red: redValue,
                green: greenValue,
                blue: blueValue,
            },
        });
    }

    // logger.info('3------------------------', iHostState);

    const mode = _.get(lanState, 'mode', null);
    if (mode !== null) {
        let modeValue = 'whiteLight';
        if (mode === 0 || mode === 1) {
            modeValue = 'color';
        } else if (mode === 2) {
            modeValue = 'colorTemperature';
        } else if (mode === 3) {
            modeValue = 'whiteLight';
        }
        _.merge(iHostState, {
            mode: {
                lightMode: {
                    modeValue,
                },
            },
        });
    }

    // logger.info('4------------------------', iHostState);

    return iHostState;
}

function lanStateToIHostState59(lanState: ILanState59) {
    const iHostState = {};

    const brightness = _.get(lanState, 'bright', null);

    if (brightness !== null) {
        _.merge(iHostState, {
            brightness: {
                brightness,
            },
        });
    }

    const redValue = _.get(lanState, 'colorR', null);
    const greenValue = _.get(lanState, 'colorG', null);
    const blueValue = _.get(lanState, 'colorB', null);

    if (redValue !== null && greenValue !== null && blueValue !== null) {
        _.merge(iHostState, {
            'color-rgb': {
                red: redValue,
                green: greenValue,
                blue: blueValue,
            },
        });

        let index = fakeTempList.findIndex((v) => v === `${redValue},${greenValue},${blueValue}`);
        index = index > -1 ? index : 0;
        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: 100 - percentTranslateToHundred(index, [0, 143], false),
            },
        });
    }
    return iHostState;
}

function iHostStateToLanStateWebSocket(iHostState: IHostStateInterface, deviceId: string, uiid: number) {
    let lanState = {};

    logger.info('iHostStateToLanStateWebSocket----1', iHostState);

    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    const { devices } = initDeviceList([eWeLinkDeviceData] as any);
    const device = devices[0];

    if (!device) {
        return {};
    }

    if (_.isEmpty(iHostState)) {
        return {};
    }

    const powerStateObj = _.get(iHostState, 'power');
    const brightnessObj = _.get(iHostState, 'brightness');
    const colorTempObj = _.get(iHostState, 'color-temperature');
    const colorRgbObj = _.get(iHostState, 'color-rgb');
    const modeObj = _.get(iHostState, 'mode');
    const motorControlObj = _.get(iHostState, 'motor-control');
    const percentageObj = _.get(iHostState, ['percentage']);

    let powerState;
    let brightness;
    let colorTemp;
    let hue;
    let colorMode;
    let saturation;

    if (powerStateObj) {
        powerState = powerStateObj.powerState;
        const proxy = controlDevice(device, 'toggle', { switch: powerState });
        _.assign(lanState, proxy);
    }

    if (motorControlObj) {
        const motorControlMapObj = {
            open: 'on',
            stop: 'pause',
            close: 'off',
        };
        const proxy = controlDevice(device, 'controlCurtain', { switch: motorControlMapObj[motorControlObj.motorControl] as 'on' | 'pause' | 'off' });
        _.assign(lanState, proxy);
    }

    if (percentageObj) {
        const proxy = controlDevice(device, 'controlCurtain', { setclose: percentageObj.percentage });
        _.assign(lanState, proxy);
    }

    if (brightnessObj) {
        brightness = brightnessObj.brightness;
        if ([EUiid.uiid_22].includes(uiid)) {
            brightness = percentTranslateFromHundred(brightness, [1, 21]);
        }
        if ([EUiid.uiid_52].includes(uiid)) {
            brightness = percentTranslateFromHundred(brightness, [25, 255]);
        }
        const proxy = controlDevice(device, 'setBrightness', { brightness });

        _.assign(lanState, proxy);
    }

    if (colorTempObj) {
        colorTemp = colorTempObj.colorTemperature;

        if ([EUiid.uiid_22].includes(uiid)) {
            //群组可能传非0、50、100的数值，做兼容（群The group may pass value other than 0, 50, and 100 for compatibility.）
            if (colorTemp >= 0 && colorTemp <= 33) {
                colorTemp = 0;
            } else if (colorTemp > 33 && colorTemp <= 66) {
                colorTemp = 50;
            } else {
                colorTemp = 100;
            }
        }

        if ([EUiid.uiid_59].includes(uiid)) {
            colorTemp = percentTranslateFromHundred(colorTemp, [0, 142]);
            colorTemp = 142 - colorTemp;
        }

        if ([EUiid.uiid_173, EUiid.uiid_137].includes(uiid)) {
            colorTemp = 100 - colorTemp;
        }

        if ([EUiid.uiid_52].includes(uiid)) {
            colorTemp = percentTranslateFromHundred(100 - colorTemp, [25, 255]);
        }

        //解决zigbee五色灯设置色温时没有亮度字段问题
        //Solve the problem that there is no brightness field when setting the color temperature of the zigbee five-color lamp
        let modeProxy = {};
        if (ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST.includes(uiid)) {
            modeProxy = controlDevice(device, 'setLightMode', { colorMode: 'cct' });
        }

        const proxy = controlDevice(device, 'setColorTemperature', { colorTemp });

        _.assign(lanState, modeProxy, proxy);
    }

    if (colorRgbObj) {
        const arr = rgbToHsv(colorRgbObj.red, colorRgbObj.green, colorRgbObj.blue);
        hue = arr[0];
        saturation = arr[1];
        //解决zigbee五色灯设置颜色时没有亮度字段问题
        //Solve the problem that there is no brightness field when setting the color of zigbee five-color lamp
        let modeProxy = {};
        if (ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST.includes(uiid)) {
            modeProxy = controlDevice(device, 'setLightMode', { colorMode: 'rgb' });
        }

        const proxy = controlDevice(device, 'setColor', { hue, saturation });

        _.assign(lanState, modeProxy, proxy);
    }

    if (modeObj) {
        const modeMapObj: any = {
            colorTemperature: 'cct',
            color: 'rgb',
            whiteLight: 'white',
        };
        const modeValue = _.get(modeObj, ['lightMode', 'modeValue']);
        colorMode = modeMapObj[modeValue];
        const proxy = controlDevice(device, 'setLightMode', { colorMode });
        _.assign(lanState, proxy);
    }

    if (Object.keys(iHostState).length === 2 && brightnessObj && modeObj) {
        const proxy = controlDevice(device, 'setBrightness', { brightness: brightnessObj.brightness, mode: colorMode });

        _.assign(lanState, proxy);
        return lanState;
    }

    if (Object.keys(iHostState).length >= 2) {
        const proxy = controlDevice(device, 'setMultiLightControl', { brightness, colorTemp, hue, mode: colorMode, saturation });
        lanState = proxy;
    }

    logger.info('iHostStateToLanStateWebSocket----2', lanState);

    return lanState;
}

function lanStateToIHostState5(lanState: ILanState5) {
    const iHostState = {};

    const startTime = _.get(lanState, 'startTime', null);

    const endTime = _.get(lanState, 'endTime', '');

    const oneKwh = _.get(lanState, 'oneKwh', null);

    if (startTime !== null && oneKwh !== null) {
        _.merge(iHostState, {
            'power-consumption': {
                powerConsumption: {
                    rlSummarize: endTime === '',
                    timeRange: {
                        start: startTime,
                        end: endTime,
                    },
                },
            },
        });
    }

    return iHostState;
}

function lanStateToIHostStateMonochromeLamp(lanState: ILanStateMonochromeLamp) {
    const iHostState = {};

    const switchState = _.get(lanState, 'switch', null);
    if (switchState !== null) {
        _.merge(iHostState, {
            power: {
                powerState: switchState,
            },
        });
    }

    // 同双色灯?（待定）
    const brightness = _.get(lanState, 'brightness', null);
    if (brightness !== null) {
        _.merge(iHostState, {
            brightness: {
                brightness,
            },
        });
    }

    return iHostState;
}

function iHostStateToLanStateMonochromeLamp(iHostState: IHostStateInterface) {
    const lanState = {};

    const powerState = _.get(iHostState, ['power', 'powerState'], null);
    if (powerState !== null) {
        _.merge(lanState, { switch: powerState });
    }

    // 控制亮度需要将 switch: 'on' 参数同时下发 (To control the brightness, you need to send the switch: 'on' parameter at the same time.)
    const brightness = _.get(iHostState, ['brightness', 'brightness'], null);
    if (brightness !== null) {
        _.merge(lanState, {
            brightness,
            switch: 'on',
        });
    }

    return lanState;
}

function lanStateToIHostStateBicolorLamp(lanState: ILanStateBicolorLamp) {
    const iHostState = {};

    const switchState = _.get(lanState, 'switch', null);
    if (switchState !== null) {
        _.merge(iHostState, {
            power: {
                powerState: switchState,
            },
        });
    }

    /**
     * uiid 7008 同步时获取到的亮度字段为：cctBrightness (uiid 7008 The brightness field obtained during synchronization is: cctBrightness)
     * sse 同步亮度消息时字段为：brightness (When sse synchronizes brightness messages, the field is: brightness)
     */
    const brightness = _.get(lanState, 'brightness', null) ?? _.get(lanState, 'cctBrightness', null);
    if (brightness !== null) {
        _.merge(iHostState, {
            brightness: {
                brightness,
            },
        });
    }

    const colorTemp = _.get(lanState, 'colorTemp', null);
    if (colorTemp !== null && colorTemp >= 0 && colorTemp <= 100) {
        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: colorTemp,
            },
        });
    }

    return iHostState;
}

function iHostStateToLanStateBicolorLamp(iHostState: IHostStateInterface) {
    const lanState = {};

    const powerState = _.get(iHostState, ['power', 'powerState'], null);
    if (powerState !== null) {
        _.merge(lanState, { switch: powerState });
    }

    // 控制亮度需要将 switch: 'on' 参数同时下发 (To control the brightness, you need to send the switch: 'on' parameter at the same time.)
    const brightness = _.get(iHostState, ['brightness', 'brightness'], null);
    if (brightness !== null) {
        _.merge(lanState, {
            brightness,
            switch: 'on',
        });
    }

    // 控制色温需要将 switch: 'on' 参数同时下发 (To control color temperature, you need to send the switch: 'on' parameter at the same time.)
    const colorTemp = _.get(iHostState, ['color-temperature', 'colorTemperature'], null);
    if (colorTemp !== null) {
        _.merge(lanState, {
            colorTemp,
            switch: 'on',
        });
    }

    return lanState;
}

function lanStateToIHostStateFiveColorLamp(lanState: ILanStateFiveColorLamp, deviceId: string) {
    /**
     * zigbee-p 网关固件版本：1.7.1
     * 五色灯切换彩光模式时，需要将 hue 和 saturation 转换成 rgb，
     * zigbee-p gateway firmware version: 1.7.1
     * When the five-color lamp switches modes, no colorMode field sse is reported.
     * Obtain the current colorMode from cloud data when controlling the brightness of five-color lights,
     */
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    const iHostState = {};

    const switchState = _.get(lanState, 'switch', null);
    if (switchState !== null) {
        _.merge(iHostState, {
            power: {
                powerState: switchState,
            },
        });
    }

    const setBrightness = (brightness: number | null) => {
        !!brightness && _.merge(iHostState, { brightness: { brightness } });
    };

    // 如果五色灯在 zigbee-p 网关中无色温数据时会获取到 colorTemp: 65535 (If the five-color lamp has no color temperature data in the zigbee-p gateway, colorTemp: 65535 will be obtained.)
    const colorTemp = _.get(lanState, 'colorTemp', null);
    if (colorTemp !== null && colorTemp >= 0 && colorTemp <= 100) {
        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: colorTemp,
            },
        });
    }

    // 因为局域网只单独上报了saturation和hue,所以需要从拿云端数据补齐 (Because the LAN only reports saturation and hue separately, it needs to be supplemented with data from the cloud.)
    // 五色灯同步 saturation 取值范围 [0, 100] (Five-color light synchronization saturation value range [0, 100])
    const saturation = _.get(lanState, 'saturation', null);
    if (saturation !== null && saturation >= 0 && saturation <= 100) {
        const hue = _.get(eWeLinkDeviceData, ['itemData', 'params', 'hue'], null);
        if (hue !== null && hue >= 0 && hue <= 359) {
            const [red, green, blue] = hsvToRgb(hue, saturation);
            _.merge(iHostState, {
                'color-rgb': { red, green, blue },
            });
        }
    }

    // 五色灯同步 hue 取值范围 [0, 359] (Five-color lamp hue value range [0, 359])
    const hue = _.get(lanState, 'hue', null);
    if (hue !== null && hue >= 0 && hue <= 359) {
        const saturation = _.get(eWeLinkDeviceData, ['itemData', 'params', 'saturation'], null);
        const [red, green, blue] = hsvToRgb(hue, saturation ?? 100);
        _.merge(iHostState, {
            'color-rgb': { red, green, blue },
        });
    }
    // 取当前模式下的亮度 （Get the brightness in the current mode）
    const colorMode = _.get(lanState, 'colorMode', null);

    const cctBrightness = _.get(lanState, 'cctBrightness', null);
    if (cctBrightness !== null && (colorMode === 'cct' || colorMode === null)) {
        setBrightness(cctBrightness);
    }

    const rgbBrightness = _.get(lanState, 'rgbBrightness', null);
    if (rgbBrightness !== null && (colorMode === 'rgb' || colorMode === null)) {
        setBrightness(rgbBrightness);
    }

    return iHostState;
}

function lanStateToIHostStateWaterSensor(lanState: ILanStateWaterSensor) {
    const iHostState = {};

    const water = _.get(lanState, 'water', null);
    if (water !== null) {
        _.merge(iHostState, {
            detect: {
                detected: water === 1,
            },
        });
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

function lanStateToIHostStateSmokeDetector(lanState: ILanStateSmokeDetector) {
    const iHostState = {};

    const smoke = _.get(lanState, 'smoke', null);
    if (smoke !== null) {
        _.merge(iHostState, {
            detect: {
                detected: smoke === 1,
            },
        });
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

function lanStateToIHostStateTRV(lanState: ILanStateTrv, deviceId: string) {
    const iHostState = {};
    const eWelinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    const workModeMap: Record<ILanStateTrv['workMode'], TrvWorkMode> = {
        '0': TrvWorkMode.MANUAL,
        '1': TrvWorkMode.ECO,
        '2': TrvWorkMode.AUTO,
    };
    const workStateMap: Record<ILanStateTrv['workState'], TrvWorkState> = {
        '0': TrvWorkState.INACTIVE,
        '1': TrvWorkState.HEATING,
    };

    const workMode = _.get(lanState, 'workMode', null);
    if (workMode !== null && ['0', '1', '2'].includes(workMode)) {
        _.merge(iHostState, {
            thermostat: {
                'thermostat-mode': {
                    thermostatMode: workModeMap[workMode],
                },
            },
        });
    }

    const workState = _.get(lanState, 'workState', null);
    if (workState !== null && ['0', '1'].includes(workState)) {
        _.merge(iHostState, {
            thermostat: {
                'adaptive-recovery-status': {
                    adaptiveRecoveryStatus: workStateMap[workState],
                },
            },
        });
    }

    const curTargetTemp = _.get(lanState, 'curTargetTemp', null);
    const realWorkMode = workMode ?? _.get(eWelinkDeviceData, 'itemData.params.workMode', null);
    if (curTargetTemp !== null && realWorkMode !== null) {
        switch (realWorkMode) {
            case '0':
                _.merge(iHostState, { 'thermostat-target-setpoint': { 'manual-mode': { targetSetpoint: curTargetTemp / 10 } } });
                break;
            case '1':
                _.merge(iHostState, { 'thermostat-target-setpoint': { 'eco-mode': { targetSetpoint: curTargetTemp / 10 } } });
                break;
            case '2':
                _.merge(iHostState, { 'thermostat-target-setpoint': { 'auto-mode': { targetSetpoint: curTargetTemp / 10 } } });
                break;
        }
    }

    const manTargetTemp = _.get(lanState, 'manTargetTemp', null);
    if (manTargetTemp !== null) {
        _.merge(iHostState, { 'thermostat-target-setpoint': { 'manual-mode': { targetSetpoint: manTargetTemp / 10 } } });
    }

    const ecoTargetTemp = _.get(lanState, 'ecoTargetTemp', null);
    if (ecoTargetTemp !== null) {
        _.merge(iHostState, { 'thermostat-target-setpoint': { 'eco-mode': { targetSetpoint: ecoTargetTemp / 10 } } });
    }

    const autoTargetTemp = _.get(lanState, 'autoTargetTemp', null);
    if (autoTargetTemp !== null) {
        _.merge(iHostState, { 'thermostat-target-setpoint': { 'auto-mode': { targetSetpoint: autoTargetTemp / 10 } } });
    }

    const temperature = _.get(lanState, 'temperature', null);
    if (temperature !== null) {
        _.merge(iHostState, {
            temperature: { temperature: temperature / 10 },
        });
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

function iHostStateToLanStateTRV(iHostState: IHostStateInterface) {
    const lanState = {};

    const targetSetpoint = _.get(iHostState, ['thermostat-target-setpoint', 'manual-mode', 'targetSetpoint'], null);
    if (targetSetpoint !== null) {
        _.merge(lanState, {
            manTargetTemp: targetSetpoint * 10,
        });
    }

    const workModeMap: Record<TrvWorkMode, ILanStateTrv['workMode']> = {
        [TrvWorkMode.MANUAL]: '0',
        [TrvWorkMode.ECO]: '1',
        [TrvWorkMode.AUTO]: '2',
    };
    const workMode: null | TrvWorkMode = _.get(iHostState, ['thermostat', 'thermostat-mode', 'thermostatMode'], null);
    if (workMode !== null && [TrvWorkMode.MANUAL, TrvWorkMode.ECO, TrvWorkMode.AUTO].includes(workMode)) {
        _.merge(lanState, {
            workMode: workModeMap[workMode],
        });
    }

    return lanState;
}

function lanStateToIHostState57(lanState: ILanState57) {
    const iHostState = {};

    const powerState = _.get(lanState, 'state', null);

    if (powerState !== null) {
        _.merge(iHostState, {
            power: {
                powerState,
            },
        });
    }

    const channel0 = _.get(lanState, 'channel0', null);

    if (channel0 !== null) {
        _.merge(iHostState, {
            brightness: {
                brightness: percentTranslateToHundred(Number(channel0), [25, 255]),
            },
        });
    }

    return iHostState;
}

function lanStateToIHostState52(lanState: ILanState52) {
    const iHostState = {};

    const powerState = _.get(lanState, 'state', null);

    if (powerState !== null) {
        _.merge(iHostState, {
            power: {
                powerState,
            },
        });
    }

    const channel0 = _.get(lanState, 'channel0', null);

    if (channel0 !== null) {
        _.merge(iHostState, {
            brightness: {
                brightness: percentTranslateToHundred(Number(channel0), [25, 255]),
            },
        });
    }

    const channel1 = _.get(lanState, 'channel1', null);

    if (channel1 !== null) {
        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: 100 - percentTranslateToHundred(Number(channel1), [25, 255], false),
            },
        });
    }

    return iHostState;
}
function lanStateToIHostState11(lanState: ILanState11) {
    const iHostState = {};

    const percentage = _.get(lanState, 'setclose', null);

    if (percentage !== null) {
        _.merge(iHostState, {
            percentage: {
                percentage,
            },
        });
    }

    const motorTurn = _.get(lanState, 'switch', null); //0-电机停止；1-电机正传；2-电机反转 (0:Motor stops; 1:Motor forwards; 2:Motor reverses)
    const motorTurnObj = {
        pause: 'stop',
        on: 'open',
        off: 'close',
    };

    if (motorTurn !== null) {
        _.assign(iHostState, {
            'motor-control': {
                motorControl: motorTurnObj[motorTurn],
            },
        });
    }

    _.assign(iHostState, {
        //normal 表示正常模式（已校准），calibration 表示正在校准。默认校准
        //normal Indicates normal mode (calibrated），calibration Indicates calibration is in progress。Default calibration
        'motor-clb': {
            motorClb: 'normal',
        },
    });

    return iHostState;
}

function lanStateToIHostState130(lanState: ILanState130) {
    const iHostState = {};

    logger.info('lanState----------------130', lanState);
    const unitValue = 1;
    const channelList: number[] = [0, 1, 2, 3];
    channelList.forEach((channel: number) => {
        const name = channel + 1;

        const current = _.get(lanState, `current_0${channel}`, null);
        if (current !== null) {
            _.assign(iHostState, {
                'toggle-electric-current': {
                    [name]: {
                        electricCurrent: toIntNumber(current * unitValue),
                    },
                },
            });
        }

        const voltage = _.get(lanState, `voltage_0${channel}`, null);
        if (voltage !== null) {
            _.assign(iHostState, {
                'toggle-voltage': {
                    [name]: {
                        voltage: toIntNumber(voltage * unitValue),
                    },
                },
            });
        }

        const actPow = _.get(lanState, `actPow_0${channel}`, null);
        if (actPow !== null) {
            _.merge(iHostState, {
                'toggle-electric-power': {
                    [name]: {
                        activePower: toIntNumber(actPow * unitValue),
                    },
                },
            });
        }
        const apparentPow = _.get(lanState, `apparentPow_0${channel}`, null);
        if (apparentPow !== null) {
            _.merge(iHostState, {
                'toggle-electric-power': {
                    [name]: {
                        apparentPower: toIntNumber(apparentPow * unitValue),
                    },
                },
            });
        }
        const reactPow = _.get(lanState, `reactPow_0${channel}`, null);
        if (reactPow !== null) {
            _.merge(iHostState, {
                'toggle-electric-power': {
                    [name]: {
                        reactivePower: toIntNumber(reactPow * unitValue),
                    },
                },
            });
        }

        const startTime = _.get(lanState, `startTime_0${channel}`, null);

        const endTime = _.get(lanState, `endTime_0${channel}`, '');

        if (startTime !== null) {
            _.merge(iHostState, {
                'toggle-power-consumption': {
                    [name]: {
                        rlSummarize: endTime === '',
                        timeRange: {
                            start: startTime,
                            end: endTime,
                        },
                    },
                },
            });
        }
    });

    logger.info('iHostState------------130', iHostState);

    return iHostState;
}

function iHostStateToLanState130(iHostState: IHostStateInterface, deviceId: string) {
    const lanState = {};

    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    const { devices } = initDeviceList([eWeLinkDeviceData] as any);
    const device = devices[0];

    if (!device) {
        return {};
    }

    if (_.isEmpty(iHostState)) {
        return {};
    }

    const toggleIdentifyObj = _.get(iHostState, ['toggle-identify']);
    if (toggleIdentifyObj) {
        //通道索引（Channel index）
        const name = Object.keys(_.get(iHostState, ['toggle-identify']))[0];

        const channelIndex = Number(name) - 1;
        const proxy = controlDevice(device, 'refreshPowerInfo', { outlet: channelIndex });

        _.assign(lanState, proxy);
    }

    return lanState;
}

function lanStateToIHostStateMultiPress(lanState: ILanStateMultiPress) {
    const iHostState = {};

    // 无线按键：0单击，1双击，2长按
    // Wireless buttons: 0 click, 1 double click, 2 long press
    const BUTTON_PRESS_MAP = {
        0: 'singlePress',
        1: 'doublePress',
        2: 'longPress',
    };
    const outlet = _.get(lanState, 'outlet', null);

    const pressKey = _.get(lanState, 'key', null);

    if (pressKey !== null && outlet !== null) {
        _.merge(iHostState, {
            'multi-press': {
                [outlet + 1]: {
                    press: BUTTON_PRESS_MAP[pressKey],
                },
            },
        });
    }

    return iHostState;
}

export {
    lanStateToIHostStatePowerDevice,
    lanStateToIHostStateLight,
    iHostStateToLanStateLight,
    iHostStateToLanState44,
    lanStateToIHostState44,
    lanStateToIHostState181And15,
    iHostStateToLanState15,
    lanStateToIHostState126And165,
    iHostStateToLanState126And165,
    lanStateToIHostState34,
    iHostStateToLanState34,
    iHostStateToLanState28,
    lanStateToIHostState28,
    lanStateToIHostStateButton,
    lanStateToIHostStateContactSensor,
    lanStateToIHostStateContactSensorWithTamperAlert,
    lanStateToIHostStateCurtain,
    iHostStateToLanStateCurtain,
    lanStateToIHostStateTemAndHum,
    lanStateToIHostStateMotionSensor,
    lanStateToIHostStateMotionSensor7002,
    lanStateToIHostStatePersonExist,
    lanStateToIHostState22,
    lanStateToIHostState102,
    lanStateToIHostState154,
    lanStateToIHostState36,
    lanStateToIHostState173And137,
    lanStateToIHostState59,
    iHostStateToLanStateWebSocket,
    lanStateToIHostState5,
    lanStateToIHostStateMonochromeLamp,
    iHostStateToLanStateMonochromeLamp,
    lanStateToIHostStateBicolorLamp,
    iHostStateToLanStateBicolorLamp,
    lanStateToIHostStateFiveColorLamp,
    lanStateToIHostStateWaterSensor,
    lanStateToIHostStateSmokeDetector,
    lanStateToIHostStateTRV,
    iHostStateToLanStateTRV,
    lanStateToIHostState57,
    lanStateToIHostState52,
    lanStateToIHostState11,
    lanStateToIHostState130,
    iHostStateToLanState130,
    lanStateToIHostStateMultiPress,
};
