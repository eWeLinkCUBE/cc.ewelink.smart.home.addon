export declare enum EEventType {
    INIT_WS = "init",
    DEVICE_MSG = "deviceMsg",
    RECONNECT = "reconnect",
    RECONNECT_STATUS = "reconnectStatus",
    PING_PONG = "ping-pong"
}
export declare enum EOpenEventType {
    MESSAGE = "message",
    ERROR = "error",
    RECONNECT = "reconnect",
    CLOSE = "close",
    OPEN = "open"
}
export declare enum EErrorCode {
    INIT_FAIL = 601,
    REQ_FAIL_OR_TIMEOUT = 604,
    RECONNECT_FAIL = 602,
    RECONNECT_COUNT_EXCEEDED = 603,
    GET_WS_SERVER_ERROR = 605
}
