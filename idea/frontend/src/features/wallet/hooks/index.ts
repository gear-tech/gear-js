import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { WALLET } from '../consts';
import { WalletId } from '../types';

function useWallet() {
  const { account } = useAccount();

  const defaultWalletId = account?.meta.source as WalletId | undefined;
  const [walletId, setWalletId] = useState(defaultWalletId);
  const wallet = walletId ? WALLET[walletId] : undefined;

  useEffect(() => {
    setWalletId(defaultWalletId);
  }, [defaultWalletId]);

  const resetWalletId = () => setWalletId(undefined);

  return { wallet, walletId, setWalletId, resetWalletId };
}

export { useWallet };
