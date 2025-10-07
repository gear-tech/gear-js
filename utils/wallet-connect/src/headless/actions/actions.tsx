import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import { useDialogContext } from '../dialog';
import { useWalletContext } from '../root';

type ChangeWalletTriggerProps = useRender.ComponentProps<'button'>;

type ChangeWalletState = {
  hasWallet: boolean;
};

function ChangeWalletTrigger({ render, children, ...props }: ChangeWalletTriggerProps) {
  const { wallet, resetWalletId } = useDialogContext();
  const { closeModal } = useWalletContext();

  const handleClick = () => {
    resetWalletId();
    closeModal();
  };

  const state = useMemo<ChangeWalletState>(() => ({ hasWallet: Boolean(wallet) }), [wallet]);

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    onClick: handleClick,
    children,
  };

  const element = useRender<ChangeWalletState, HTMLButtonElement, boolean>({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
    state,
    enabled: Boolean(wallet),
  });

  return element;
}

type ChangeWalletIconProps = useRender.ComponentProps<'span'>;

type ChangeWalletNameProps = useRender.ComponentProps<'span'>;

type ChangeWalletLabelProps = useRender.ComponentProps<'span'>;

type LogoutTriggerProps = useRender.ComponentProps<'button'>;

function ChangeWalletIcon({ render, ...props }: ChangeWalletIconProps) {
  const { wallet } = useDialogContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: wallet ? <wallet.SVG aria-hidden /> : null,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
    enabled: Boolean(wallet),
  });
}

function ChangeWalletName({ render, ...props }: ChangeWalletNameProps) {
  const { wallet } = useDialogContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: wallet?.name,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
    enabled: Boolean(wallet),
  });
}

function ChangeWalletLabel({ render, ...props }: ChangeWalletLabelProps) {
  const defaultProps: useRender.ElementProps<'span'> = {
    children: 'Change wallet',
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

function LogoutTrigger({ render, ...props }: LogoutTriggerProps) {
  const { account, logout } = useAccount();
  const { closeModal } = useWalletContext();
  const { resetWalletId } = useDialogContext();

  const handleClick = () => {
    logout();
    resetWalletId();
    closeModal();
  };

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    onClick: handleClick,
    children: 'Logout',
  };

  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
    enabled: Boolean(account),
  });
}

export { ChangeWalletTrigger, ChangeWalletIcon, ChangeWalletName, ChangeWalletLabel, LogoutTrigger };
