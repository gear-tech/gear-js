import { createContext, useContext } from 'react';

export type ConnectedAccountContextValue = {
  address: string;
  decodedAddress: string;
  name?: string;
};

const ConnectedAccountContext = createContext<ConnectedAccountContextValue | undefined>(undefined);

const { Provider: ConnectedAccountProvider } = ConnectedAccountContext;

export function useConnectedAccountContext() {
  const context = useContext(ConnectedAccountContext);

  if (!context) {
    throw new Error('Connected account context is missing. Place parts inside <Wallet.TriggerConnected>.');
  }

  return context;
}

export { ConnectedAccountProvider };
