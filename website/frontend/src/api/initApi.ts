import { GearApi } from '@gear-js/api';
import { API_CONNECTION_ADDRESS } from '../consts';

class NodeApi {
  get api(): GearApi | null {
    // eslint-disable-next-line no-underscore-dangle
    return this._api;
  }

  private readonly address;

  private _api: GearApi | null = null;

  constructor(address = 'ws://localhost:9944') {
    this.address = address;
  }

  async init() {
    // eslint-disable-next-line no-underscore-dangle
    this._api = await GearApi.create({ providerAddress: this.address });
  }
}

export const nodeApi = new NodeApi(API_CONNECTION_ADDRESS);
