import { useState } from 'react';

import { LocalStorage } from '@/shared/config';

import { WALLET } from '../consts';
import { WalletId } from '../types';

function useWallet() {
  const [walletId, setWalletId] = useState(localStorage[LocalStorage.Wallet] as WalletId | null);

  const resetWallet = () => setWalletId(null);

  const wallet = walletId ? WALLET[walletId] : undefined;

  return { wallet, walletId, switchWallet: setWalletId, resetWallet };
}

export { useWallet };
