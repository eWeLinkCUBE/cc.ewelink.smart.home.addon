import { decode } from 'js-base64';
import deviceDataUtil from '../../utils/deviceDataUtil';
import _ from 'lodash';
import updateLanDeviceData from './updateLanDeviceData';
import logger from '../../log';
import { Request } from 'express';
import { IReqData } from '../../ts/interface/IReqData';
import { IHostStateInterface } from '../../ts/interface/IHostState';
import EventEmitter from 'events';
import EUiid from '../../ts/enum/EUiid';
import ECapability from '../../ts/enum/ECapability';
import getState126And165 from './getState126And165';
import { SINGLE_PROTOCOL_LIST, ZIGBEE_UIID_DEVICE_LIST } from '../../const';

//遇到问题：多个多通道设备作为场景执行动作时，只会执行最后一个
//原因：延时等待ihost请求一个一个来之后发送给设备，导致最后一个设备请求会覆盖前一个的请求。
//解决：一个设备对应一个定时器，防止互相影响

//Encountered a problem: When multiple multi-channel devices perform actions as a scene, only the last one will be executed.
//Reason: Delay waiting for ihost requests to come one by one before sending them to the device, causing the last device request to overwrite the previous request.
//Solution: One device corresponds to a timer to prevent mutual influence.

const event = new EventEmitter();
event.setMaxListeners(0);

// let timeout: any = null;
/** {'deviceId1':{toggle:1:{toggleState:'on'}}
 * {'deviceId2':{toggle:1:{toggleState:'on'}}}
 * 对象里装有各个设备的多个通道state的集合 (The object contains a collection of multiple channel states for each device.)*/
const deviceObj: any = {};

const deviceTimeoutObj: any = {};

//控制设备 (Control device)
export default async function controlLanDevice(req: Request) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;

    try {
        const iHostState = payload.state;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, devicekey, selfApikey, uiid } = iHostDeviceData;

        if (!uiid) {
            logger.error('control device can not get uiid------------------------', uiid);
            return;
        }
        let request: any;

        if (SINGLE_PROTOCOL_LIST.includes(uiid)) {
            request = updateLanDeviceData.setSwitch;
        } else {
            if ([EUiid.uiid_130].includes(uiid)) {
                request = updateLanDeviceData.spmSubDeviceControl
            } else {
                request = updateLanDeviceData.setSwitches;
            }
        }

        if (iHostState[ECapability.TOGGLE_IDENTIFY]) {
            request = updateLanDeviceData.spmSubDeviceUiActive
        }

        if (isLightControl(iHostState)) {
            request = updateLanDeviceData.setDimmable;
        }

        if ([EUiid.uiid_28].includes(uiid)) {
            request = updateLanDeviceData.setRfButton;
        }

        //zigbee-p子设备控制 (Zigbee p sub-device control)
        if (ZIGBEE_UIID_DEVICE_LIST.includes(uiid)) {
            request = updateLanDeviceData.subDeviceControl;
        }

        // eslint-disable-next-line no-inner-declarations
        async function send(deviceId: string) {
            const lanState = deviceDataUtil.iHostStateToLanState(deviceId, deviceObj[deviceId]);

            if (!lanState) return;

            if (uiid === EUiid.uiid_34) {
                const lanStateObj = JSON.parse(lanState);
                if (_.get(lanStateObj, ['light']) && _.get(lanStateObj, 'fan', null) || _.get(lanStateObj, 'speed', null)) {
                    const lightLanState = _.pick(lanStateObj, ['light']);
                    const resData1 = await updateLanDeviceData.setLight(deviceId, devicekey, selfApikey, JSON.stringify(lightLanState));
                    if (resData1 && resData1.error !== 0) {
                        throw new Error(JSON.stringify(resData1));
                    }

                    await sleepMs(1000);
                    const fanLanState = _.pick(lanStateObj, ['fan', 'speed']);
                    const resData2 = await updateLanDeviceData.setFan(deviceId, devicekey, selfApikey, JSON.stringify(fanLanState));
                    if (resData2 && resData2.error !== 0) {
                        throw new Error(JSON.stringify(resData2));
                    }
                    deviceObj[deviceId] = {};
                    return resData2;
                }
            }

            if (uiid === EUiid.uiid_34) {
                const lanStateObj = JSON.parse(lanState);

                if (_.get(lanStateObj, ['light'])) {
                    const lightLanState = _.pick(lanStateObj, ['light']);
                    const resData = await updateLanDeviceData.setLight(deviceId, devicekey, selfApikey, JSON.stringify(lightLanState));
                    if (resData && resData.error !== 0) {
                        throw new Error(JSON.stringify(resData));
                    }
                    return resData;
                }

                if (_.get(lanStateObj, 'fan') || _.get(lanStateObj, 'speed', null)) {
                    const fanLanState = _.pick(lanStateObj, ['fan', 'speed']);
                    const resData = await updateLanDeviceData.setFan(deviceId, devicekey, selfApikey, JSON.stringify(fanLanState));
                    if (resData && resData.error !== 0) {
                        throw new Error(JSON.stringify(resData));
                    }
                    deviceObj[deviceId] = {};
                    return resData;
                }
            }

            //模式不对时不给控制，防止损害设备 (No control is provided when the mode is incorrect to prevent damage to the equipment.)
            if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
                const lanState126And165 = await getState126And165(deviceId);

                const workMode = _.get(lanState126And165, 'workMode', null);

                if ([null, 3].includes(workMode)) {
                    return createFailResModeError(message_id);
                }

                if (_.get(iHostState, ECapability.TOGGLE)) {
                    if (workMode === 2) {
                        logger.info('no right mode', workMode);
                        return createFailResModeError(message_id);
                    }
                }

                if (_.get(iHostState, ECapability.MOTOR_CONTROL) || _.get(iHostState, ECapability.PERCENTAGE)) {
                    if (workMode === 1) {
                        logger.info('no right mode', workMode);
                        return createFailResModeError(message_id);
                    }
                }
            }

            const resData = await request(deviceId, devicekey, selfApikey, lanState);
            deviceObj[deviceId] = {};
            if (resData && resData.error !== 0) {
                logger.info('control device fail------ ', deviceId, resData);
            }
            return resData;
        }

        //多通道控制和灯能力控制时，将控制整合起来发送 (When controlling multi-channels and lamp capabilities, the controls are integrated and sent.)
        if (isNeedMerge(iHostState)) {
            return await toCollectToggle(iHostState, send, message_id, deviceId);
        } else {
            const lanStateString = deviceDataUtil.iHostStateToLanState(deviceId, iHostState);
            if (!lanStateString) {
                throw new Error('null');
            }
            const lanState = JSON.parse(lanStateString);
            //uiid 15 恒温恒湿改装件处于自动模式，不能控制 (uiid 15 constant temperature and humidity modification is in automatic mode and cannot be controlled)
            if (uiid === EUiid.uiid_15) {
                if (isWrongModeToControl(deviceId)) {
                    return createFailResModeError(message_id);
                }
            }

            if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
                if (_.get(lanState, 'motorTurn', null) !== null) {
                    const motorTurnLanState = _.pick(lanState, ['motorTurn']);
                    const resData = await updateLanDeviceData.setCurtainMotorTurn(deviceId, devicekey, selfApikey, JSON.stringify(motorTurnLanState));
                    if (resData && resData.error !== 0) {
                        throw new Error(JSON.stringify(resData));
                    }
                    return createSuccessRes(message_id);
                }

                if (_.get(lanState, 'location', null)) {
                    const locationLanState = _.pick(lanState, ['location']);
                    const resData = await updateLanDeviceData.setCurtainLocation(deviceId, devicekey, selfApikey, JSON.stringify(locationLanState));
                    if (resData && resData.error !== 0) {
                        throw new Error(JSON.stringify(resData));
                    }
                    return createSuccessRes(message_id);
                }
            }

            const resData = await request(deviceId, devicekey, selfApikey, lanStateString);

            if (EUiid.uiid_28 === uiid && resData.error === 400) {
                return createFailResNoLearn(message_id);
            }
            if (resData && resData.error !== 0) {
                throw new Error(JSON.stringify(resData));
            }
            //控制失败 control failure
            if (!resData) {
                return createFailRes(message_id);
            }

            return createSuccessRes(message_id);
        }
    } catch (error: any) {
        return createFailRes('');
    }
}

//等待请求，一起发送 （Wait for the request and send it together送）
async function sendParams(callback: any, iHostState: any, send: any, deviceId: string) {
    if (deviceTimeoutObj[deviceId]) {
        clearTimeout(deviceTimeoutObj[deviceId]);
    }
    event.once('delivered', callback);
    deviceTimeoutObj[deviceId] = setTimeout(async () => {
        const sendRes = await send(deviceId);
        let res: any = createFailRes('');
        if (sendRes && sendRes.error === 0) {
            res = createSuccessRes('')
        }

        event.emit('delivered', res);
    }, 200);
}
//收集通道  (collection channel)
async function toCollectToggle(iHostState: any, send: any, message_id: string, deviceId: string) {
    if (deviceObj[deviceId]) {
        _.merge(deviceObj[deviceId], iHostState);
    } else {
        deviceObj[deviceId] = iHostState;
    }
    return new Promise((resolve) => {
        const callback = (res: any) => {
            const newRes = _.cloneDeep(res);
            newRes.event.header.message_id = message_id;
            resolve(newRes);
        };
        sendParams(callback, iHostState, send, deviceId);
    });
}

function createSuccessRes(message_id: string) {
    return {
        event: {
            header: {
                name: 'UpdateDeviceStatesResponse',
                message_id,
                version: '1',
            },
            payload: {},
        },
    };
}

function createFailRes(message_id: string) {
    return {
        event: {
            header: {
                name: 'ErrorResponse',
                message_id,
                version: '1',
            },
            payload: {
                type: 'ENDPOINT_UNREACHABLE',
            },
        },
    };
}

function createFailResNoLearn(message_id: string) {
    return {
        event: {
            header: {
                name: 'ErrorResponse',
                message_id,
                version: '1',
            },
            payload: {
                type: 'REMOTE_KEY_CODE_NOT_LEARNED',
            },
        },
    };
}

function createFailResModeError(message_id: string) {
    return {
        event: {
            header: {
                name: 'ErrorResponse',
                message_id,
                version: '1',
            },
            payload: {
                type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
            },
        },
    };
}
function isLightControl(iHostState: IHostStateInterface) {
    return [ECapability.BRIGHTNESS, ECapability.COLOR_TEMPERATURE, ECapability.COLOR_RGB].some((ability) => _.get(iHostState, [ability]));
}

// 是否需要合并参数一起发送,有些能力需要一起下发
// Do you need to combine parameters and send them together? Some capabilities need to be sent together.
function isNeedMerge(iHostState: IHostStateInterface) {
    return [ECapability.BRIGHTNESS, ECapability.COLOR_TEMPERATURE, ECapability.COLOR_RGB, ECapability.TOGGLE, ECapability.MODE].some((ability) => _.get(iHostState, [ability]));
}
// uiid15温控器处于自动模式时，不能发送控制命令
// When the Uiid15 thermostat is in automatic mode, it cannot send control commands.
function isWrongModeToControl(deviceId: string) {
    const lanState = deviceDataUtil.getLastLanState(deviceId);
    const deviceType = _.get(lanState, 'deviceType', null);

    //自动模式 (automatic mode)
    if (deviceType !== null) {
        return deviceType !== 'normal';
    }
    return false;
}
/** 等待时间 单位 ms (Waiting time unit ms) */
function sleepMs(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('');
        }, ms);
    });
}
