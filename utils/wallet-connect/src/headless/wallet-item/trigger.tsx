import { mergeProps, useRender } from '@base-ui-components/react';
import { useMemo } from 'react';

import { useWalletItemContext } from './context';

type WalletTriggerProps = useRender.ComponentProps<'button'>;

type WalletTriggerState = {
  status: 'unknown' | 'connecting' | 'connected' | 'disconnected';
  isEnabled: boolean;
  isConnected: boolean;
};

function WalletTrigger({ render, children, ...props }: WalletTriggerProps) {
  const { status, isEnabled, isConnected, connect } = useWalletItemContext();

  const state = useMemo<WalletTriggerState>(
    () => ({ status, isEnabled, isConnected }),
    [isConnected, isEnabled, status],
  );

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    disabled: !isEnabled,
    onClick: () => {
      const result = connect();

      if (result instanceof Promise) {
        void result.catch((error: Error) => {
          console.error(error.message);
        });
      }
    },
    children,
  };

  return useRender<WalletTriggerState, HTMLButtonElement>({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
    state,
  });
}

type WalletIconProps = useRender.ComponentProps<'span'>;

type WalletNameProps = useRender.ComponentProps<'span'>;

type WalletStatusProps = useRender.ComponentProps<'span'>;

type WalletAccountsProps = useRender.ComponentProps<'span'>;

function WalletIcon({ render, ...props }: WalletIconProps) {
  const { wallet } = useWalletItemContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: <wallet.SVG aria-hidden />,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

function WalletName({ render, ...props }: WalletNameProps) {
  const { wallet } = useWalletItemContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: wallet.name,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

function WalletStatus({ render, ...props }: WalletStatusProps) {
  const { isConnected, isEnabled } = useWalletItemContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: isConnected ? 'Enabled' : isEnabled ? 'Disabled' : 'Unavailable',
  };

  const state = useMemo(() => ({ isConnected, isEnabled }), [isConnected, isEnabled]);

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
    state,
  });
}

function WalletAccounts({ render, ...props }: WalletAccountsProps) {
  const { isConnected, accountsLabel } = useWalletItemContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: accountsLabel,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
    enabled: isConnected,
  });
}

export { WalletTrigger, WalletIcon, WalletName, WalletStatus, WalletAccounts };
