import EPermission from "../enum/EPermission";

export default interface ICapability{
    capability: string;
    permission: EPermission;
    name?: string;
    configuration?: {
        actions?: string[];
        [key: string]: any;
    };
    settings?: {
        actions?: {
            type: string,
            permission: string,
            values: string[],
        };
        [key: string]: any;
    }
}