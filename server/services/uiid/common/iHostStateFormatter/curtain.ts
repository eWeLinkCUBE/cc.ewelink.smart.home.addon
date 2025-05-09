import IEWeLinkDevice from "../../../../ts/interface/IEWeLinkDevice";
import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import getEWeLinkDevice from "../../../public/getEWeLinkDevice";
import deviceDataUtil from "../../../../utils/deviceDataUtil";
import _ from "lodash";

export default async function iHostStateFormatterByCurtain(deviceId: string, eWeLinkDeviceData: IEWeLinkDevice | null, iHostState: IHostStateInterface) {
    let _eWeLinkDeviceData = eWeLinkDeviceData;
    const _iHostState = _.cloneDeep(iHostState);
     // 电机校准状态 (Motor calibration status)
     let motorClb = _.get(_eWeLinkDeviceData, 'itemData.params.motorClb', null);
     //如果窗帘在addon停止之后校准了，获取云端数据 (If the curtains are calibrated after addon is stopped, get cloud data)
     if (motorClb === 'calibration' || motorClb === null) {
         await getEWeLinkDevice(deviceId);
     }
     _eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
     if (!_eWeLinkDeviceData) {
         return null;
     }

     motorClb = _.get(_eWeLinkDeviceData, 'itemData.params.motorClb', null);
     motorClb !== null && _.set(_iHostState, 'motor-clb.motorClb', motorClb);

     // 进度状态 (progress status)
     const curPercent = _.get(_eWeLinkDeviceData, 'itemData.params.curPercent', null);
     curPercent !== null && curPercent <= 100 && _.set(_iHostState, 'percentage.percentage', curPercent);
     return _iHostState;

    //  // 7015 窗帘的校准状态上报异常，未校准时上报 motorClb: 'normal' 且 curPercent: 255。
    //  // 7015 The calibration status of the curtain is abnormal. When it is not calibrated, motorClb: 'normal' and curPercent: 255 are reported.
    //  if (uiid === 7015) {
    //      // 当前百分比为 255 时，将7015窗帘同步为未校准状态
    //      // When the current percentage is 255, synchronize the 7015 curtains to an uncalibrated state
    //      curPercent === 255 && _.set(iHostState, 'motor-clb.motorClb', 'calibration');
    //  }
}