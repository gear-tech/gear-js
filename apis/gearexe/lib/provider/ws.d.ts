import { IGearExeProvider, ISubscriptionCallback } from '../types/index.js';
type WsUrl = `ws://${string}` | `wss://${string}`;
export declare class WsGearexeProvider implements IGearExeProvider {
    private _url;
    private _conn;
    private _isConnected;
    constructor(_url: WsUrl);
    private _onOpen;
    private _onClose;
    private _onError;
    private _onMessage;
    get isConnected(): boolean;
    get url(): WsUrl;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send<Result = unknown>(_method: string, _parameters: unknown[]): Promise<Result>;
    subscribe(_method: string, _parameters: unknown[], _callback: ISubscriptionCallback): number;
    unsubscribe(_id: number): void;
}
export {};
