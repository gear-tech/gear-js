import { ReactNode } from 'react';
import { Hex } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export type Props = {
  children: ReactNode;
};

interface Account extends InjectedAccountWithMeta {
  decodedAddress: Hex;
  balance: { value: string; unit: string };
}

export type { Account };
