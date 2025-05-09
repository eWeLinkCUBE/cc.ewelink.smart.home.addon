import { Request } from "express";
import logger from "../../../../log";
import { decode } from 'js-base64';
import { IReqData } from "../../../../ts/interface/IReqData";

import { createSuccessRes, createFailRes } from "./utils/createRes";
import ILanRequestFunction from "../../../../ts/interface/ILanRequest";

export default async function request(req: Request, lanRequest: ILanRequestFunction, lanState: any) {
    const reqData = req.body as IReqData;
    const { header, endpoint } = reqData.directive;
    const { message_id } = header;
    try {
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId, devicekey, selfApikey } = iHostDeviceData;


        logger.info('lanState', lanState)
        const resData = await lanRequest(deviceId, devicekey, selfApikey, lanState);
        if (resData && resData.error !== 0) {
            throw new Error(JSON.stringify(resData));
        }
        //控制失败 control failure
        if (!resData) {
            return createFailRes(message_id);
        }

        return createSuccessRes(message_id);
    } catch (error) {
        return createFailRes('');
    }

}