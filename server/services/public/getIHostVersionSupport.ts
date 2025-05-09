import logger from "../../log";
import { getIHostInfo } from "../../api/iHost";
import db from "../../utils/db";
import os from 'os';

/** 
 * 比较目标版本和当前版本之间的版本差异 
 * Compare the version differences between the target version and the current version)
*/
function compareVersion(targetVersion: string, currentVersion: string) {
    if (targetVersion === currentVersion) {
        return 0;
    }
    const targetVersionArray = targetVersion.split('.');
    const currentVersionArray = currentVersion.split('.');
    for (let i = 0; ; i++) {
        const targetVersionNum = parseInt(targetVersionArray[i]);
        const currentVersionNum = parseInt(currentVersionArray[i]);
        if (targetVersionNum !== currentVersionNum) {
            return targetVersionNum - currentVersionNum;
        }
    }
}

/** 
 * 判断当前 iHost 版本是否支持 add-on 
 * Determine whether the current iHost version supports add-on
*/
export default async function getIHostVersionSupport() {
    try {
        const { error, data } = await getIHostInfo();
        if (error === 0) {
            logger.info('get iHost info success ----------------', data)
            const { fw_version = '' } = data ?? {};
            const hostname = os.hostname();

            /** 是否是发行版 (Is it a distribution version)*/
            const isDistributions = hostname === 'cube';
            if (isDistributions) {
                db.setDbValue('support', true);
                return;
            }

            const support = compareVersion(fw_version, '2.1.0') >= 0;
            db.setDbValue('support', support);
        }
    } catch (error) {
        logger.error('get iHost info error ----------------', error)
    }
}