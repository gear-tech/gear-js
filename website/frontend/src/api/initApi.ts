import { GearApi } from '@gear-js/api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Event } from '@polkadot/types/interfaces';
import { UnsubscribePromise } from '@polkadot/api/types';
import { API_CONNECTION_ADDRESS } from '../consts';

class NodeApi {
  get api(): GearApi | null {
    return this._api;
  }

  private readonly address;

  private _api: GearApi | null = null;

  readonly subscriptions: Record<string, UnsubscribePromise> = {};

  constructor(address = 'ws://localhost:9944') {
    this.address = address;
    this.subscriptions = {};
  }

  async init() {
    this._api = await GearApi.create({ providerAddress: this.address });
  }

  public subscribeProgramEvents(cb: (event: Event) => void) {
    if (this._api && !('programEvents' in this.subscriptions)) {
      this.subscriptions.programEvents = this._api.gearEvents.subsribeProgramEvents((event) => {
        cb(event);
      });
    }
  }

  public unsubscribeProgramEvents() {
    if ('programEvents' in this.subscriptions) {
      (async () => {
        (await this.subscriptions.programEvents)();
      })();
    }
  }

  public subscribeLogEvents(cb: (event: Event) => void) {
    if (this._api && !('logEvents' in this.subscriptions)) {
      this.subscriptions.logEvents = this._api.gearEvents.subscribeLogEvents((event) => {
        console.log(event);
        cb(event);
      });
    }
  }

  public unsubscribeLogEvents() {
    if ('logEvents' in this.subscriptions) {
      (async () => {
        (await this.subscriptions.logEvents)();
      })();
    }
  }
}

export const nodeApi = new NodeApi(API_CONNECTION_ADDRESS);
