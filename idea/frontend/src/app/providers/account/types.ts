import { HexString } from '@gear-js/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { WALLET_STATUS } from './consts';

type WalletStatus = typeof WALLET_STATUS[keyof typeof WALLET_STATUS];

type Account = InjectedAccountWithMeta & {
  decodedAddress: HexString;
};

type Wallet = {
  id: string;
  status: WalletStatus;
  version?: string;
  accounts?: Account[];
  connect: () => Promise<void>;
};

type Wallets = Record<string, Wallet>;

export type { WalletStatus, Wallet, Wallets };
