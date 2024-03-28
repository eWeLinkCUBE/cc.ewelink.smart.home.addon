enum ENetworkProtocol {
    WS = 'websocket',
    LAN = 'lan',
    /** 局域网和长连接都不支持（Neither LAN nor long connections are supported.） */
    NONE = 'none',
}

export default ENetworkProtocol;