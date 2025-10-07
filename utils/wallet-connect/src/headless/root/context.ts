import { createContext, useContext } from 'react';

export type WalletContextValue = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const { Provider: WalletProvider } = WalletContext;

export function useWalletContext() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('Wallet context is missing. Place wallet parts inside <Wallet.Root>.');
  }

  return context;
}

export { WalletProvider };
