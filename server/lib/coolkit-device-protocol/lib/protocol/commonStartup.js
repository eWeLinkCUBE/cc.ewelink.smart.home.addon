"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonMultiStartup = exports.commonSingleStartup = void 0;
const constant_1 = require("../constant");
function commonSingleStartup(controlItem) {
    const { startup = 'on' } = controlItem;
    return {
        startup
    };
}
exports.commonSingleStartup = commonSingleStartup;
function commonMultiStartup(controlItem) {
    const { configure = [], device: { params: { configure: _configure = (0, constant_1.getDefaultStartup)().configure } } } = controlItem;
    configure.push(..._configure.slice(configure.length));
    return { configure };
}
exports.commonMultiStartup = commonMultiStartup;
