"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EErrorCode = exports.EOpenEventType = exports.EEventType = void 0;
var EEventType;
(function (EEventType) {
    EEventType["INIT_WS"] = "init";
    EEventType["DEVICE_MSG"] = "deviceMsg";
    EEventType["RECONNECT"] = "reconnect";
    EEventType["RECONNECT_STATUS"] = "reconnectStatus";
    EEventType["PING_PONG"] = "ping-pong";
})(EEventType || (exports.EEventType = EEventType = {}));
var EOpenEventType;
(function (EOpenEventType) {
    EOpenEventType["MESSAGE"] = "message";
    EOpenEventType["ERROR"] = "error";
    EOpenEventType["RECONNECT"] = "reconnect";
    EOpenEventType["CLOSE"] = "close";
    EOpenEventType["OPEN"] = "open";
})(EOpenEventType || (exports.EOpenEventType = EOpenEventType = {}));
var EErrorCode;
(function (EErrorCode) {
    EErrorCode[EErrorCode["INIT_FAIL"] = 601] = "INIT_FAIL";
    EErrorCode[EErrorCode["REQ_FAIL_OR_TIMEOUT"] = 604] = "REQ_FAIL_OR_TIMEOUT";
    EErrorCode[EErrorCode["RECONNECT_FAIL"] = 602] = "RECONNECT_FAIL";
    EErrorCode[EErrorCode["RECONNECT_COUNT_EXCEEDED"] = 603] = "RECONNECT_COUNT_EXCEEDED";
    EErrorCode[EErrorCode["GET_WS_SERVER_ERROR"] = 605] = "GET_WS_SERVER_ERROR";
})(EErrorCode || (exports.EErrorCode = EErrorCode = {}));
