interface ISmartHomeConfig {
    // uiid 126和165设备 同步到iHost时，iHost到抽屉里显示模式切换警告
    // When synchronizing devices with uiid 126 and 165 to iHost, iHost displays a mode switching warning in the drawer.
    isShowModeTip?: boolean;
    // uiid 28 设备的按键id和按键名称和按键类型定义
    // uiid 28 Device key id, key name and key type definition
    rfGatewayConfig?: {
        buttonInfoList: {
            rfChl: number;
            rfVal: string;
            name: string;
        }[];
    };
}
export default ISmartHomeConfig;
