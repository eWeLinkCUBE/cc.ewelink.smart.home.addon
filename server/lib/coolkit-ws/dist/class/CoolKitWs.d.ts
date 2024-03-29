import { IConfig, IDeviceConfig, IDeviceResponse, IQueryConfig, IReconnectEvent, IResponse, IUpgradeConfig, IWsParams } from '../ts/interfaces';
import WebSocket from 'ws';
export default class CoolKitWs {
    private static ws;
    init(config: IConfig): Promise<IResponse>;
    close(): void;
    isWsExist(): boolean;
    isWsConnected(): boolean;
    wsState(): string | null;
    sendMessage(params: IWsParams | string): void;
    updateThing(deviceConfig: IDeviceConfig): Promise<IDeviceResponse | IResponse>;
    queryThing(queryConfig: IQueryConfig): Promise<IDeviceResponse | IResponse>;
    upgradeThing(upgradeConfig: IUpgradeConfig): Promise<IDeviceResponse | IResponse>;
    on(method: 'message', callback: (event: {
        data: any;
        type: string;
        target: WebSocket;
    }) => void, options?: WebSocket.EventListenerOptions): Promise<void>;
    on(method: 'open', callback: (event: {
        target: WebSocket;
    }) => void, options?: WebSocket.EventListenerOptions): Promise<void>;
    on(method: 'error', callback: (event: {
        error: any;
        message: any;
        type: string;
        target: WebSocket;
    }) => void, options?: WebSocket.EventListenerOptions): Promise<void>;
    on(method: 'close', callback: (event: {
        wasClean: boolean;
        code: number;
        reason: string;
        target: WebSocket;
    }) => void, options?: WebSocket.EventListenerOptions): Promise<void>;
    on(method: 'reconnect', callback: (reconnectInfo: IReconnectEvent) => void): Promise<void>;
    private getMessage;
    private getWs;
}
