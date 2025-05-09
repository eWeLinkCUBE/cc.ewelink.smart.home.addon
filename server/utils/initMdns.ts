import makeMdns from 'multicast-dns';
import type { IMdnsRes } from '../ts/interface/IMdns';
import mDnsDataParse from './mDnsDataParse';
import _ from 'lodash';
import deviceMapUtil from './deviceMapUtil';
import syncDeviceStateToIHost from '../services/public/syncDeviceStateToIHost';
import logger from '../log';
import syncTagsRfChlToIHost from '../services/rf/syncTagsRfChlToIHost';
import deviceDataUtil from './deviceDataUtil';
import checkToInitSse from './checkToInitSse';

const mdns = makeMdns();

mdns.on('response', (response: any) => {
    // logger.info('response================================', response);
    const { answers, additionals } = response;
    if (!Array.isArray(answers)) return;
    const responseDataList = [...answers, ...additionals];

    // if (JSON.stringify(responseDataList).indexOf('1001551eb4') > -1) {
    //     logger.info(
    //         '收到响应------------------------1',
    //         responseDataList.map((item: any) => item.type),
    //         responseDataList
    //     );
    //     logger.info('-------');
    //     logger.info('-------');
    //     logger.info('-------');
    // }

    if (responseDataList.length === 0) return;
    let aDeviceDomain = ''; //a记录里的域名，包含设备id (The domain name in the A record, including the device ID)
    let aIp = ''; //a记录里的ip (IP in A record)
    const reg = RegExp(/eWeLink_/gi);
    const tmp = {} as IMdnsRes;
    for (const item of responseDataList) {
        const data = item.data;

        switch (item.type) {
            case 'PTR':
                if (!reg.test(`${data}`)) {
                    //不用return，因为设备可能上报多个ptr，导致正确的ptr都被忽略掉 (There is no need to return, because the device may report multiple ptr, causing the correct ptr to be ignored.)
                    continue;
                }
                tmp.ptr = data;
                break;
            case 'A':
                tmp.a = data;
                aDeviceDomain = item.name;
                aIp = data;
                break;
            case 'SRV':
                tmp.srv = data;
                break;
            case 'TXT':
                {
                    const arr = data.toString().split(/(?<!\{.*),(?!\}.*)/);
                    const txtData: any = {};
                    arr.map((str: string) => {
                        const [key, value] = str.split('=');
                        try {
                            txtData[key] = JSON.parse(value);
                        } catch {
                            txtData[key] = value;
                        }
                    });
                    tmp.txt = txtData;
                }
                // deviceId = txtData.id;
                break;
            default:
                break;
        }
    }
    if (aDeviceDomain && aIp) {
        deviceMapUtil.updateAData(aDeviceDomain, aIp);
    }

    const params = parseParams(tmp);

    if (!params || !params.deviceId) {
        return;
    }

    // 如果设备（例如UIID 77,uiid 181）没有ip，有target，查询一次mDns的 A 类型
    // If the device (for example, UIID 77, uiid 181) does not have an IP address and has a target, query the A type of mDns once.
    if (params && !params.ip && params.target) {
        deviceMapUtil.mDnsQueryA(params.deviceId, params.target);
    }

    // 如果ip不存在说明该设备可能不支持局域网
    // If the IP does not exist, the device may not support LAN.
    if (!params || (!params.ip && !params.target)) {
        logger.error(`no lan device --------------ip---${params?.ip},target---${params?.target}`);
        return;
    }

    // 维护局域网设备队列 (Maintain LAN device queue)
    deviceMapUtil.setOnline(params);

    // 同步局域网的设备状态到iHost里 (Synchronize the device status of the LAN to the iHost)
    syncDeviceStateToIHost(params.deviceId);

    //同步局域网的设备信息到iHost里 (Synchronize LAN device information to iHost)
    syncTagsRfChlToIHost(params.deviceId);

    //检查zigbee-p 的sse连接情况 (Check the sse connection status of zigbee-p)
    checkToInitSse(params.deviceId, params.ip);

    // if (JSON.stringify(responseDataList).indexOf('1001551eb4') > -1) {
    //     // logger.info(
    //     //     '收到响应------------------------1',
    //     //     responseDataList.map((item: any) => item.type),
    //     //     responseDataList
    //     // );
    //     // logger.info('-------');
    //     // logger.info('-------');
    //     // logger.info('-------');

    //     deviceDataUtil.lanStateToIHostState(params.deviceId);
    // }
});

//整理收到的数据 (Organize received data)
const parseParams = (device: IMdnsRes) => {
    const { ptr, txt, a, srv } = device;
    const data1 = _.get(txt, 'data1', '');
    const data2 = _.get(txt, 'data2', '');
    const data3 = _.get(txt, 'data3', '');
    const data4 = _.get(txt, 'data4', '');

    try {
        // ptr: 'eWeLink_1001033e54._ewelink._tcp.local',
        // 取出设备id,补充：有可能是eWelink_1001033e54 (Take out the device ID, add: it may be e welink 1001033e54)
        const deviceId = ptr.split('.')[0].split(/eWeLink_/gi)[1];
        return {
            deviceId,
            // 堆叠式网关的子设备的id 保存在txt记录中（The ID of the stacked gateway's sub-device is saved in the txt record）
            _subDeviceId: txt?.id,
            type: txt.type,
            encryptedData: `${data1}${data2}${data3}${data4}`,
            ip: a,
            port: srv.port,
            target: srv.target,
            iv: mDnsDataParse.decryptionBase64(txt.iv),
        };
    } catch (error) {
        return null;
    }
};

export default mdns;
