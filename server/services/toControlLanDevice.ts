import { Request, Response } from 'express';
import { IReqData } from '../ts/interface/IReqData';
import logger from '../log';
import { decode } from 'js-base64';
import { getUiidOperateInstance } from '../utils/deviceOperateInstanceMange';

/**
 * 开放给ihost后端的接口，收到iHost后端请求，控制局域网设备
 * Open the interface to the ihost backend, receive the ihost backend request, and control the LAN device
 * */
export default async function toControlLanDevice(req: Request, res: Response) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;
    const iHostState = payload.state;
    logger.info('control state ----', JSON.stringify(iHostState, null, 2));

    try {
        const { tags = null } = endpoint;

        if (!tags || !tags?.deviceInfo) {
            throw new Error('no tags deviceInfo');
        }
        const deviceInfo = JSON.parse(decode(tags?.deviceInfo));
        const { deviceId } = deviceInfo;

        const operateInstance = getUiidOperateInstance(deviceId);
        if (!operateInstance) {
            return
        }



        if (header.name === 'QueryDeviceStates') {
            return res.json(await operateInstance.queryDeviceStates(req));
        } else if (header.name === 'UpdateDeviceStates') {
            return res.json(await operateInstance.updateDeviceStates(req));
        }
    } catch (error: any) {
        logger.error(`to control device code error ---------------${error}`);

        return res.json({
            event: {
                header: {
                    name: 'ErrorResponse',
                    message_id,
                    version: '2',
                },
                payload: {
                    type: 'ENDPOINT_UNREACHABLE',
                },
            },
        });
    }
}
