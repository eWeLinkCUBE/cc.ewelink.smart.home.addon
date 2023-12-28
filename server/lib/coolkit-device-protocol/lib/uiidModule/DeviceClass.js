"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceClass = void 0;
const _1 = require(".");
class DeviceClass {
    constructor(device) {
        const { index, itemType, itemData } = device;
        const { apikey, brandLogo, brandName, deviceid, devicekey, deviceFeature, devGroups = [], extra: { uiid, mac, model }, family: { familyid, roomid }, isSupportGroup, name, online, productModel, showBrand, tags, settings, params, denyFeatures = [] } = itemData;
        const { staMac } = params !== null && params !== void 0 ? params : {};
        this.index = index;
        this.itemType = itemType;
        this.apikey = apikey;
        this.brandLogo = brandLogo;
        this.brandName = brandName;
        this.deviceid = deviceid;
        this.devicekey = devicekey;
        this.deviceFeature = deviceFeature;
        this.devGroups = devGroups;
        this.familyid = familyid;
        this.roomid = roomid;
        this.isSupportGroup = isSupportGroup;
        this.mac = staMac || mac;
        this.model = model;
        this.name = name;
        this.online = online;
        this.params = (0, _1.initUiidParams)(device);
        this.productModel = productModel !== null && productModel !== void 0 ? productModel : '';
        this.showBrand = showBrand;
        this.uiid = uiid;
        this.tags = tags;
        this.settings = settings;
        this.denyFeatures = denyFeatures;
    }
}
exports.DeviceClass = DeviceClass;
