import { createContext, useContext } from 'react';

import { WalletId, WalletValue } from '../../types';

export type WalletItemContextValue = {
  id: WalletId;
  wallet: WalletValue;
  status: 'unknown' | 'connecting' | 'connected' | 'disconnected';
  isEnabled: boolean;
  isConnected: boolean;
  accountsCount: number;
  accountsLabel: string;
  connect: () => Promise<void> | void;
  select: () => void;
};

const WalletItemContext = createContext<WalletItemContextValue | undefined>(undefined);

const { Provider: WalletItemProvider } = WalletItemContext;

export function useWalletItemContext() {
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error('Wallet item context is missing. Place parts inside <Wallet.WalletItem>.');
  }

  return context;
}

export { WalletItemProvider };
