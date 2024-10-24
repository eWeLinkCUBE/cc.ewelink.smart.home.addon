import { ReqMethod, ApiResponse } from '../api';
export declare function getCmsContent(params: {
    type: string;
    project: string;
    region: string;
    locale: string;
    category?: string[];
    modelName?: string;
    fwVersion?: string;
}): Promise<ApiResponse>;
export declare function getExactUrl(url: string): string;
export declare function sendRequest(url: string, method: ReqMethod, params: any, at?: string): Promise<ApiResponse>;
export declare function getDomainByCountryCode(code: string): string;
export declare function getDomainByRegion(region: string): string;
