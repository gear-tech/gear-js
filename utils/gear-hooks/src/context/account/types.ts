import type { HexString } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import type { Signer } from '@polkadot/types/types';

import type { WALLET_STATUS } from './consts';

type WalletStatus = (typeof WALLET_STATUS)[keyof typeof WALLET_STATUS];

type Account = InjectedAccountWithMeta & {
  decodedAddress: HexString;
  signer: Signer;
};

type Wallet = {
  id: string;
  status: WalletStatus;
  version?: string;
  accounts?: Account[];
  connect: () => Promise<void>;
};

type Wallets = Record<string, Wallet>;

export type { Account, Wallet, WalletStatus, Wallets };
