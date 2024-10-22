import axios from 'axios';
import { IDispatchAppRes } from '../ts/interfaces';

export default async function getWsIpServices(region: string, useTestEnv: boolean): Promise<IDispatchAppRes> {

    try {
        let url = useTestEnv ? `https://test-dispa.coolkit.cn/dispatch/app` : `https://${region}-dispa.coolkit.${region === 'cn' ? 'cn' : 'cc'}/dispatch/app`;
        const res = await axios.get(url);
        return res.data as IDispatchAppRes;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("CK_WS: failed to obtain ws server domain and ip with error: ", error.message);
        } else {
            console.log("CK_WS: failed to obtain ws server domain and ip with error: ", error);
        }
        return {
            error: 500,
            reason: "get dispatch address error",
            domain: "",
            IP: "",
            port: 0
        }
    }
}
