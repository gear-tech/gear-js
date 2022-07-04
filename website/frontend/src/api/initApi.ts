import { GearApi } from '@gear-js/api';
import { isNodeAddressValid } from 'helpers';
import { NODE_ADDRESS, NODE_ADRESS_URL_PARAM, LOCAL_STORAGE } from 'consts';

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

  constructor(address: string) {
    this._address = address;
    this.chain = null;
    this.genesis = null;
  }

  async init() {
    this._api = await GearApi.create({ providerAddress: this._address });
    this.chain = await this._api.chain();
    this.genesis = await this._api.genesisHash.toHex();

    localStorage.setItem(LOCAL_STORAGE.CHAIN, this.chain);
    localStorage.setItem(LOCAL_STORAGE.GENESIS, this.genesis);

    return this._api;
  }
}

const address = getNodeAddressFromUrl() || localStorage.getItem(LOCAL_STORAGE.NODE_ADDRESS) || NODE_ADDRESS;

export const nodeApi = new NodeApi(address);
