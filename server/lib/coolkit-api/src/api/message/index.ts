import { sendRequest } from '../../utils';
import { getAt } from '../../store';

export interface MessageItem {
    msgid: string;
    msgType: 'shareNotify_v2' | 'cancelShareNotify_v2' | 'opsNotify_v2' | 'pushNotify_v2' | 'alarmNotify_v2' | 'IOTCameraNotify_v2';
    message: object;
    date: number;
}

export const message = {
    /**
     * 获取消息列表
     * @param params 请求参数
     */
    async getMessageList(params?: {
        familyid?: string;
        from?: number;
        num?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            messageList: MessageItem[];
        };
    }> {
        return await sendRequest('/v2/message/read', 'GET', params ? params : {}, getAt());
    }
};
