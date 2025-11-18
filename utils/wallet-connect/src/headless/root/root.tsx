import { ComponentPropsWithRef, useMemo, useState } from 'react';

import { WalletProvider } from './context';

function Root(props: ComponentPropsWithRef<'div'>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      dialog: {
        isOpen: isDialogOpen,
        open: () => setIsDialogOpen(true),
        close: () => setIsDialogOpen(false),
        toggle: setIsDialogOpen,
      },
    }),
    [isDialogOpen],
  );

  return (
    <WalletProvider value={contextValue}>
      <div {...props} />
    </WalletProvider>
  );
}

export { Root };
