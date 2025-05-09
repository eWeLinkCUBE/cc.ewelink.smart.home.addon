import ECapability from '../enum/ECapability';
import ECategory from '../enum/ECategory';
import EPermission from '../enum/EPermission';
import EUiid from '../enum/EUiid';

export default interface ICoolkitDeviceProfiles {
    uiidList: EUiid[];
    category: ECategory;
    capabilities: {
        capability: ECapability;
        permission: EPermission;
        name?: string;
        configuration?: any;
        settings?: any;
    }[];
}