import { createContext, useContext } from 'react';

import { WalletId, WalletValue } from '../../types';

export type WalletListContextValue = {
  items: Array<{
    id: WalletId;
    wallet: WalletValue;
    status: 'unknown' | 'connecting' | 'connected' | 'disconnected';
    isEnabled: boolean;
    isConnected: boolean;
    accountsCount: number;
    accountsLabel: string;
    connect: () => Promise<void> | void;
  }>;
  onSelect: (walletId: WalletId) => void;
};

const WalletListContext = createContext<WalletListContextValue | undefined>(undefined);

const { Provider: WalletListProvider } = WalletListContext;

export function useWalletListContext() {
  const context = useContext(WalletListContext);

  if (!context) {
    throw new Error('Wallet list context is missing. Place parts inside <Wallet.WalletList>.');
  }

  return context;
}

export { WalletListProvider };
