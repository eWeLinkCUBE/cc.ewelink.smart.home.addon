/// <reference types="node" />
/// <reference types="ws" />
import { IConfig, IDeviceConfig, IResponse, IWsParams, ISendDeviceParams } from '../ts/interfaces';
import WebSocket from 'isomorphic-ws';
export default class WebSocketService {
    static connectConfig: IConfig;
    static hbInterval: NodeJS.Timeout | null;
    static timeoutTimer: NodeJS.Timeout | null;
    static isOpen: boolean;
    static ws: WebSocket | null;
    wsState: string;
    private static initClose;
    private static heartBeat;
    static isReconnecting: boolean;
    private static listenerHook;
    private static retryCount;
    private static callBackStack;
    private static initTs;
    private static maxReconnectTime;
    private static reconnectTotalTime;
    constructor(config: IConfig);
    private _initWs;
    private reconnect;
    private onOpen;
    private onError;
    private onClose;
    private onMessage;
    private static _sendHandShakeMsg;
    private _waitForPingPong;
    private _onAllEventCallBack;
    private _getRetryInterval;
    static sendMessage(params: IWsParams | string): void;
    sendThing(deviceConfig: IDeviceConfig, action: 'query' | 'update' | 'upgrade'): Promise<ISendDeviceParams>;
    init(): Promise<IResponse>;
    close(userInit?: boolean): void;
    send(params: IWsParams | string): void;
    updateCallback(emitName: string, cb: any): void;
}
