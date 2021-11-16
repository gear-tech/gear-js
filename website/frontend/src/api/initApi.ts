import { GearApi } from '@gear-js/api';

// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEvent, ProgramEvent, TransferEvent } from '@gear-js/api/types/types';
import { UnsubscribePromise } from '@polkadot/api/types';
import { API_CONNECTION_ADDRESS } from '../consts';

class NodeApi {
  get api(): GearApi | null {
    return this._api;
  }

  private address: string;

  private chain: string | null;

  private _api: GearApi | null = null;

  readonly subscriptions: Record<string, UnsubscribePromise> = {};

  constructor(address = 'ws://localhost:9944') {
    this.address = address;
    this.subscriptions = {};
    this.chain = null;
  }

  async init() {
    this.address = window.localStorage.getItem('node_address') || this.address;
    this._api = await GearApi.create({ providerAddress: this.address });

    this.chain = await this._api.chain();
    localStorage.setItem('chain', this.chain);
  }

  public subscribeProgramEvents(cb: (event: ProgramEvent) => void) {
    if (this._api && !('programEvents' in this.subscriptions)) {
      this.subscriptions.programEvents = this._api.gearEvents.subscribeProgramEvents((event: ProgramEvent) => {
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

  public subscribeLogEvents(cb: (event: LogEvent) => void) {
    if (this._api && !('logEvents' in this.subscriptions)) {
      this.subscriptions.logEvents = this._api.gearEvents.subscribeLogEvents((event: LogEvent) => {
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

  public subscribeTransferEvents(cb: (event: TransferEvent) => void) {
    if (this._api && !('subscribeTransferEvents' in this.subscriptions)) {
      this.subscriptions.subscribeTransferEvents = this._api.gearEvents.subscribeTransferEvents(
        (event: TransferEvent) => {
          cb(event);
        }
      );
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
