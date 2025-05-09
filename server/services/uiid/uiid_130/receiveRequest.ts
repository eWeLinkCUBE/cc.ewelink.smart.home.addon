import { Request, Response } from 'express';
import logger from '../../../log';
import { decode } from 'js-base64';
import { IReqData } from '../../../ts/interface/IReqData';
import deviceStateUtil from '../../../utils/deviceStateUtil';
import getWebSocketRealSummarizeToggle from '../../webSocket/toggleKws/getWebSocketRealSummarizeToggle';
import webSocketRealSummarizeStartEndToggle from '../../webSocket/toggleKws/webSocketRealSummarizeStartEndToggle';
import controlWebSocketDevice from '../../webSocket/controlWebSocketDevice';
import getWebSocketKwsDataToggle from '../../webSocket/toggleKws/getWebSocketDayKwsDataToggle';
import _ from 'lodash'
import controlLanDevice from '../../public/controlLanDevice';
import ECapability from '../../../ts/enum/ECapability';
import { sleep } from '../../../utils/timeUtils';

/**
 * 目前uiid130设备支持的接口有如下
 * 一、查询类
 * 1、查询历史电量数据（只支持 wan）
 * 2、查询实时电量统计数据（只支持 wan）
 * 二、控制类
 * 1、激活电量上报（同时支持 wan和 lan）
 * 2、控制设备开关（同时支持 wan和 lan）
 * 3、开启/停止设备实时电量统计（只支持 wan）
 * 
 * Currently, the interfaces supported by uiid130 devices are as follows:
 * 1）. Query class
 * 1. Query historical power data (only supports wan)
 * 2. Query real-time power statistics (only supports wan)
 * 2）. Control category
 * 1. Activate battery reporting (supports both wan and lan)
 * 2. Control device switch (supports both wan and lan)
 * 3. Enable/stop real-time power statistics of the device (only supports wan)
 * @param req 
 * @param res 
 * @returns 
 */


export default async function receiveRequest(req: Request, res: Response) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;
    const iHostState = payload.state;

    try {
        const { tags = null } = endpoint;

        if (!tags || !tags?.deviceInfo) {
            throw new Error('no tags deviceInfo');
        }
        const deviceInfo = JSON.parse(decode(tags?.deviceInfo));

        const { deviceId } = deviceInfo;

        const isInWsProtocol = deviceStateUtil.isInWsProtocol(deviceId);


        if (header.name === 'QueryDeviceStates') {
            // 获取历史电量数据和实时电量数据不支持局域网请求（Obtaining historical power data and real-time power data does not support LAN requests.）
            if (isInWsProtocol) {
                const togglePowerConsumption = _.get(iHostState, ECapability.TOGGLE_POWER_CONSUMPTION, null);
                if (JSON.stringify(togglePowerConsumption).indexOf('rlSummarize') > -1) {
                    return res.json(await getWebSocketRealSummarizeToggle(req));
                } else {
                    //summarize
                    return res.json(await getWebSocketKwsDataToggle(req));
                }
            } else {
                return res.json(createFailNotSupportedInterface(message_id))
            }


        } else if (header.name === 'UpdateDeviceStates') {

            //实时电量开始或者结束接口 （Real-time battery start or end api）
            if (iHostState[ECapability.TOGGLE_POWER_CONSUMPTION]) {
                // 实时电量开始或者结束接口不支持局域网请求（The real-time battery start or end interface does not support LAN requests.）
                if (isInWsProtocol) {
                    return res.json(await webSocketRealSummarizeStartEndToggle(req));
                } else {
                    return res.json(createFailNotSupportedInterface(message_id))
                }
            }

            if (iHostState[ECapability.TOGGLE_IDENTIFY]) {
                if (isInWsProtocol) {
                    return res.json(await controlWebSocketDevice(req));
                } else {
                    const toggleIndex = Object.keys(iHostState[ECapability.TOGGLE_IDENTIFY])[0] ?? 1
                    logger.info('toggleIndex--------------', toggleIndex)

                    // 解决请求频繁导致设备不响应问题（Solve the problem of frequent requests causing the device to not respond）
                    await sleep(2000 * Number(toggleIndex))
                    return res.json(await controlLanDevice(req))
                }
            }


            if (isInWsProtocol) {
                return res.json(await controlWebSocketDevice(req));
            } else {
                return res.json(await controlLanDevice(req));
            }

        }

    } catch (error: any) {
        logger.error(`to control device uiid130 error ---------------${error}`);

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



function createFailNotSupportedInterface(message_id: string) {
    return {
        event: {
            header: {
                name: 'ErrorResponse',
                message_id,
                version: '1',
            },
            payload: {
                type: 'NotSupportedInterface',
            },
        },
    };
}



