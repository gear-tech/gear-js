import { createContext, Dispatch, SetStateAction, useContext } from 'react';

type WalletContextValue = {
  dialog: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: Dispatch<SetStateAction<boolean>>;
  };
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);
const WalletProvider = WalletContext.Provider;

function useWalletContext() {
  const context = useContext(WalletContext);

  if (!context) throw new Error('Wallet context is missing. Place wallet parts inside <Wallet.Root>.');

  return context;
}

export { WalletProvider, useWalletContext };
