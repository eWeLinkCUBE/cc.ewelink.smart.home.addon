/** 根据控制设备的协议不同，来划分设备类型 */
enum EDeviceControlMode {
    /** 只支持局域网 */
    LAN = 'lan',
    /** 只支持长连接 */
    WAN = 'wan',
    /** 既支持局域网也支持 websocket */
    LAN_AND_WAN = 'lan-and-wan',
    /** zigbee */
    ZIGBEE = 'zigbee',
}

export default EDeviceControlMode