import { Request, Response } from 'express';
import controlLanDevice from './public/controlLanDevice';
import getKwsData from './public/getKwsData';
import { IReqData } from '../ts/interface/IReqData';
import logger from '../log';
import { decode } from 'js-base64';
import getDayKwsData from './public/getDayKwsData';

/**
 * 开放给ihost后端的接口，收到iHost后端请求，控制局域网设备
 * Open the interface to the ihost backend, receive the ihost backend request, and control the LAN device
 * */
export default async function toControlLanDevice(req: Request, res: Response) {
    const reqData = req.body as IReqData;
    const { header, endpoint } = reqData.directive;
    const { message_id } = header;

    try {
        if (header.name === 'QueryDeviceStates') {
            const { tags = null } = endpoint;

            if (!tags || !tags?.deviceInfo) {
                throw new Error('no tags deviceInfo');
            }
            const deviceInfo = JSON.parse(decode(tags?.deviceInfo));
            const { uiid } = deviceInfo;
            if (uiid === 190) {
                return res.json(await getKwsData(req));
            } else if (uiid === 182) {
                return res.json(await getDayKwsData(req));
            }
            throw new Error('no match');
        } else if (header.name === 'UpdateDeviceStates') {
            console.time("control total time");
            return res.json(await controlLanDevice(req));
            console.timeEnd("control total time");
        }
    } catch (error: any) {
        logger.error(`to control device code error ---------------${error}`);

        return res.json({
            event: {
                header: {
                    name: 'ErrorResponse',
                    message_id,
                    version: '1',
                },
                payload: {
                    type: 'ENDPOINT_UNREACHABLE',
                },
            },
        });
    }
}
