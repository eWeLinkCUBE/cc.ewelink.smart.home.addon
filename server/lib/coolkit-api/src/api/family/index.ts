import { getAt } from "../../store";
import { sendRequest } from "../../utils";
import { ApiResponse, MsgLang } from "../index";

// 1 - 更小的序号，2 - 更大的序号
export type SortType = 1 | 2;

export interface RoomItem {
    id: string;
    name: string;
    index: string;
}

export interface FamilyItem {
    id: string;
    apikey: string;
    name: string;
    index: string;
    roomList?: RoomItem[];
    familyType: number;
    members: {
        apikey: string;
        phoneNumber?: string;
        email?: string;
        nickname?: string;
        comment?: string;
        wxNickname?: string;
        wxAvatar?: string;
    }[];
    sharedBy?: {
        apikey: string;
        phoneNumber?: string;
        email?: string;
        nickname?: string;
    };
}

export interface ThingItem {
    id: string;
    itemType: number;
}

export const family = {
    /**
     * 获取家庭和房间列表
     * @param params 请求参数
     */
    async getFamilyList(params: { lang?: MsgLang }): Promise<{
        error: number;
        msg: string;
        data: {
            familyList: FamilyItem[];
            currentFamilyId: string;
        };
    }> {
        return await sendRequest('/v2/family', 'GET', params, getAt());
    },

    /**
     * 新增家庭
     * @param params 请求参数
     */
    async addFamily(params: {
        name: string;
        sort: SortType;
        roomNameList?: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            id: string;
            name: string;
            index: number;
            roomList?: RoomItem[];
        };
    }> {
        return await sendRequest('/v2/family', 'POST', params, getAt());
    },

    /**
     * 新增房间
     * @param params 请求参数
     */
    async addRoom(params: {
        familyid: string;
        name: string;
        sort: SortType;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            id: string;
            name: string;
            index: number;
        };
    }> {
        return await sendRequest('/v2/family/room', 'POST', params, getAt());
    },

    /**
     * 修改家庭信息
     * @param params 请求参数
     */
    async updateFamily(params: {
        id?: string;
        name: string;
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/family', 'PUT', params, getAt());
    },

    /**
     * 修改房间信息
     * @param params 请求参数
     */
    async updateRoom(params: {
        id: string;
        name: string;
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/family/room', 'PUT', params, getAt());
    },

    /**
     * 对房间做排序
     * @param params 请求参数
     */
    async sortRoom(params: {
        familyid?: string;
        idList: string[];
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/family/room/index', 'POST', params, getAt());
    },

    /**
     * 删除家庭（id required）
     * @param params 请求参数
     */
    async delFamily(params: {
        id: string;
        deviceFamily: string;
        switchFamily: string;
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/family', 'DELETE', params, getAt());
    },

    /**
     * 删除房间（id required）
     * @param params 请求参数
     */
    async delRoom(params: { id: string; }): Promise<ApiResponse> {
        return await sendRequest('/v2/family/room', 'DELETE', params, getAt());
    },

    /**
     * 对家庭下的 Thing 做排序
     * @param params 请求参数
     */
    async sortThing(params: {
        familyid?: string;
        thingList: ThingItem[];
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/family/thing/sort', 'POST', params, getAt());
    },

    /**
     * 设置房间的 Thing
     * @param params 请求参数
     */
    async setThing(params: {
        roomid: string;
        oldThingList: ThingItem[];
        newThingList: ThingItem[];
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/family/room/thing', 'POST', params, getAt());
    },

    /**
     * 切换当前家庭
     * @param params 请求参数
     */
    async changeFamily(params: { id: string; }): Promise<ApiResponse> {
        return await sendRequest('/v2/family/current', 'POST', params, getAt());
    },

    /**
     * 家庭分享
     * @param params 请求参数
     */
    async addShareFamily(params: {
        familyid: string;
        user: { countryCode?: string; phoneNumber?: string; email?: string; };
        comment?: string;
        shareType: number;
    }) {
        return await sendRequest('/v2/family/share', 'POST', params, getAt());
    },

    /**
     * 取消家庭分享
     * @param params 请求参数
     */
    async delShareFamily(params: {
        familyid: string;
        apikey: string;
    }) {
        return await sendRequest('/v2/family/share', 'DELETE', params, getAt());
    }
};
