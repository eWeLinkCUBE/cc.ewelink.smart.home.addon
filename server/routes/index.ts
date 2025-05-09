import express from 'express';
import EApiPath from '../ts/enum/EApiPath';
import { checkSchema } from 'express-validator';
import userSchema from '../schema/user';
import validate from '../middleware/validate';
import login from '../services/login';
import getLanDeviceList from '../services/getLanDeviceList';
import getLanDeviceInfoList from '../services/getLanDeviceInfoList';
import toControlLanDevice from '../services/toControlLanDevice';
import toSyncDeviceToIHost from '../services/toSyncDeviceToIHost';
import toCancelSyncDeviceToIHost from '../services/toCancelDeviceToIHost';
import getPermission from '../services/getPermission';
import getLoginStatus from '../services/getLoginStatus';
import logout from '../services/logout';

const router = express.Router();

// ================================user=========================================
router.get(EApiPath.GET_LOGIN_STATUS, checkSchema({}), getLoginStatus);
router.post(EApiPath.LOGIN_BY_ACCOUNT, checkSchema(userSchema), validate, login);
router.put(EApiPath.LOG_OUT, checkSchema({}), logout);

// ================================device========================================
router.get(EApiPath.SCAN_LAN_DEVICE, checkSchema({}), getLanDeviceList);
router.get(EApiPath.COMBINE_LAN_DEVICE, checkSchema({}), getLanDeviceInfoList);
router.get(EApiPath.GET_PERMISSION, checkSchema({}), getPermission);
router.post(EApiPath.CONTROL_DEVICE, checkSchema({}), toControlLanDevice);
router.post(EApiPath.SYNC_DEVICE, checkSchema({}), toSyncDeviceToIHost);
router.delete(EApiPath.DELETE_DEVICE, checkSchema({}), toCancelSyncDeviceToIHost);

export default router;
