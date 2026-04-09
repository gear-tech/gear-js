import type { IVaraEthProvider } from 'types';
import type { Address, Hash, Hex } from 'viem';

type InjectedTx = {
  data: { destination: Address; payload: Hex; value: number; referenceBlock: Hash; salt: Hash };
  signature: Hex;
  address: Address;
};

export class InjectedQueries {
  constructor(private _provider: IVaraEthProvider) {}

  async getTransaction(id: Hash) {
    const txs = await this.getTransactions([id]);

    const tx = txs[0];

    if (tx === null) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    return tx;
  }

  async getTransactions(ids: Hash[]) {
    if (ids.length === 0) return [];

    const response = await this._provider.send<InjectedTx[]>('injected_getTransactions', [ids]);

    return response;
  }
}
