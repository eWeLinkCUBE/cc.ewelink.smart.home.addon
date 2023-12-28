export declare const groupType: number[];
export declare const deviceType: number[];
export declare function getDefaultSwitches(length?: number, action?: string): {
    switches: {
        switch: string;
        outlet: number;
    }[];
};
export declare function getDefaultInching(length?: number, action?: string, width?: number): {
    pulses: {
        pulse: string;
        width: number;
        outlet: number;
    }[];
};
export declare function getDefaultStartup(length?: number, action?: string): {
    configure: {
        startup: string;
        outlet: number;
    }[];
};
