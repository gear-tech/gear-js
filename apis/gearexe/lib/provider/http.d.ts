import { IGearExeProvider } from '../types/index.js';
type HttpUrl = `http://${string}` | `https://${string}`;
export declare class HttpGearexeProvider implements IGearExeProvider {
    private _url;
    constructor(_url?: HttpUrl);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send<Result = unknown>(method: string, parameters: unknown[]): Promise<Result>;
    subscribe(): number;
    unsubscribe(): void;
}
export {};
