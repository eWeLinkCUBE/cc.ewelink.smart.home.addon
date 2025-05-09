import { Request } from "express";
import { decode } from "js-base64";
import { IReqData } from "../../../../../ts/interface/IReqData";


export default function getReqInfo(req: Request) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;
    const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));
    const { deviceId } = iHostDeviceData;
    const iHostState = payload.state;
    return {
        deviceId,
        message_id,
        iHostState,
        third_serial_number: endpoint.third_serial_number
    }
}