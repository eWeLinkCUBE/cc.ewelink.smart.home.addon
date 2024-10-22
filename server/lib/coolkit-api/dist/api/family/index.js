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
exports.family = void 0;
const store_1 = require("../../store");
const utils_1 = require("../../utils");
exports.family = {
    getFamilyList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family', 'GET', params, (0, store_1.getAt)());
        });
    },
    addFamily(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family', 'POST', params, (0, store_1.getAt)());
        });
    },
    addRoom(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/room', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateFamily(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family', 'PUT', params, (0, store_1.getAt)());
        });
    },
    updateRoom(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/room', 'PUT', params, (0, store_1.getAt)());
        });
    },
    sortRoom(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/room/index', 'POST', params, (0, store_1.getAt)());
        });
    },
    delFamily(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`/v2/family?id=${params.id}`, 'DELETE', params, (0, store_1.getAt)());
        });
    },
    delRoom(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`/v2/family/room?id=${params.id}`, 'DELETE', params, (0, store_1.getAt)());
        });
    },
    sortThing(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/thing/sort', 'POST', params, (0, store_1.getAt)());
        });
    },
    setThing(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/room/thing', 'POST', params, (0, store_1.getAt)());
        });
    },
    changeFamily(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/current', 'POST', params, (0, store_1.getAt)());
        });
    },
    addShareFamily(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/share', 'POST', params, (0, store_1.getAt)());
        });
    },
    delShareFamily(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/family/share', 'DELETE', params, (0, store_1.getAt)());
        });
    }
};
