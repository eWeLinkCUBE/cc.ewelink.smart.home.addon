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
exports.other = void 0;
const store_1 = require("../../store");
const utils_1 = require("../../utils");
exports.other = {
    uploadQuestionnaire(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/utils/upload-questionnaire', 'POST', params);
        });
    },
    commonStatistics(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/utils/common-statistics', 'POST', params);
        });
    },
    getThirdPlatformAuthCode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/thirdparty/oauth-code', 'POST', params, (0, store_1.getAt)());
        });
    },
    getUploadFileS3PreSignUrl(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/utils/upload-s3', 'POST', params, (0, store_1.getAt)());
        });
    },
    eventTracking(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/utils/event-tracking', 'POST', params, (0, store_1.getAt)());
        });
    },
    getCity(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`/v2/utils/city?location=${encodeURIComponent(params.location)}&langTag=${params.langTag}`, 'GET', null, (0, store_1.getAt)());
        });
    },
    getCityInfo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/v2/utils/city-info?cityId=${params.cityId}`;
            if (params.geo) {
                url += `&geo=${encodeURIComponent(params.geo)}`;
            }
            if (params.days) {
                url += `&days=${params.days}`;
            }
            return yield (0, utils_1.sendRequest)(url, 'GET', null, (0, store_1.getAt)());
        });
    }
};
