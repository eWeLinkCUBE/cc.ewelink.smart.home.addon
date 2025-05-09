import ECapability from "../../../../ts/enum/ECapability";
import EChannelProtocol from "../../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import updateLanDeviceData from "../../../public/updateLanDeviceData";
import controlDeviceByLan from "../../common/controlDeviceByLan";
import { Request } from 'express';
import _ from 'lodash';
export default async function updateLanDeviceStates(req: Request, channelProtocolType: EChannelProtocol, iHostState: IHostStateInterface, lanState: any) {
    let lanRequest
    if (channelProtocolType === EChannelProtocol.SINGLE_PROTOCOL) {
        lanRequest = updateLanDeviceData.setSwitch
    } else {
        lanRequest = updateLanDeviceData.setSwitches
    }

    if (isLightControl(iHostState)) {
        lanRequest = updateLanDeviceData.setDimmable
    }

    return await controlDeviceByLan.request(req, lanRequest, lanState)
}

function isLightControl(iHostState: IHostStateInterface) {
    return [ECapability.BRIGHTNESS, ECapability.COLOR_TEMPERATURE, ECapability.COLOR_RGB].some((ability) => _.get(iHostState, [ability]));
}