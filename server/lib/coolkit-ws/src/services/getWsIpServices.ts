import axios from 'axios';

export default async function getWsIpServices(region: string, useTestEnv: boolean) {

    try {
        let url = useTestEnv ? `https://test-dispa.coolkit.cn/dispatch/app` : `https://${region}-dispa.coolkit.${region === 'cn' ? 'cn' : 'cc'}/dispatch/app`;
        const { data } = await axios.get(url);
        return data.domain;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("CK_WS: 获取长连接ip地址报错：", error.message);
        } else {
            console.log("CK_WS: 获取长连接ip地址报错：", error);
        }
        return ""
    }
}
