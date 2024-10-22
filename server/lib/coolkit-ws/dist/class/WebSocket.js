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
                const { debug, region, useTestEnv = false } = WebSocketService.connectConfig;
                console.log(`CK_WS: wsState being initiated to INIT`);
                this.wsState = 'INIT';
                WebSocketService.initClose = false;
                WebSocketService.initTs = ts;
                WebSocketService.listenerHook = (0, tools_1.getListenerHook)(WebSocketService.connectConfig);
                const dispatchAdd = yield (0, getWsIpServices_1.default)(region, useTestEnv);
                if (dispatchAdd.error !== 0) {
                    console.log(`CK_WS: wsState being changed to CLOSED and error being: ${JSON.stringify(dispatchAdd)}`);
                    this.wsState = 'CLOSED';
                    resolve({
                        error: enum_1.EErrorCode.GET_WS_SERVER_ERROR,
                        msg: 'network connect error, can not access ws domain server',
                    });
                    return;
                }
                const port = (dispatchAdd === null || dispatchAdd === void 0 ? void 0 : dispatchAdd.port) && typeof dispatchAdd.port === 'number' ? dispatchAdd.port : '8080';
                const ws = new isomorphic_ws_1.default(`wss://${dispatchAdd.domain}:${port}/api/ws`);
                WebSocketService.isReconnecting
                    ? eventEmitter_1.default.on(`${ts}${enum_1.EEventType.RECONNECT_STATUS}`, (ev) => {
                        if (ev.error === 0) {
                            console.log('CK_WS: reconnect success, and the state change to CONNECTED');
                            this.wsState = 'CONNECTED';
                            WebSocketService.isReconnecting = false;
                        }
                        WebSocketService.connectConfig.debug && console.log(`CK_WS: reconnect finish`);
                        resolve(ev);
                    })
                    : eventEmitter_1.default.once(`${ts}${WebSocketService.listenerHook}`, (ev) => {
                        if (ev.error === 0) {
                            console.log('CK_WS: init success');
                            this.wsState = 'CONNECTED';
                        }
                        else {
                            console.log('CK_WS: init failed');
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
                ws.onclose = (ev) => this.onClose(ev, ts);
                ws.onopen = (ev) => this.onOpen(ev, ts);
                ws.onerror = (ev) => this.onError(ev, ts);
                ws.onmessage = (ev) => this.onMessage(ev, ts);
                WebSocketService.ws = ws;
            }));
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (WebSocketService.isReconnecting) {
                console.log(`CK_WS: already in reconnect state, won't trigger again`);
                return;
            }
            WebSocketService.isOpen = false;
            WebSocketService.isReconnecting = true;
            WebSocketService.ws = null;
            WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval);
            const { debug = false, retryInterval = 5, maxRetry = 10 } = WebSocketService.connectConfig;
            for (; WebSocketService.retryCount < maxRetry;) {
                const retryCount = WebSocketService.retryCount + 1;
                this.close();
                if (!WebSocketService.isOpen && !WebSocketService.initClose) {
                    console.log(`CK_WS: reconnect for the ${retryCount} times`);
                    debug && console.log(`CK_WS: the ${retryCount} times reconnection begins in ${Date.now()}`);
                    const res = yield this._initWs(`${Date.now()}`);
                    debug && console.log(`CK_WS: the ${retryCount} times reconnection ends and result being: ${JSON.stringify(res, null, 4)}`);
                    if (res.error !== 0) {
                        this._onAllEventCallBack();
                        console.log(`CK_WS: the ${retryCount} times reconnection failed and the result being: `, res.msg);
                        eventEmitter_1.default.emit(enum_1.EOpenEventType.RECONNECT, {
                            error: enum_1.EErrorCode.RECONNECT_FAIL,
                            data: {
                                totalTime: WebSocketService.reconnectTotalTime / 1000,
                                count: retryCount
                            },
                            msg: (res === null || res === void 0 ? void 0 : res.msg) || 'reconnect fail'
                        });
                        WebSocketService.retryCount++;
                        if (retryCount + 1 > maxRetry) {
                            console.log(`CK_WS: reach the reconnection limit, stop reconnect loop`);
                            eventEmitter_1.default.emit(enum_1.EOpenEventType.RECONNECT, {
                                error: enum_1.EErrorCode.RECONNECT_COUNT_EXCEEDED,
                                data: {
                                    totalTime: WebSocketService.reconnectTotalTime / 1000,
                                    count: retryCount
                                }
                            });
                        }
                        else {
                            console.log(`CK_WS: wait for the ${retryCount + 1} time reconnection and the time is: ${Date.now()}`);
                        }
                        const actualInterval = this._getRetryInterval(retryInterval);
                        WebSocketService.reconnectTotalTime = WebSocketService.reconnectTotalTime + actualInterval;
                        yield (0, tools_1.sleep)(actualInterval);
                        continue;
                    }
                }
                console.log(`CK_WS: the ${retryCount} times reconnection success`);
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
                WebSocketService.ws = null;
                WebSocketService.isReconnecting = false;
            }
        });
    }
    onOpen(ev, ts) {
        return __awaiter(this, void 0, void 0, function* () {
            WebSocketService.connectConfig.debug && console.log('CK_WS: ws connection opened');
            WebSocketService.isOpen && eventEmitter_1.default.emit(enum_1.EOpenEventType.OPEN, ev);
            yield WebSocketService._sendHandShakeMsg(ts);
        });
    }
    onError(ev, ts) {
        return __awaiter(this, void 0, void 0, function* () {
            WebSocketService.isOpen && eventEmitter_1.default.emit(enum_1.EOpenEventType.ERROR, ev);
            console.log(`CK_WS: wsState being changed to ERROR`);
            this.wsState = 'ERROR';
            if (!WebSocketService.isReconnecting) {
                console.log('CK_WS: ws connect error, start reconnection');
                yield this.reconnect();
                return;
            }
            if (WebSocketService.isReconnecting) {
                WebSocketService.connectConfig.debug && console.log(`CK_WS: connection error, reconnection failed`);
                eventEmitter_1.default.emit(`${ts}${enum_1.EEventType.RECONNECT_STATUS}`, {
                    error: enum_1.EErrorCode.RECONNECT_FAIL,
                    msg: 'reconnect error',
                });
            }
        });
    }
    onClose(ev, ts) {
        return __awaiter(this, void 0, void 0, function* () {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: ws connection closed`);
            WebSocketService.isOpen && eventEmitter_1.default.emit(enum_1.EOpenEventType.CLOSE, ev);
            console.log(`CK_WS: wsState being changed to CLOSED by close callback`);
            this.wsState = 'CLOSED';
            if (WebSocketService.initClose) {
                console.log('CK_WS: the user choose to close the connection');
                WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval);
                WebSocketService.initClose = false;
                return;
            }
            if (!WebSocketService.isReconnecting) {
                console.log('CK_WS: connection close due to error, start reconnection');
                yield this.reconnect();
                return;
            }
            if (WebSocketService.isReconnecting) {
                WebSocketService.connectConfig.debug && console.log(`CK_WS: connection closed, reconnection failed`);
                eventEmitter_1.default.emit(`${ts}${enum_1.EEventType.RECONNECT_STATUS}`, {
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
            debug && console.log(`CK_WS: ws connection receive message: `, data);
            if (data === 'pong') {
                eventEmitter_1.default.emit(enum_1.EEventType.PING_PONG);
                return;
            }
            const decodedData = JSON.parse(data);
            if (decodedData.error === 0 && decodedData.config && decodedData.config.hb && ts) {
                console.log('CK_WS: ws connection handshake success');
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
                    eventEmitter_1.default.emit(`${ts}${enum_1.EEventType.RECONNECT_STATUS}`, {
                        error: 0,
                        msg: 'success',
                    });
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
                console.log('CK_WS: ws connection handshake error: ', decodedData.error);
                if (WebSocketService.isReconnecting) {
                    WebSocketService.connectConfig.debug && console.log(`CK_WS: ws connection handshake error, reconnection failed`);
                    eventEmitter_1.default.emit(`${ts}${enum_1.EEventType.RECONNECT_STATUS}`, {
                        error: enum_1.EErrorCode.RECONNECT_FAIL,
                        msg: 'auth fail',
                    });
                }
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
                    console.log(`CK_WS: reach the heartbeat limit, start reconnection`);
                    yield this.reconnect();
                    resolve(1);
                }), maxTime);
                eventEmitter_1.default.once(enum_1.EEventType.PING_PONG, () => {
                    WebSocketService.connectConfig.debug && console.log(`CK_WS: heartbeat working as expected in ${Date.now()}`);
                    timer && clearTimeout(timer);
                    resolve(1);
                });
            });
        });
    }
    _onAllEventCallBack() {
        const eventNames = eventEmitter_1.default.eventNames();
        for (const [name, cb] of WebSocketService.callBackStack.entries()) {
            if (eventNames.includes(name))
                continue;
            eventEmitter_1.default.on(name, cb);
        }
    }
    _getRetryInterval(retryInterval) {
        const maxRetryInterval = WebSocketService.connectConfig.maxRetryInterval || WebSocketService.maxReconnectTime;
        const retryCount = WebSocketService.retryCount + 1;
        let interval = retryInterval;
        if (retryInterval < 5) {
            WebSocketService.connectConfig.debug && console.log("CK_WS: retry interval set to lower than default interval(5s), return to default setting");
            interval = 5;
        }
        const userInterval = retryCount * interval * 1000;
        const maxInterval = maxRetryInterval * 1000;
        return userInterval >= maxInterval ? maxInterval : userInterval;
    }
    static sendMessage(params) {
        if (WebSocketService.ws && WebSocketService.ws.readyState === 1) {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: ws connection sends message in ${Date.now()} and with params being `, params);
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
                WebSocketService.connectConfig.debug && console.log('CK_WS: ws connection exists, stop init');
                return {
                    error: 0,
                    msg: 'ws connection exists, stop init',
                };
            }
            WebSocketService.connectConfig.debug && console.log("CK_WS: ws connection begin init");
            return yield this._initWs(`${Date.now()}`);
        });
    }
    close(userInit = false) {
        try {
            WebSocketService.connectConfig.debug && console.log('CK_WS: close function called');
            eventEmitter_1.default.removeAllListeners();
            if (WebSocketService.ws && WebSocketService.ws.readyState === WebSocketService.ws.OPEN) {
                WebSocketService.connectConfig.debug && console.log('CK_WS: ws connection begin close');
                if (userInit) {
                    WebSocketService.connectConfig.debug && console.log('CK_WS: the user choose to close the connection');
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
                console.log(`CK_WS: wsState being changed to CLOSED by close function`);
                this.wsState = 'CLOSED';
            }
        }
        catch (error) {
            console.error('CK_WS: ws function close error: ', error);
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
