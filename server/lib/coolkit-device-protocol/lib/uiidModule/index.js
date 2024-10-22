"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUiidParams = exports.getUiidCapability = exports.initCloudGroup = exports.initCloudDevice = void 0;
const DeviceClass_1 = require("./DeviceClass");
const GroupClass_1 = require("./GroupClass");
const constant_1 = require("../constant");
const UIID1_1 = require("./UIID1");
const UIID2_1 = require("./UIID2");
const UIID3_1 = require("./UIID3");
const UIID4_1 = require("./UIID4");
const UIID5_1 = require("./UIID5");
const UIID6_1 = require("./UIID6");
const UIID7_1 = require("./UIID7");
const UIID8_1 = require("./UIID8");
const UIID9_1 = require("./UIID9");
const UIID11_1 = require("./UIID11");
const UIID14_1 = require("./UIID14");
const UIID15_1 = require("./UIID15");
const UIID22_1 = require("./UIID22");
const UIID24_1 = require("./UIID24");
const UIID27_1 = require("./UIID27");
const UIID28_1 = require("./UIID28");
const UIID29_1 = require("./UIID29");
const UIID30_1 = require("./UIID30");
const UIID31_1 = require("./UIID31");
const UIID32_1 = require("./UIID32");
const UIID34_1 = require("./UIID34");
const UIID36_1 = require("./UIID36");
const UIID44_1 = require("./UIID44");
const UIID52_1 = require("./UIID52");
const UIID57_1 = require("./UIID57");
const UIID59_1 = require("./UIID59");
const UIID65_1 = require("./UIID65");
const UIID67_1 = require("./UIID67");
const UIID77_1 = require("./UIID77");
const UIID78_1 = require("./UIID78");
const UIID81_1 = require("./UIID81");
const UIID82_1 = require("./UIID82");
const UIID83_1 = require("./UIID83");
const UIID84_1 = require("./UIID84");
const UIID87_1 = require("./UIID87");
const UIID98_1 = require("./UIID98");
const UIID102_1 = require("./UIID102");
const UIID103_1 = require("./UIID103");
const UIID104_1 = require("./UIID104");
const UIID107_1 = require("./UIID107");
const UIID112_1 = require("./UIID112");
const UIID113_1 = require("./UIID113");
const UIID114_1 = require("./UIID114");
const UIID126_1 = require("./UIID126");
const UIID127_1 = require("./UIID127");
const UIID130_1 = require("./UIID130");
const UIID133_1 = require("./UIID133");
const UIID135_1 = require("./UIID135");
const UIID136_1 = require("./UIID136");
const UIID137_1 = require("./UIID137");
const UIID138_1 = require("./UIID138");
const UIID139_1 = require("./UIID139");
const UIID140_1 = require("./UIID140");
const UIID141_1 = require("./UIID141");
const UIID151_1 = require("./UIID151");
const UIID154_1 = require("./UIID154");
const UIID160_1 = require("./UIID160");
const UIID161_1 = require("./UIID161");
const UIID162_1 = require("./UIID162");
const UIID163_1 = require("./UIID163");
const UIID165_1 = require("./UIID165");
const UIID168_1 = require("./UIID168");
const UIID173_1 = require("./UIID173");
const UIID174_1 = require("./UIID174");
const UIID177_1 = require("./UIID177");
const UIID181_1 = require("./UIID181");
const UIID182_1 = require("./UIID182");
const UIID187_1 = require("./UIID187");
const UIID188_1 = require("./UIID188");
const UIID190_1 = require("./UIID190");
const UIID191_1 = require("./UIID191");
const UIID195_1 = require("./UIID195");
const UIID196_1 = require("./UIID196");
const UIID197_1 = require("./UIID197");
const UIID198_1 = require("./UIID198");
const UIID209_1 = require("./UIID209");
const UIID210_1 = require("./UIID210");
const UIID211_1 = require("./UIID211");
const UIID212_1 = require("./UIID212");
const UIID224_1 = require("./UIID224");
const UIID236_1 = require("./UIID236");
const UIID237_1 = require("./UIID237");
const UIID238_1 = require("./UIID238");
const UIID1000_1 = require("./UIID1000");
const UIID1009_1 = require("./UIID1009");
const UIID1256_1 = require("./UIID1256");
const UIID1257_1 = require("./UIID1257");
const UIID1258_1 = require("./UIID1258");
const UIID1770_1 = require("./UIID1770");
const UIID1771_1 = require("./UIID1771");
const UIID2026_1 = require("./UIID2026");
const UIID2256_1 = require("./UIID2256");
const UIID3026_1 = require("./UIID3026");
const UIID3256_1 = require("./UIID3256");
const UIID3258_1 = require("./UIID3258");
const UIID4026_1 = require("./UIID4026");
const UIID4256_1 = require("./UIID4256");
const UIID7000_1 = require("./UIID7000");
const UIID7002_1 = require("./UIID7002");
const UIID7003_1 = require("./UIID7003");
const UIID7004_1 = require("./UIID7004");
const UIID7005_1 = require("./UIID7005");
const UIID7008_1 = require("./UIID7008");
const UIID7009_1 = require("./UIID7009");
const UIID7010_1 = require("./UIID7010");
const UIID7011_1 = require("./UIID7011");
const UIID7012_1 = require("./UIID7012");
const UIID7013_1 = require("./UIID7013");
const UIID7014_1 = require("./UIID7014");
const UIID7016_1 = require("./UIID7016");
const UIID7017_1 = require("./UIID7017");
const UIID7019_1 = require("./UIID7019");
const UIID7027_1 = require("./UIID7027");
const UIID20001_1 = require("./UIID20001");
const UIID20005_1 = require("./UIID20005");
const UIID20006_1 = require("./UIID20006");
const UIID20007_1 = require("./UIID20007");
const UIID20008_1 = require("./UIID20008");
const UIID30000_1 = require("./UIID30000");
const UIID30001_1 = require("./UIID30001");
const UIID30003_1 = require("./UIID30003");
const UIID30004_1 = require("./UIID30004");
const uiidMap = new Map([
    [1, UIID1_1.UIID1_PROTOCOL],
    [2, UIID2_1.UIID2_PROTOCOL],
    [3, UIID3_1.UIID3_PROTOCOL],
    [4, UIID4_1.UIID4_PROTOCOL],
    [5, UIID5_1.UIID5_PROTOCOL],
    [6, UIID6_1.UIID6_PROTOCOL],
    [7, UIID7_1.UIID7_PROTOCOL],
    [8, UIID8_1.UIID8_PROTOCOL],
    [9, UIID9_1.UIID9_PROTOCOL],
    [11, UIID11_1.UIID11_PROTOCOL],
    [14, UIID14_1.UIID14_PROTOCOL],
    [15, UIID15_1.UIID15_PROTOCOL],
    [22, UIID22_1.UIID22_PROTOCOL],
    [24, UIID24_1.UIID24_PROTOCOL],
    [27, UIID27_1.UIID27_PROTOCOL],
    [28, UIID28_1.UIID28_PROTOCOL],
    [29, UIID29_1.UIID29_PROTOCOL],
    [30, UIID30_1.UIID30_PROTOCOL],
    [31, UIID31_1.UIID31_PROTOCOL],
    [32, UIID32_1.UIID32_PROTOCOL],
    [34, UIID34_1.UIID34_PROTOCOL],
    [36, UIID36_1.UIID36_PROTOCOL],
    [44, UIID44_1.UIID44_PROTOCOL],
    [52, UIID52_1.UIID52_PROTOCOL],
    [57, UIID57_1.UIID57_PROTOCOL],
    [59, UIID59_1.UIID59_PROTOCOL],
    [65, UIID65_1.UIID65_PROTOCOL],
    [67, UIID67_1.UIID67_PROTOCOL],
    [77, UIID77_1.UIID77_PROTOCOL],
    [78, UIID78_1.UIID78_PROTOCOL],
    [81, UIID81_1.UIID81_PROTOCOL],
    [82, UIID82_1.UIID82_PROTOCOL],
    [83, UIID83_1.UIID83_PROTOCOL],
    [84, UIID84_1.UIID84_PROTOCOL],
    [87, UIID87_1.UIID87_PROTOCOL],
    [98, UIID98_1.UIID98_PROTOCOL],
    [102, UIID102_1.UIID102_PROTOCOL],
    [103, UIID103_1.UIID103_PROTOCOL],
    [104, UIID104_1.UIID104_PROTOCOL],
    [107, UIID107_1.UIID107_PROTOCOL],
    [112, UIID112_1.UIID112_PROTOCOL],
    [113, UIID113_1.UIID113_PROTOCOL],
    [114, UIID114_1.UIID114_PROTOCOL],
    [126, UIID126_1.UIID126_PROTOCOL],
    [127, UIID127_1.UIID127_PROTOCOL],
    [130, UIID130_1.UIID130_PROTOCOL],
    [133, UIID133_1.UIID133_PROTOCOL],
    [135, UIID135_1.UIID135_PROTOCOL],
    [136, UIID136_1.UIID136_PROTOCOL],
    [137, UIID137_1.UIID137_PROTOCOL],
    [138, UIID138_1.UIID138_PROTOCOL],
    [139, UIID139_1.UIID139_PROTOCOL],
    [140, UIID140_1.UIID140_PROTOCOL],
    [141, UIID141_1.UIID141_PROTOCOL],
    [151, UIID151_1.UIID151_PROTOCOL],
    [154, UIID154_1.UIID154_PROTOCOL],
    [160, UIID160_1.UIID160_PROTOCOL],
    [161, UIID161_1.UIID161_PROTOCOL],
    [162, UIID162_1.UIID162_PROTOCOL],
    [163, UIID163_1.UIID163_PROTOCOL],
    [165, UIID165_1.UIID165_PROTOCOL],
    [168, UIID168_1.UIID168_PROTOCOL],
    [173, UIID173_1.UIID173_PROTOCOL],
    [174, UIID174_1.UIID174_PROTOCOL],
    [177, UIID177_1.UIID177_PROTOCOL],
    [181, UIID181_1.UIID181_PROTOCOL],
    [182, UIID182_1.UIID182_PROTOCOL],
    [187, UIID187_1.UIID187_PROTOCOL],
    [188, UIID188_1.UIID188_PROTOCOL],
    [190, UIID190_1.UIID190_PROTOCOL],
    [191, UIID191_1.UIID191_PROTOCOL],
    [195, UIID195_1.UIID195_PROTOCOL],
    [196, UIID196_1.UIID196_PROTOCOL],
    [197, UIID197_1.UIID197_PROTOCOL],
    [198, UIID198_1.UIID198_PROTOCOL],
    [209, UIID209_1.UIID209_PROTOCOL],
    [210, UIID210_1.UIID210_PROTOCOL],
    [211, UIID211_1.UIID211_PROTOCOL],
    [212, UIID212_1.UIID212_PROTOCOL],
    [224, UIID224_1.UIID224_PROTOCOL],
    [236, UIID236_1.UIID236_PROTOCOL],
    [237, UIID237_1.UIID237_PROTOCOL],
    [238, UIID238_1.UIID238_PROTOCOL],
    [1000, UIID1000_1.UIID1000_PROTOCOL],
    [1009, UIID1009_1.UIID1009_PROTOCOL],
    [1256, UIID1256_1.UIID1256_PROTOCOL],
    [1257, UIID1257_1.UIID1257_PROTOCOL],
    [1258, UIID1258_1.UIID1258_PROTOCOL],
    [1770, UIID1770_1.UIID1770_PROTOCOL],
    [1771, UIID1771_1.UIID1771_PROTOCOL],
    [2026, UIID2026_1.UIID2026_PROTOCOL],
    [2256, UIID2256_1.UIID2256_PROTOCOL],
    [3026, UIID3026_1.UIID3026_PROTOCOL],
    [3256, UIID3256_1.UIID3256_PROTOCOL],
    [3258, UIID3258_1.UIID3258_PROTOCOL],
    [4026, UIID4026_1.UIID4026_PROTOCOL],
    [4256, UIID4256_1.UIID4256_PROTOCOL],
    [7000, UIID7000_1.UIID7000_PROTOCOL],
    [7002, UIID7002_1.UIID7002_PROTOCOL],
    [7003, UIID7003_1.UIID7003_PROTOCOL],
    [7004, UIID7004_1.UIID7004_PROTOCOL],
    [7005, UIID7005_1.UIID7005_PROTOCOL],
    [7008, UIID7008_1.UIID7008_PROTOCOL],
    [7009, UIID7009_1.UIID7009_PROTOCOL],
    [7010, UIID7010_1.UIID7010_PROTOCOL],
    [7011, UIID7011_1.UIID7011_PROTOCOL],
    [7012, UIID7012_1.UIID7012_PROTOCOL],
    [7013, UIID7013_1.UIID7013_PROTOCOL],
    [7014, UIID7014_1.UIID7014_PROTOCOL],
    [7016, UIID7016_1.UIID7016_PROTOCOL],
    [7017, UIID7017_1.UIID7017_PROTOCOL],
    [7019, UIID7019_1.UIID7019_PROTOCOL],
    [7027, UIID7027_1.UIID7027_PROTOCOL],
    [20001, UIID20001_1.UIID20001_PROTOCOL],
    [20005, UIID20005_1.UIID20005_PROTOCOL],
    [20006, UIID20006_1.UIID20006_PROTOCOL],
    [20007, UIID20007_1.UIID20007_PROTOCOL],
    [20008, UIID20008_1.UIID20008_PROTOCOL],
    [30000, UIID30000_1.UIID30000_PROTOCOL],
    [30001, UIID30001_1.UIID30001_PROTOCOL],
    [30003, UIID30003_1.UIID30003_PROTOCOL],
    [30004, UIID30004_1.UIID30004_PROTOCOL]
]);
function initCloudDevice(data) {
    return new DeviceClass_1.DeviceClass(data);
}
exports.initCloudDevice = initCloudDevice;
function initCloudGroup(data) {
    return new GroupClass_1.GroupClass(data);
}
exports.initCloudGroup = initCloudGroup;
function getUiidCapability(device) {
    const uiid = device.uiid;
    const deviceProtocol = uiidMap.get(uiid);
    return deviceProtocol ? deviceProtocol.controlItem : undefined;
}
exports.getUiidCapability = getUiidCapability;
function initUiidParams(data) {
    let uiid = 0;
    if (constant_1.groupType.includes(data.itemType)) {
        const groupItem = data;
        uiid = groupItem.itemData.uiid;
    }
    else if (constant_1.deviceType.includes(data.itemType)) {
        const deviceItem = data;
        uiid = deviceItem.itemData.extra.uiid;
    }
    const deviceProtocol = uiidMap.get(uiid);
    const { fwVersion, rssi, parentid, timers } = data.itemData.params;
    return deviceProtocol ? Object.assign({ fwVersion, rssi, parentid, timers }, deviceProtocol.initParams(data)) : data.itemData.params;
}
exports.initUiidParams = initUiidParams;
