import { useEffect, useState } from 'react';
import { web3Enable } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

import { LocalStorage } from 'shared/config';

import { WALLET, WalletId } from '../model';

function useWallet() {
  const [walletId, setWalletId] = useState<WalletId | undefined>(localStorage[LocalStorage.Wallet]);

  const resetWallet = () => {
    setWalletId(undefined);
  };

  const wallet = walletId ? WALLET[walletId] : undefined;

  return { wallet, walletId, switchWallet: setWalletId, resetWallet };
}

function useExtensions() {
  const [extensions, setExtensions] = useState<InjectedExtension[]>();

  useEffect(() => {
    web3Enable('gear idea').then((result) => setExtensions(result.length > 0 ? result : undefined));
  }, []);

  return extensions;
}

export { useWallet, useExtensions };
