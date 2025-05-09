export interface IRequestDeviceResponse {
    error: number;
    iv?: string;
    data?: string;
}

export default interface ILanRequestFunction {
    (deviceId: string,
        deviceKey: string,
        selfApikey: string,
        lanState: string): Promise<IRequestDeviceResponse | null>
}