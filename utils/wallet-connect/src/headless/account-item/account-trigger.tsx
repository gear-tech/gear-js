import { mergeProps, useRender } from '@base-ui-components/react';
import { useAlert, useAccount } from '@gear-js/react-hooks';
import { useCallback, useMemo } from 'react';

import { copyToClipboard } from '../../utils';
import { useWalletContext } from '../root';

import { useAccountItemContext } from './context';

type AccountTriggerProps = useRender.ComponentProps<'button'>;

type AccountTriggerState = {
  isActive: boolean;
};

function AccountTrigger({ render, children, ...props }: AccountTriggerProps) {
  const { onSelect, isActive } = useAccountItemContext();
  const { closeModal } = useWalletContext();

  const handleClick = useCallback(() => {
    if (isActive) return;

    onSelect();
    closeModal();
  }, [closeModal, isActive, onSelect]);

  const state = useMemo<AccountTriggerState>(() => ({ isActive }), [isActive]);

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    disabled: isActive,
    onClick: handleClick,
    children,
  };

  return useRender<AccountTriggerState, HTMLButtonElement>({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
    state,
  });
}

type AccountIconProps = useRender.ComponentProps<'span'>;

type AccountLabelProps = useRender.ComponentProps<'span'>;

type CopyTriggerProps = useRender.ComponentProps<'button'>;

function AccountIcon({ render, ...props }: AccountIconProps) {
  const { account } = useAccountItemContext();
  const { meta } = account;

  const defaultProps: useRender.ElementProps<'span'> = {
    children: meta.name?.[0] ?? account.address.slice(0, 2).toUpperCase(),
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

function AccountLabel({ render, ...props }: AccountLabelProps) {
  const { account } = useAccountItemContext();
  const { meta, address } = account;

  const defaultProps: useRender.ElementProps<'span'> = {
    children: meta.name ?? address,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

function CopyAccountAddressTrigger({ render, ...props }: CopyTriggerProps) {
  const { account } = useAccountItemContext();
  const { address } = account;
  const alert = useAlert();
  const { closeModal } = useWalletContext();
  const { account: activeAccount } = useAccount();

  const handleCopy = useCallback(() => {
    copyToClipboard({ value: address, alert });
    closeModal();
  }, [address, alert, closeModal]);

  const state = useMemo(() => ({ isActive: activeAccount?.address === address }), [activeAccount?.address, address]);

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    onClick: handleCopy,
  };

  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
    state,
  });
}

export { AccountTrigger, AccountIcon, AccountLabel, CopyAccountAddressTrigger };
