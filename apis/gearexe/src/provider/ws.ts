import { IGearExeProvider, ISubscriptionCallback } from '../types/index.js';

type WsUrl = `ws://${string}` | `wss://${string}`;

export class WsGearexeProvider implements IGearExeProvider {
  private _conn: WebSocket;
  private _isConnected: boolean;

  constructor(private _url: WsUrl) {
    this.connect();
  }

  private _onOpen() {
    this._isConnected = true;
  }

  private _onClose() {
    this._isConnected = false;
  }

  private _onError() {
    throw new Error('Connection error');
  }

  private _onMessage() {
    throw new Error('Method not implemented.');
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get url(): WsUrl {
    return this._url;
  }

  async connect(): Promise<void> {
    this._conn = new WebSocket(this._url);

    this._conn.addEventListener('open', this._onOpen);
    this._conn.addEventListener('close', this._onClose);
    this._conn.onerror = this._onError;
    this._conn.onmessage = this._onMessage;
  }

  async disconnect(): Promise<void> {
    this._conn.close();
  }

  send<Result = unknown>(_method: string, _parameters: unknown[]): Promise<Result> {
    throw new Error('Method not implemented.');
  }

  subscribe(_method: string, _parameters: unknown[], _callback: ISubscriptionCallback): number {
    throw new Error('Method not implemented.');
  }

  unsubscribe(_id: number): void {
    throw new Error('Method not implemented.');
  }
}
