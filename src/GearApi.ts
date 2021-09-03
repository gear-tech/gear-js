import { GearProgram, GearMessage, transformTypes, GearBalance, GearEvents } from '@gear-js';
import { gearRpc, gearTypes } from '@gear-js/default';
import { GearApiOptions } from '@gear-js/interfaces';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { EventRecord } from '@polkadot/types/interfaces';
import { PromiseResult } from '@polkadot/api/types';
import { Vec } from '@polkadot/types';
import { Observable } from 'rxjs';
import EventEmitter = require('events');

export class GearApi {
  api: ApiPromise;
  private _isReady: EventEmitter;
  public program: GearProgram;
  public message: GearMessage;
  public balance: GearBalance;
  public events: PromiseResult<() => Observable<Vec<EventRecord>>>;
  public gearEvents: GearEvents;
  provider: WsProvider;
  defaultTypes: any;

  constructor(options?: GearApiOptions) {
    this.provider = new WsProvider(options.providerAddress);
    this._isReady = new EventEmitter();
    this.createApiPromise(this.provider, options.customTypes).then(() => {
      this._isReady.emit('ready');
      this.program = new GearProgram(this);
      this.message = new GearMessage(this);
      this.balance = new GearBalance(this);
      this.events = this.api.query.system.events;
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
    this.api = await ApiPromise.create({
      provider: provider,
      types: {
        ...this.defaultTypes
      },
      rpc: {
        ...gearRpc
      }
    });
    return this.api;
  }

  async totalIssuance(): Promise<string> {
    return (await this.api.query.balances.totalIssuance()).toHuman();
  }
}
