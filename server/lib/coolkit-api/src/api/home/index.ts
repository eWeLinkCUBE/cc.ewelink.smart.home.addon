import { MsgLang } from '../index';
import { getAt } from '../../store';
import { sendRequest } from '../../utils';
import { UserInfo } from '../user';
import { FamilyItem } from '../family';
import { MessageItem } from '../message';
import { DeviceListItemD, DeviceListItemG } from '../device';

export const home = {
    /**
     * 获取首页信息
     * @param params 请求参数
     */
    async homepage(params?: {
        lang?: MsgLang;
        clientInfo?: {
            model?: string;
            os?: string;
            imei?: string;
            romVersion?: string;
            appVersion?: string;
        };
        getUser?: {};
        getFamily?: {};
        getThing?: {
            num?: number;
            beginIndex?: number;
        };
        getScene?: {};
        getMessage?: {
            from?: number;
            num?: number;
        };
    }): Promise<{
        error: number;
        msg: string;
        data: {
            userInfo?: UserInfo;
            familyInfo?: FamilyItem;
            thingInfo?: {
                thingList: Array<DeviceListItemD | DeviceListItemG>;
                total: number;
            };
            sceneInfo?: any;
            messageInfo?: {
                messageList: MessageItem[];
            };
        };
    }> {
        return await sendRequest('/v2/homepage', 'POST', params ? params : {}, getAt());
    }
};
