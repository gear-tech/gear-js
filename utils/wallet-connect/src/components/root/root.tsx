import { useRender } from '@base-ui-components/react';
import { useMemo, useState } from 'react';

import { WalletProvider } from './context';

type Props = useRender.ComponentProps<'div'>;

function Root({ render, ...props }: Props) {
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

  const element = useRender({ render, props });

  return <WalletProvider value={contextValue}>{element}</WalletProvider>;
}

export { Root };
