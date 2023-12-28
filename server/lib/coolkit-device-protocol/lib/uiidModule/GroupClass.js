"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupClass = void 0;
const _1 = require(".");
class GroupClass {
    constructor(group) {
        const { index, itemType, itemData } = group;
        const { id, name, uiid, mainDeviceId, family: { familyid, roomid } } = itemData;
        this.index = index;
        this.itemType = itemType;
        this.id = id;
        this.name = name;
        this.uiid = uiid;
        this.mainDeviceId = mainDeviceId;
        this.familyid = familyid;
        this.roomid = roomid;
        this.params = (0, _1.initUiidParams)(group);
    }
}
exports.GroupClass = GroupClass;
