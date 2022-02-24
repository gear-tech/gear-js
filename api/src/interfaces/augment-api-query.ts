import { UnsubscribePromise } from '@polkadot/api/types';
import { Option, BTreeMap } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';
import { Hex } from './gear-type';
import { QueuedMessage } from './message';

declare module '@polkadot/api/types/storage' {
  export interface AugmentedQueries<ApiType> {
    gear: {
      mailbox: {
        (accountId: string | Hex | AccountId32): Promise<Option<BTreeMap<H256, QueuedMessage>>>;
        (
          accountId: string | Hex | AccountId32,
          callback: (data: Option<BTreeMap<H256, QueuedMessage>>) => void | Promise<void>,
        ): UnsubscribePromise;
      };
    };
  }
}
