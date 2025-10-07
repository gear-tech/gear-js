import { createContext, useContext } from 'react';

import { useWallet } from '../../hooks';

export type DialogContextValue = ReturnType<typeof useWallet>;

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

const { Provider: DialogProvider } = DialogContext;

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog context is missing. Place dialog parts inside <Wallet.Dialog>.');
  }

  return context;
}

export { DialogProvider };
