export enum EEventType {
    INIT_WS = 'init',
    DEVICE_MSG = "deviceMsg",
    RECONNECT = "reconnect",
    RECONNECT_STATUS = "reconnectStatus",
    PING_PONG = "ping-pong"
}


export enum EOpenEventType {
    MESSAGE = 'message',
    ERROR = "error",
    RECONNECT = "reconnect",
    CLOSE = "close",
    OPEN = "open"
}

export enum EErrorCode {
    /** 初始化长连接失败 */
    INIT_FAIL = 601,
    /** 请求错误或超时(由于历史原因导致错误码混用,所以一个错误码代表两个错误) */
    REQ_FAIL_OR_TIMEOUT = 604,
    /** 重连失败 */
    RECONNECT_FAIL = 602,
    /** 超出重连规定次数 */
    RECONNECT_COUNT_EXCEEDED = 603,
    /** 网络连接有误，无法获取长连接地址 */
    GET_WS_SERVER_ERROR = 605,
}
