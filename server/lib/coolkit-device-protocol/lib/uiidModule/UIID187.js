"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID187_PROTOCOL = void 0;
exports.UIID187_PROTOCOL = {
    uiid: 187,
    initParams: device => {
        const { switch: state = { switch: { value: 'off' } } } = device.itemData.params;
        const value = typeof state !== 'string' && state.switch ? state.switch.value : 'off';
        return {
            switch: {
                switch: {
                    value
                }
            }
        };
    },
    controlItem: {
        toggle: controlItem => {
            const { device } = controlItem;
            const { switch: state } = device.params;
            const value = state.switch.value;
            return {
                commands: [
                    {
                        component: 'main',
                        capability: 'switch',
                        command: value === 'off' ? 'on' : 'off',
                        arguments: []
                    }
                ]
            };
        }
    }
};
