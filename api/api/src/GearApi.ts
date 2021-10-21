import { GearProgram, GearMessage, transformTypes, GearBalance, GearEvents, GearMessageReply } from '.';
import { gearRpc, gearTypes } from './default';
import { GearApiOptions } from './interfaces';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { EventRecord } from '@polkadot/types/interfaces';
import { DecoratedEvents, PromiseResult } from '@polkadot/api/types';
import { Vec } from '@polkadot/types';
import { Observable } from 'rxjs';
import EventEmitter = require('events');

export class GearApi {
  api: ApiPromise;
  private _isReady: EventEmitter;
  public program: GearProgram;
  public message: GearMessage;
  public reply: GearMessageReply;
  public balance: GearBalance;
  public allEvents: PromiseResult<() => Observable<Vec<EventRecord>>>;
  public gearEvents: GearEvents;
  public events: DecoratedEvents<'promise'>;
  provider: WsProvider;
  defaultTypes: any;

  constructor(options?: GearApiOptions) {
    this.provider = new WsProvider(options?.providerAddress ?? 'ws://127.0.0.1:9944');
    this._isReady = new EventEmitter();
    this.createApiPromise(this.provider, options?.customTypes ?? undefined).then(() => {
      this._isReady.emit('ready');
      this.program = new GearProgram(this);
      this.message = new GearMessage(this);
      this.balance = new GearBalance(this);
      this.reply = new GearMessageReply(this);
      this.allEvents = this.api.query.system.events;
      this.events = this.api.events;
      this.gearEvents = new GearEvents(this);
    });
  }

  static async create(options?: GearApiOptions): Promise<GearApi> {
    const api = new GearApi(options);
    return await api.isReady();
  }

  isReady(): Promise<GearApi> {
    return new Promise((resolve) => {
      this._isReady.on('ready', () => {
        resolve(this);
      });
    });
  }

  /** Creating an api */
  private async createApiPromise(provider: WsProvider, customTypes?: Object): Promise<ApiPromise> {
    if (customTypes) {
      customTypes = 'types' in customTypes ? customTypes : { types: { ...customTypes } };
      this.defaultTypes = {
        ...gearTypes,
        ...transformTypes(customTypes)
      };
    } else {
      this.defaultTypes = gearTypes;
    }
    try {
      this.api = await ApiPromise.create({
        provider: provider,
        types: {
          ...this.defaultTypes
        },
        rpc: {
          ...gearRpc
        }
      });
    } catch (error) {
      console.log(error);
    }
    return this.api;
  }

  async totalIssuance(): Promise<string> {
    return (await this.api.query.balances.totalIssuance()).toHuman();
  }

  async chain(): Promise<string> {
    return (await this.api.rpc.system.chain()).toHuman();
  }

  async nodeName(): Promise<string> {
    return (await this.api.rpc.system.name()).toHuman();
  }

  async nodeVersion(): Promise<string> {
    return (await this.api.rpc.system.version()).toHuman();
  }
}
