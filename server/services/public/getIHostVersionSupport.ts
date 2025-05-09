import logger from "../../log";
import { getIHostInfo } from "../../api/iHost";
import db from "../../utils/db";

/** 比较目标版本和当前版本之间的版本差异 */
function compareVersion(targetVersion: string, currentVersion: string) {
    if (targetVersion === currentVersion) {
        return 0;
    }
    const targetVersionArray = targetVersion.split('.');
    const currentVersionArray = currentVersion.split('.');
    for (let i = 0; ; i++) {
        const targetVersionNum= parseInt(targetVersionArray[i]);
        const currentVersionNum = parseInt(currentVersionArray[i]);
        if (targetVersionNum !== currentVersionNum) {
            return targetVersionNum - currentVersionNum;
        }
    }
}

/** 判断当前 iHost 版本是否支持 add-on */
export default async function getIHostVersionSupport() {
    try {
        const { error, data } = await getIHostInfo();
        if (error === 0) {
            logger.info('get iHost info success ----------------', data)
            const { fw_version = '' } = data ?? {};
            logger.info('fw_version', fw_version)
            // 是否支持使用 addon
            const support = compareVersion(fw_version, '2.1.0') >= 0;
            db.setDbValue('support', support); 
        }
    } catch (error) {
        logger.error('get iHost info error ----------------', error)
    }
}