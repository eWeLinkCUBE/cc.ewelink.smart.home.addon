/** 接口路径 (interface path) */
enum EApiPath {
    /** 账号密码登录接口 (Account and password login interface)*/
    LOGIN_BY_ACCOUNT = '/user/:account/account',
    /** 获取二维码（暂不开发） */
    /** Get the QR code (not developed yet） */
    GET_QR_CODE = '/user/:account/account',
    /** 二维码登录接口（暂不开发） */
    /** QR code login interface (not developed yet) */
    LOGIN_BY_QR_CODE = '/user/:code/qr-code',
    /** 获取局域网设备接口 (Get LAN device interface) */
    SCAN_LAN_DEVICE = '/device/lan',
    /** 获取局域网设备及信息接口 (Obtain LAN equipment and information interface)*/
    COMBINE_LAN_DEVICE = '/device',
    /** 获取凭证接口 (Obtain credential interface)*/
    GET_PERMISSION = '/user/access-token',
    /** 同步单个设备接口 (Synchronize a single device interface)*/
    SYNC_DEVICE = '/device/:deviceId/sync',
    /** 同步所有设备接口 (Synchronize all device interfaces)*/
    SYNC_ALL_DEVICES = '/device/sync',
    /** 删除单个设备接口 (Delete a single device interface) */
    DELETE_DEVICE = '/device/:deviceId',
    /** 删除所有设备接口 (Delete all device interfaces) */
    DELETE_ALL_DEVICES = '/device',
    /** 控制设备接口 (Control device interface)*/
    CONTROL_DEVICE = '/device/:deviceId',
    /** 更新设备同步标识 (Update device sync ID) */
    UPDATE_SYNC_STATUS = '/device/sync-status',
    /** 获取登录状态 (Get login status) */
    GET_LOGIN_STATUS = '/user/status',
    /** 退出登录 (sign out) */
    LOG_OUT = '/user'
}

export default EApiPath;
