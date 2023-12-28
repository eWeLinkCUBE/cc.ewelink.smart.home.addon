"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDeviceList = void 0;
const constant_1 = require("../constant");
const uiidModule_1 = require("../uiidModule");
function initDeviceList(devices) {
    if (!devices || !devices.length) {
        return {
            devices: [],
            groups: []
        };
    }
    const deviceList = [];
    const groupList = [];
    devices.forEach(device => {
        if (constant_1.groupType.includes(device.itemType)) {
            groupList.push((0, uiidModule_1.initCloudGroup)(device));
        }
        else if (constant_1.deviceType.includes(device.itemType)) {
            deviceList.push((0, uiidModule_1.initCloudDevice)(device));
        }
    });
    return {
        devices: deviceList,
        groups: groupList
    };
}
exports.initDeviceList = initDeviceList;
