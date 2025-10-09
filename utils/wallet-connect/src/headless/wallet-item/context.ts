import { createContext, useContext } from 'react';

import { WalletId, WalletValue } from '../../types';

export type WalletItemContextValue = {
  id: WalletId;
  wallet: WalletValue;
  isEnabled: boolean;
  isConnected: boolean;
  accountsLabel: string;
  onClick: () => void;
};

const WalletItemContext = createContext<WalletItemContextValue | undefined>(undefined);
const WalletItemProvider = WalletItemContext.Provider;

export function useWalletItemContext() {
  const context = useContext(WalletItemContext);

  if (!context) throw new Error('Wallet item context is missing. Place parts inside <Wallet.WalletItem>.');

  return context;
}

export { WalletItemProvider };
