"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.device = void 0;
const store_1 = require("../../store");
const utils_1 = require("../../utils");
exports.device = {
    getThingList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/thing', 'GET', params ? params : {}, (0, store_1.getAt)());
        });
    },
    getSpecThingList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/thing', 'POST', params, (0, store_1.getAt)());
        });
    },
    getThingStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/thing/status', 'GET', params, (0, store_1.getAt)());
        });
    },
    updateThingStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/thing/status', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateMultiThingStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/thing/batch-status', 'POST', params, (0, store_1.getAt)());
        });
    },
    addWifiDevice(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/add', 'POST', params, (0, store_1.getAt)());
        });
    },
    addGsmDevice(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/add-gsm', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateDeviceInfo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/update-info', 'POST', params, (0, store_1.getAt)());
        });
    },
    delDevice(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`/v2/device?deviceid=${params.deviceid}`, 'DELETE', null, (0, store_1.getAt)());
        });
    },
    updateDeviceTag(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/tags', 'POST', params, (0, store_1.getAt)());
        });
    },
    getGroupList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/group', 'GET', params ? params : {}, (0, store_1.getAt)());
        });
    },
    addGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/group', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/group', 'PUT', params, (0, store_1.getAt)());
        });
    },
    delGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`/v2/device/group?id=${params.id}`, 'DELETE', params, (0, store_1.getAt)());
        });
    },
    updateGroupStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/group/status', 'POST', params, (0, store_1.getAt)());
        });
    },
    getAlarmHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/alarm-history', 'GET', params, (0, store_1.getAt)());
        });
    },
    addGroupDevice(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/group/add', 'POST', params, (0, store_1.getAt)());
        });
    },
    delGroupDevice(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/group/delete', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateGroupList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/group/update', 'POST', params, (0, store_1.getAt)());
        });
    },
    shareDevice(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/share', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateSharePermit(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/share/permit', 'POST', params, (0, store_1.getAt)());
        });
    },
    cancelShare(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/share', 'DELETE', params, (0, store_1.getAt)());
        });
    },
    getHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/history', 'GET', params, (0, store_1.getAt)());
        });
    },
    delHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/history', 'DELETE', params, (0, store_1.getAt)());
        });
    },
    getOtaInfo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/ota/query', 'POST', params, (0, store_1.getAt)());
        });
    },
    addThirdPartyDevice(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/inherit/add-partner-device', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateDeviceSettings(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/settings', 'POST', params, (0, store_1.getAt)());
        });
    },
    getDeviceUsage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/device-usage', 'GET', params, (0, store_1.getAt)());
        });
    },
    getTempHumHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/temp-hum-history', 'GET', params, (0, store_1.getAt)());
        });
    },
    getMatterNodesReachableHubs(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/device/matter/nodes/reachable-hubs', 'GET', params, (0, store_1.getAt)());
        });
    }
};
