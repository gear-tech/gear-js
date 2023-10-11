import { useState } from 'react';

import { LocalStorage } from '@/shared/config';

import { WALLET, WalletId } from '../model';

function useWallet() {
  const [walletId, setWalletId] = useState<WalletId | undefined>(localStorage[LocalStorage.Wallet]);

  const resetWallet = () => setWalletId(undefined);

  const wallet = walletId ? WALLET[walletId] : undefined;

  return { wallet, walletId, switchWallet: setWalletId, resetWallet };
}

export { useWallet };
