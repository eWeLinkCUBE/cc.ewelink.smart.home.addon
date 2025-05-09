enum EChannelProtocol {
    /** 单通道协议 */
    SINGLE_PROTOCOL = 'single-protocol',
    /** 单通道使用多通道协议 */
    SINGLE_MULTI_PROTOCOL = 'single-multi-protocol',
    /** 多通道协议 */
    MULTI_PROTOCOL = 'multi-protocol',
    /** 不支持通道相关协议 */
    OTHER = 'other'
}

export default EChannelProtocol;