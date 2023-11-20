import { MsgLang } from '../index';
import { UserInfo } from '../user';
import { FamilyItem } from '../family';
import { MessageItem } from '../message';
import { DeviceListItemD, DeviceListItemG } from '../device';
export declare const home: {
    homepage(params?: {
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
    }>;
};
