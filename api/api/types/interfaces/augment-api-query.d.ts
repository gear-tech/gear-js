import { Option, BTreeMap } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';
import { Message } from '.';
declare module '@polkadot/api/types/storage' {
  interface AugmentedQueries<ApiType> {
    gear: {
      mailbox: (accountId: string | AccountId32) => Option<BTreeMap<H256, Message>>;
    };
  }
}
