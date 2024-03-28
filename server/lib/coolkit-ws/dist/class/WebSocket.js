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
const getWsIpServices_1 = __importDefault(require("../services/getWsIpServices"));
const tools_1 = require("../utils/tools");
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const eventEmitter_1 = __importDefault(require("./../utils/eventEmitter"));
const enum_1 = require("../ts/enum");
class WebSocketService {
    constructor(config) {
        this.wsState = 'INIT';
        WebSocketService.connectConfig = config;
    }
    _initWs(ts) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.wsState = 'INIT';
                WebSocketService.initClose = false;
                WebSocketService.initTs = ts;
                const { region, useTestEnv = false } = WebSocketService.connectConfig;
                WebSocketService.listenerHook = (0, tools_1.getListenerHook)(WebSocketService.connectConfig);
                const dispatchAdd = yield (0, getWsIpServices_1.default)(region, useTestEnv);
                if (dispatchAdd.error !== 0) {
                    this.wsState = 'CLOSED';
                    resolve({
                        error: enum_1.EErrorCode.GET_WS_SERVER_ERROR,
                        msg: '网络连接有误，无法获取长连接地址',
                    });
                    return;
                }
                const port = (dispatchAdd === null || dispatchAdd === void 0 ? void 0 : dispatchAdd.port) && typeof dispatchAdd.port === 'number' ? dispatchAdd.port : '8080';
                const ws = new isomorphic_ws_1.default(`wss://${dispatchAdd.domain}:${port}/api/ws`);
                WebSocketService.isReconnecting
                    ? eventEmitter_1.default.once(enum_1.EEventType.RECONNECT_STATUS, (ev) => {
                        WebSocketService.connectConfig.debug && console.log(`CK_WS: 重连结束，返回结果`);
                        resolve(ev);
                    })
                    : eventEmitter_1.default.once(`${ts}${WebSocketService.listenerHook}`, (ev) => {
                        ev.error === 0 && console.log('CK_WS: 连接成功');
                        if (ev.error !== 0) {
                            console.log('CK_WS: 长连接初始化失败');
                            !WebSocketService.isReconnecting && this.close();
                        }
                        resolve(ev);
                    });
                const { reqTimeout = 15000 } = WebSocketService.connectConfig;
                setTimeout(() => {
                    if (!WebSocketService.isOpen) {
                        !WebSocketService.isReconnecting && this.close();
                        resolve({
                            error: enum_1.EErrorCode.REQ_FAIL_OR_TIMEOUT,
                            msg: '请求超时',
                        });
                    }
                }, reqTimeout);
                ws.onclose = (ev) => this.onClose(ev);
                ws.onopen = (ev) => this.onOpen(ev, ts);
                ws.onerror = (ev) => this.onError(ev);
                ws.onmessage = (ev) => this.onMessage(ev, ts);
                WebSocketService.ws = ws;
            }));
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            WebSocketService.isOpen = false;
            WebSocketService.isReconnecting = true;
            WebSocketService.ws = null;
            WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval);
            const { debug = false, retryInterval = 5, maxRetry = 10 } = WebSocketService.connectConfig;
            for (; WebSocketService.retryCount < maxRetry;) {
                const retryCount = WebSocketService.retryCount + 1;
                if (!WebSocketService.isOpen && !WebSocketService.initClose) {
                    this.close();
                    console.log(`CK_WS: 长连接重连第 ${retryCount} 次`);
                    debug && console.log(`CK_WS: 长连接重连第 ${retryCount} 次开始 ${Date.now()}`);
                    const res = yield this._initWs(`${Date.now()}`);
                    debug && console.log(`CK_WS: 长连接重连第 ${retryCount} 次结束，${JSON.stringify(res, null, 4)}`);
                    if (res.error !== 0) {
                        this._onAllEventCallBack();
                        console.log(`CK_WS: 长连接重连第 ${retryCount} 次失败`, res.msg);
                        eventEmitter_1.default.emit(enum_1.EOpenEventType.RECONNECT, {
                            error: enum_1.EErrorCode.RECONNECT_FAIL,
                            data: {
                                totalTime: WebSocketService.reconnectTotalTime / 1000,
                                count: retryCount
                            }
                        });
                        WebSocketService.retryCount++;
                        if (retryCount + 1 > maxRetry) {
                            console.log(`CK_WS: 已达到最大重连次数，不再重连`);
                            eventEmitter_1.default.emit(enum_1.EOpenEventType.RECONNECT, {
                                error: enum_1.EErrorCode.RECONNECT_COUNT_EXCEEDED,
                                data: {
                                    totalTime: WebSocketService.reconnectTotalTime / 1000,
                                    count: retryCount
                                }
                            });
                        }
                        else {
                            console.log(`CK_WS: 等待第${retryCount + 1}次重连 ${Date.now()}`);
                        }
                        const actualInterval = this._getRetryInterval(retryInterval);
                        console.log(`SL : actualInterval:`, actualInterval);
                        WebSocketService.reconnectTotalTime = WebSocketService.reconnectTotalTime + actualInterval;
                        yield (0, tools_1.sleep)(actualInterval);
                        continue;
                    }
                }
                console.log(`CK_WS: 长连接重连第 ${retryCount} 次成功`);
                this._onAllEventCallBack();
                eventEmitter_1.default.emit(enum_1.EOpenEventType.RECONNECT, {
                    error: 0,
                    msg: 'success'
                });
                WebSocketService.reconnectTotalTime = 0;
                WebSocketService.retryCount = 0;
                break;
            }
            if (!WebSocketService.isOpen) {
                const errorMsg = {
                    error: enum_1.EErrorCode.INIT_FAIL,
                    msg: '长连接出现错误，重试失败，请尝试重新连接！',
                };
                WebSocketService.ws = null;
                WebSocketService.isReconnecting = false;
                eventEmitter_1.default.emit(enum_1.EEventType.RECONNECT, errorMsg);
            }
        });
    }
    onOpen(ev, ts) {
        return __awaiter(this, void 0, void 0, function* () {
            WebSocketService.connectConfig.debug && console.log('CK_WS: 长连接已开启');
            WebSocketService.isOpen && eventEmitter_1.default.emit(enum_1.EOpenEventType.OPEN, ev);
            yield WebSocketService._sendHandShakeMsg(ts);
        });
    }
    onError(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            WebSocketService.isOpen && eventEmitter_1.default.emit(enum_1.EOpenEventType.ERROR, ev);
            this.wsState = 'ERROR';
            if (!WebSocketService.isReconnecting) {
                console.log('CK_WS: 长连接出错，尝试重连');
                yield this.reconnect();
                return;
            }
            if (WebSocketService.isReconnecting) {
                WebSocketService.connectConfig.debug && console.log(`CK_WS: 长连接出错，本次重连失败`);
                eventEmitter_1.default.emit(enum_1.EEventType.RECONNECT_STATUS, {
                    error: enum_1.EErrorCode.RECONNECT_FAIL,
                    msg: 'reconnect error',
                });
            }
        });
    }
    onClose(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: 长连接已关闭`);
            WebSocketService.isOpen && eventEmitter_1.default.emit(enum_1.EOpenEventType.CLOSE, ev);
            this.wsState = 'CLOSED';
            if (WebSocketService.initClose) {
                console.log('CK_WS: 用户主动关闭');
                WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval);
                WebSocketService.initClose = false;
                return;
            }
            if (!WebSocketService.isReconnecting) {
                console.log('CK_WS: 长连接被动关闭，尝试重连');
                yield this.reconnect();
                return;
            }
            if (WebSocketService.isReconnecting) {
                WebSocketService.connectConfig.debug && console.log(`CK_WS: 长连接关闭，本次重连失败`);
                eventEmitter_1.default.emit(enum_1.EEventType.RECONNECT_STATUS, {
                    error: enum_1.EErrorCode.RECONNECT_COUNT_EXCEEDED,
                    msg: 'reconnect close',
                });
            }
        });
    }
    onMessage(ev, ts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { debug = false, heartBeatRatio = 90 } = WebSocketService.connectConfig;
            WebSocketService.isOpen && eventEmitter_1.default.emit(enum_1.EOpenEventType.MESSAGE, ev);
            const { data } = ev;
            debug && console.log(`CK_WS: 长连接接收消息: `, data);
            if (data === 'pong') {
                eventEmitter_1.default.emit(enum_1.EEventType.PING_PONG);
                return;
            }
            const decodedData = JSON.parse(data);
            if (decodedData.error === 0 && decodedData.config && decodedData.config.hb && ts) {
                console.log('CK_WS: 长连接握手成功');
                this.wsState = 'CONNECTED';
                WebSocketService.isOpen = true;
                let heartBeat = decodedData.config.hbInterval * 1000 * (Math.floor(heartBeatRatio) / 100);
                if (heartBeat === 0 || heartBeat > decodedData.config.hbInterval * 1000) {
                    heartBeat = decodedData.config.hbInterval * 1000 * 0.9;
                }
                WebSocketService.heartBeat = heartBeat;
                WebSocketService.sendMessage('ping');
                yield this._waitForPingPong();
                WebSocketService.hbInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    WebSocketService.sendMessage('ping');
                    yield this._waitForPingPong();
                }), heartBeat);
                if (WebSocketService.isReconnecting) {
                    eventEmitter_1.default.emit(enum_1.EEventType.RECONNECT_STATUS, {
                        error: 0,
                        msg: 'success',
                    });
                    WebSocketService.isReconnecting = false;
                    return;
                }
                eventEmitter_1.default.emit(`${ts}${WebSocketService.listenerHook}`, {
                    error: 0,
                    msg: 'success',
                });
                WebSocketService.isReconnecting = false;
                return;
            }
            if (decodedData.error !== 0 && decodedData.actionName === 'userOnline') {
                console.log('CK_WS: 长连接握手出错', decodedData.error);
                eventEmitter_1.default.emit(`${ts}${WebSocketService.listenerHook}`, {
                    error: decodedData.error,
                    msg: decodedData["reason"] ? decodedData["reason"] : 'webSocket handshake error',
                });
                return;
            }
            if ((decodedData.hasOwnProperty('error') && decodedData.deviceid) || decodedData.params) {
                const { sequence, deviceid } = decodedData;
                eventEmitter_1.default.emit(`${enum_1.EEventType.DEVICE_MSG}${sequence}${deviceid}`, decodedData);
            }
        });
    }
    static _sendHandShakeMsg(ts) {
        return __awaiter(this, void 0, void 0, function* () {
            let params;
            if (WebSocketService.connectConfig.userAgent === 'device') {
                const { userAgent, apikey, chipid, deviceid } = WebSocketService.connectConfig;
                params = {
                    action: 'register',
                    userAgent,
                    apikey,
                    deviceid,
                    d_seq: ts,
                };
                chipid && (params.chipid = chipid);
            }
            else {
                const { appid, userAgent, at, apikey } = WebSocketService.connectConfig;
                params = {
                    action: 'userOnline',
                    version: 8,
                    ts: (0, tools_1.createAppTs)(),
                    at,
                    userAgent,
                    apikey,
                    appid,
                    nonce: (0, tools_1.createNonce)(),
                    sequence: ts,
                };
            }
            WebSocketService.sendMessage(params);
        });
    }
    _waitForPingPong() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxTime = 1000 * 5;
            let timer = null;
            return new Promise((resolve) => {
                timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.reconnect();
                    resolve(1);
                }), maxTime);
                eventEmitter_1.default.once(enum_1.EEventType.PING_PONG, () => {
                    WebSocketService.connectConfig.debug && console.log(`CK_WS: 心跳正常 ${Date.now()}`);
                    timer && clearTimeout(timer);
                    resolve(1);
                });
            });
        });
    }
    _onAllEventCallBack() {
        for (const [name, cb] of WebSocketService.callBackStack.entries()) {
            eventEmitter_1.default.on(name, cb);
        }
    }
    _getRetryInterval(retryInterval) {
        const maxRetryInterval = WebSocketService.connectConfig.maxRetryInterval || WebSocketService.maxReconnectTime;
        const retryCount = WebSocketService.retryCount + 1;
        let interval = retryInterval;
        if (retryInterval < 5) {
            WebSocketService.connectConfig.debug && console.log("CK_WS: 设置重试间隔小于默认值5秒，更改为默认值，即5秒");
            interval = 5;
        }
        const userInterval = retryCount * interval * 1000;
        const maxInterval = maxRetryInterval * 1000;
        return userInterval >= maxInterval ? maxInterval : userInterval;
    }
    static sendMessage(params) {
        if (WebSocketService.ws && WebSocketService.ws.readyState === 1) {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: 长连接发送消息，时间点为：${Date.now()}， 参数为：`, params);
            if (typeof params === 'string') {
                WebSocketService.ws.send(params);
                return;
            }
            WebSocketService.ws.send(JSON.stringify(params));
        }
    }
    sendThing(deviceConfig, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deviceid, params, ownerApikey } = deviceConfig;
            const sequence = `${Date.now()}`;
            const notDevice = WebSocketService.connectConfig.userAgent !== 'device';
            let deviceParams = {
                action,
                deviceid,
                apikey: ownerApikey,
                userAgent: WebSocketService.connectConfig.userAgent,
                sequence,
                params,
            };
            if ((action === 'query' || action === 'update') && notDevice) {
                deviceParams.selfApikey = WebSocketService.connectConfig.apikey;
            }
            WebSocketService.sendMessage(deviceParams);
            return deviceParams;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (WebSocketService.ws) {
                WebSocketService.connectConfig.debug && console.log('CK_WS: 长连接已存在，不需要初始化');
                return {
                    error: 0,
                    msg: '长连接已存在，不需要初始化',
                };
            }
            return yield this._initWs(`${Date.now()}`);
        });
    }
    close(userInit = false) {
        try {
            eventEmitter_1.default.removeAllListeners();
            if (WebSocketService.ws && WebSocketService.ws.readyState === WebSocketService.ws.OPEN) {
                WebSocketService.connectConfig.debug && console.log('CK_WS: 长连接开始关闭');
                if (userInit) {
                    WebSocketService.connectConfig.debug && console.log('CK_WS: 本次关闭为用户主动调用close方法');
                    WebSocketService.initClose = true;
                }
                if (typeof window !== 'undefined') {
                    WebSocketService.ws.close();
                }
                else {
                    WebSocketService.ws.terminate();
                    WebSocketService.ws.removeAllListeners();
                }
                WebSocketService.ws = null;
                WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval);
                this.wsState = 'CLOSED';
            }
        }
        catch (error) {
            console.error('CK_WS: 长连接关闭报错 ==', error);
        }
    }
    send(params) {
        if (WebSocketService.ws) {
            WebSocketService.sendMessage(params);
        }
    }
    updateCallback(emitName, cb) {
        if (WebSocketService.ws) {
            WebSocketService.callBackStack.set(emitName, cb);
        }
    }
}
WebSocketService.initClose = false;
WebSocketService.isReconnecting = false;
WebSocketService.retryCount = 0;
WebSocketService.callBackStack = new Map();
WebSocketService.initTs = `${Date.now()}`;
WebSocketService.maxReconnectTime = 2 * 60;
WebSocketService.reconnectTotalTime = 0;
exports.default = WebSocketService;
