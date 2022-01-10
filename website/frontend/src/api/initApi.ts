import { GearApi } from '@gear-js/api';

import { LogEvent, ProgramEvent, TransferEvent } from '@gear-js/api/types/types';
import { UnsubscribePromise } from '@polkadot/api/types';
import { isNodeAddressValid } from 'helpers';
import { NODE_ADDRESS, NODE_ADRESS_URL_PARAM } from '../consts';

const getNodeAddressFromUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM) || '';

  return isNodeAddressValid(nodeAddress) && nodeAddress;
};

class NodeApi {
  get api(): GearApi | null {
    return this._api;
  }

  get address(): string {
    return this._address;
  }

  private _address: string;

  private chain: string | null;

  private genesis: string | null;

  private _api: GearApi | null = null;

  readonly subscriptions: Record<string, UnsubscribePromise> = {};

  constructor(address = 'ws://localhost:9944') {
    this._address = address;
    this.subscriptions = {};
    this.chain = null;
    this.genesis = null;
  }

  async init() {
    this._address = getNodeAddressFromUrl() || localStorage.getItem('node_address') || this._address;
    this._api = await GearApi.create({ providerAddress: this._address });

    this.chain = await this._api.chain();
    this.genesis = await this._api.genesisHash.toHex();

    localStorage.setItem('chain', this.chain);
    localStorage.setItem('genesis', this.genesis);
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

export const nodeApi = new NodeApi(NODE_ADDRESS);
