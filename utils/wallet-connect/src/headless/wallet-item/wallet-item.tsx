import { mergeProps, useRender } from '@base-ui-components/react';
import { PropsWithChildren, useMemo } from 'react';

import { useWalletItemContext } from './context';

type WalletItemProps = PropsWithChildren & useRender.ComponentProps<'li'>;

type WalletItemState = {
  status: 'unknown' | 'connecting' | 'connected' | 'disconnected';
  isEnabled: boolean;
  isConnected: boolean;
  accountsCount: number;
  accountsLabel: string;
};

function WalletItem({ render, children, ...props }: WalletItemProps) {
  const { status, isEnabled, isConnected, accountsCount, accountsLabel } = useWalletItemContext();

  const state = useMemo<WalletItemState>(
    () => ({ status, isEnabled, isConnected, accountsCount, accountsLabel }),
    [accountsCount, accountsLabel, isConnected, isEnabled, status],
  );

  const defaultProps: useRender.ElementProps<'li'> = {
    children,
  };

  return useRender<WalletItemState, HTMLLIElement>({
    defaultTagName: 'li',
    render,
    props: mergeProps<'li'>(defaultProps, props),
    state,
  });
}

export { WalletItem };
