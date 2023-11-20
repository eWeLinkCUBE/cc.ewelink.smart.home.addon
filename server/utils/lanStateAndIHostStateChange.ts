import {
    ILanStateSwitch,
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
} from '../ts/interface/ILanState';
import { IHostStateInterface } from '../ts/interface/IHostState';
import _ from 'lodash';
import deviceDataUtil from './deviceDataUtil';
import logger from '../log';
import EUiid from '../ts/enum/EUiid';

//对 uiid 190 特殊处理 (Special handling for uiid 190)
function lanStateToIHostState190And182(lanState: ILanState190, uiid: number) {
    const iHostState = {};
    const power = _.get(lanState, 'power', null); //功率 (power)
    //是否要乘以100，有些局域网参数会乘100再上报 (Do you want to multiply by 100? Some LAN parameters will be multiplied by 100 before reporting.)
    const unitValue = uiid === EUiid.uiid_190 ? 1 : 100;
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
            ctValue = ((ctValue / 255) * 100).toFixed(0);
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
            ct = Number(((ct / 100) * 255).toFixed(0));
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
// 将字符串变成整数类型,num代表小数点几位
// Convert the string into an integer type, num represents the number of decimal points
function toIntNumber(value: string | number, num = 0) {
    return Number(Number(value).toFixed(num));
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

function iHostStateToLanState126And165(iHostState: IHostStateInterface) {
    const lanState = {};

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

function iHostStateToLanState28(iHostState: IHostStateInterface) {
    const lanState = {};
    const pressObj = _.get(iHostState, ['press']);
    if (pressObj) {
        _.assign(lanState, {
            rfChl: Number(pressObj.press),
        });
    }
    return lanState;
}
//rfTrig20: '2023-05-17T02:35:34.000Z',
function lanStateToIHostState28(lanState: ILanState28, actions: string[]) {
    const iHostState = {};

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
                battery,
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
                battery,
            },
        });
    }

    return iHostState;
}

function lanStateToIHostStateCurtain(lanState: ILanStateCurtain, uiid: EUiid.uiid_7006 | EUiid.uiid_7015) {
    const iHostState = {};

    const curPercent = _.get(lanState, 'curPercent', null);

    if (curPercent !== null) {
        _.merge(iHostState, {
            percentage: {
                percentage: curPercent,
            },
        });
    }

    const motorClb = _.get(lanState, 'motorClb', null);

    if (motorClb !== null) {
        _.merge(iHostState, {
            'motor-clb': {
                motorClb,
            },
        });
    }

    /**
     * 7015 校准常态异常，未校准时上报 motorClb: normal 且 curPercent: 255 (7015 Calibration normal is abnormal. When not calibrated, motorClb: normal and curPercent: 255 are reported.)
     * 当 7015 curPercent = 255 时，同步为未校准状态 (When 7015 curPercent = 255, synchronization is uncalibrated)
     */
    if (uiid === EUiid.uiid_7015 && curPercent === 255) {
        _.merge(iHostState, {
            'motor-clb': {
                motorClb: 'calibration',
            },
        });
    }

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
                battery,
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
                battery,
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

export {
    lanStateToIHostState190And182,
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
    lanStateToIHostStateCurtain,
    iHostStateToLanStateCurtain,
    lanStateToIHostStateTemAndHum,
    lanStateToIHostStateMotionSensor,
    lanStateToIHostStatePersonExist,
};
