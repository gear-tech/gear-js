import { Hex } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface Account extends InjectedAccountWithMeta {
  decodedAddress: Hex;
  balance: { value: string; unit: string };
}

export type { Account };
