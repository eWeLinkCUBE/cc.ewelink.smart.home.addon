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
exports.user = void 0;
const utils_1 = require("../../utils");
const store_1 = require("../../store");
function configDomain(code) {
    const domain = (0, utils_1.getDomainByCountryCode)(code);
    if (domain === '') {
        return false;
    }
    else {
        (0, store_1.setDomain)(domain);
        return true;
    }
}
exports.user = {
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!configDomain(params.countryCode)) {
                return {
                    error: 91001,
                    msg: '无效的国家码',
                };
            }
            const { error, msg, data } = yield (0, utils_1.sendRequest)('/v2/user/login', 'POST', params);
            if (error === 0) {
                const { at, rt } = data;
                (0, store_1.setAt)(at);
                (0, store_1.setRt)(rt);
            }
            return {
                error,
                msg,
                data,
            };
        });
    },
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield (0, utils_1.sendRequest)('/v2/user/logout', 'DELETE', null, (0, store_1.getAt)());
            if (ret.error === 0) {
                (0, store_1.setAt)('');
                (0, store_1.setRt)('');
            }
            return ret;
        });
    },
    changePwd(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/change-pwd', 'POST', params, (0, store_1.getAt)());
        });
    },
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/profile', 'GET', null, (0, store_1.getAt)());
        });
    },
    updateProfile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/profile', 'POST', params, (0, store_1.getAt)());
        });
    },
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, msg, data } = yield (0, utils_1.sendRequest)('/v2/user/refresh', 'POST', { rt: (0, store_1.getRt)() }, (0, store_1.getAt)());
            if (error === 0) {
                const { at, rt } = data;
                (0, store_1.setAt)(at);
                (0, store_1.setRt)(rt);
            }
            return {
                error,
                msg,
                data,
            };
        });
    },
    register(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!configDomain(params.countryCode)) {
                return {
                    error: 91001,
                    msg: '无效的国家码',
                };
            }
            const { error, msg, data } = yield (0, utils_1.sendRequest)('/v2/user/register', 'POST', params);
            if (error === 0) {
                const { at, rt } = data;
                (0, store_1.setAt)(at);
                (0, store_1.setRt)(rt);
            }
            return {
                error,
                msg,
                data,
            };
        });
    },
    sendVerificationCode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/verification-code', 'POST', params);
        });
    },
    smsLogin(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!configDomain(params.countryCode)) {
                return {
                    error: 91001,
                    msg: '无效的国家码',
                };
            }
            const { error, msg, data } = yield (0, utils_1.sendRequest)('/v2/user/sms-login', 'POST', params);
            if (error === 0) {
                const { at, rt } = data;
                (0, store_1.setAt)(at);
                (0, store_1.setRt)(rt);
            }
            return {
                error,
                msg,
                data,
            };
        });
    },
    resetPwd(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, msg, data } = yield (0, utils_1.sendRequest)('/v2/user/reset-pwd', 'POST', params);
            if (error === 0) {
                const { at, rt } = data;
                (0, store_1.setAt)(at);
                (0, store_1.setRt)(rt);
            }
            return {
                error,
                msg,
                data,
            };
        });
    },
    closeAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/close-account', 'POST', params);
        });
    },
    verifyAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/user-verify', 'POST', params);
        });
    },
    trialMembership(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/trial-membership', 'POST', params);
        });
    },
    getQrCode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/qr-code', 'POST', params);
        });
    },
    getQrCodeStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/qr-code/status', 'POST', params);
        });
    },
    getCastList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/cast/list', 'GET', null, (0, store_1.getAt)());
        });
    },
    addCast(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/cast', 'POST', params, (0, store_1.getAt)());
        });
    },
    castLogin(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!configDomain(params.countryCode)) {
                return {
                    error: 91001,
                    msg: '无效的国家码',
                };
            }
            const { error, msg, data } = yield (0, utils_1.sendRequest)('/v2/user/client/cast/login', 'POST', params);
            if (error === 0) {
                const { at, rt } = data;
                (0, store_1.setAt)(at);
                (0, store_1.setRt)(rt);
            }
            return {
                error,
                msg,
                data,
            };
        });
    },
    editCast(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/cast', 'PUT', params, (0, store_1.getAt)());
        });
    },
    removeCast(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/cast', 'DELETE', params, (0, store_1.getAt)());
        });
    },
    editMultiCast(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/user/casts', 'PUT', params, (0, store_1.getAt)());
        });
    },
};
