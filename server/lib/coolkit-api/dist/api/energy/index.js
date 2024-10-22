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
exports.energy = void 0;
const store_1 = require("../../store");
const utils_1 = require("../../utils");
var EnergyHost;
(function (EnergyHost) {
    EnergyHost["ENERGY_GROUP"] = "/v2/device/dem/group";
    EnergyHost["GET_ENERGY_DEVICES"] = "/v2/device/dem/query-energy-devices";
    EnergyHost["GET_ENERGY_DASHBOARD"] = "/v2/device/dem/query-energy";
})(EnergyHost || (EnergyHost = {}));
exports.energy = {
    getDeviceEnergyGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(EnergyHost.ENERGY_GROUP, 'GET', params, (0, store_1.getAt)());
        });
    },
    deleteDeviceEnergyGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`${EnergyHost.ENERGY_GROUP}?id=${params.id}`, 'DELETE', params, (0, store_1.getAt)());
        });
    },
    createDeviceEnergyGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(EnergyHost.ENERGY_GROUP, 'POST', params, (0, store_1.getAt)());
        });
    },
    updateDeviceEnergyGroup(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(EnergyHost.ENERGY_GROUP, 'PUT', params, (0, store_1.getAt)());
        });
    },
    getEnergyData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(EnergyHost.GET_ENERGY_DASHBOARD, 'POST', params, (0, store_1.getAt)());
        });
    },
    getEnergyDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(EnergyHost.GET_ENERGY_DEVICES, 'GET', null, (0, store_1.getAt)());
        });
    }
};
