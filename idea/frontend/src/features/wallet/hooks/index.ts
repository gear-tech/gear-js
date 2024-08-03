import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { WALLET } from '../consts';
import { WalletId } from '../types';
import { useNewAccount } from '@/app/providers/account';

function useWallet() {
  const { account } = useNewAccount();

  const [walletId, setWalletId] = useState(account?.meta.source as WalletId | undefined);
  const wallet = walletId ? WALLET[walletId] : undefined;

  const resetWalletId = () => setWalletId(undefined);

  return { wallet, walletId, setWalletId, resetWalletId };
}

export { useWallet };
