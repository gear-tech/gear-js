import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import { useWalletContext } from '../root';

import { ConnectedAccountProvider } from './connected-account-context';

type TriggerProps = useRender.ComponentProps<'button'>;

type TriggerElementProps = useRender.ElementProps<'button'>;

function TriggerConnect({ render, children, ...props }: TriggerProps) {
  const { account } = useAccount();
  const { openModal } = useWalletContext();

  const defaultProps: TriggerElementProps = {
    type: 'button',
    onClick: openModal,
    children: children ?? 'Connect Wallet',
  };

  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
  });

  if (account) {
    return null;
  }

  return element;
}

function TriggerConnected({ render, children, ...props }: TriggerProps) {
  const { account } = useAccount();
  const { openModal } = useWalletContext();

  const contextValue = useMemo(() => {
    if (!account) {
      return undefined;
    }

    const { address, decodedAddress, meta } = account;

    return {
      address,
      decodedAddress: decodedAddress ?? address,
      name: meta?.name,
    };
  }, [account]);

  const defaultProps: TriggerElementProps = {
    type: 'button',
    onClick: openModal,
    children,
  };

  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
  });

  if (!account || !contextValue) {
    return null;
  }

  return <ConnectedAccountProvider value={contextValue}>{element}</ConnectedAccountProvider>;
}

export { TriggerConnect, TriggerConnected };
