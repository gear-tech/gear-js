import { GearApi } from '@gear-js/api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Vec } from '@polkadot/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { EventRecord } from '@polkadot/types/interfaces';
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

  public subscribeAllEvents(cb: (event: Vec<EventRecord>) => void) {
    if (this._api && !this.subscriptions.allEvents) {
      this.subscriptions.allEvents = this._api.allEvents((event) => {
        cb(event);
      });
    }
  }

  public unsubscribeAllEvents() {
    if (this._api && !!this.subscriptions.allEvents) {
      (async () => {
        (await this.subscriptions.allEvents)();
      })();
    }
  }
}

export const nodeApi = new NodeApi(API_CONNECTION_ADDRESS);
