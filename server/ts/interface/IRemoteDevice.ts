interface IRemoteDevice {
    name: string;
    /**
     * string
     * "1" 单通道按键(Single channel button)
     * "2" 双通道按键(Dual channel buttons)
     * "3" 三通道按键 (Three channel buttons)，
     * "4" 四通道按键(Four channel buttons,)，
     * "5" 窗帘 (curtain)，
     * "6" 报警器 (Alarm)*/
    type: '1' | '2' | '3' | '4' | '5' | '6';
    buttonInfoList: {
        rfChl: string;
        rfVal: string;
        name: string;
    }[];
    smartHomeAddonRemoteId?: string; //设置的在tags里的遥控器id(remote device id)
}

export default IRemoteDevice;
