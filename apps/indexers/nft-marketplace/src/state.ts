import { Store } from '@subsquid/typeorm-store';

import { NftContract } from './model';

class NftState {
  nftContracts: string[] = [];

  isNft(id: string, store: Store) {
    return store.findOneBy(NftContract, { id });
  }

  add(id: string, store: Store) {
    this.nftContracts.push(id);
    return store.save(new NftContract({ id }));
  }
}

export const nftState = new NftState();
