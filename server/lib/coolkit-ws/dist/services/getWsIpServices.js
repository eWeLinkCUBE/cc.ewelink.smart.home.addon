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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function getWsIpServices(region, useTestEnv) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let url = useTestEnv ? `https://test-dispa.coolkit.cn/dispatch/app` : `https://${region}-dispa.coolkit.${region === 'cn' ? 'cn' : 'cc'}/dispatch/app`;
            const res = yield axios_1.default.get(url);
            return res.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.log("CK_WS: 获取长连接ip地址报错：", error.message);
            }
            else {
                console.log("CK_WS: 获取长连接ip地址报错：", error);
            }
            return {
                error: 500,
                reason: "get dispatch address error",
                domain: "",
                IP: "",
                port: 0
            };
        }
    });
}
exports.default = getWsIpServices;
