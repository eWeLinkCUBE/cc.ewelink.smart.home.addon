import _ from 'lodash';
import CkApi from '../../lib/coolkit-api';
import logger from '../../log';
import db from '../../utils/db';

function atExpired() {
    const AT_LIFETIME = 86400000 * 15; // 15 day

    const atUpdateTime = db.getDbValue('atUpdateTime');
    // 未登录，不作刷新at操作 (Not logged in, no refresh at operation)
    if (atUpdateTime === 0) {
        return false;
    }
    return Date.now() > atUpdateTime + AT_LIFETIME;
}

/**
 * 刷新at
 * Refresh at
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*}
 */
export default async function refreshEWeLinkToken() {
    if (!atExpired()) {
        return;
    }
    logger.info('retry refresh at request --------------------------------------');
    const refreshRes = await CkApi.user.refresh();
    logger.info('retry refresh at res ----------------------------------', refreshRes);
    if (refreshRes.error !== 0) {
        return;
    }
    const { at, rt } = refreshRes.data;

    db.setDbValue('atUpdateTime', Date.now());
    logger.info('atUpdateTime----------------', db.getDbValue('atUpdateTime'));
    const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
    if (!eWeLinkApiInfo) {
        return;
    }
    eWeLinkApiInfo.at = at;
    eWeLinkApiInfo.rt = rt;

    db.setDbValue('eWeLinkApiInfo', eWeLinkApiInfo);
    logger.info('eWeLinkApiInfo----------------------', db.getDbValue('eWeLinkApiInfo'));

    return;
}
