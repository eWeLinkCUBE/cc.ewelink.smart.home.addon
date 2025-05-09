import _ from "lodash";
import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import deviceDataUtil from "../../../../utils/deviceDataUtil";

export default function iHostStateToLanState126And165(iHostState: IHostStateInterface, deviceId: string, isWebSocket: boolean) {
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