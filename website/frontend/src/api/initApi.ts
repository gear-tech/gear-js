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
      this.subscriptions.programEvents = this._api.gearEvents.subscribeProgramEvents((event) => {
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

  public subscribeTransferEvents(cb: (event: Event) => void) {
    if (this._api && !('subscribeTransferEvents' in this.subscriptions)) {
      this.subscriptions.subscribeTransferEvents = this._api.gearEvents.subscribeTransferEvents((event) => {
        cb(event);
      });
    }
  }

  public unsubscribeTransferEvents() {
    if ('subscribeTransferEvents' in this.subscriptions) {
      (async () => {
        (await this.subscriptions.subscribeTransferEvents)();
      })();
    }
  }
}

export const nodeApi = new NodeApi(API_CONNECTION_ADDRESS);
