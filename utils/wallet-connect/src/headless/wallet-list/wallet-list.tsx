import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { Children, PropsWithChildren, cloneElement, isValidElement, useMemo } from 'react';

import { WALLETS } from '../../consts';
import { useDialogContext } from '../dialog';
import { WalletItemProvider } from '../wallet-item';

import { WalletListContextValue, WalletListProvider } from './context';

type WalletListProps = PropsWithChildren & useRender.ComponentProps<'ul'>;

type WalletListState = {
  isEmpty: boolean;
};

function WalletList({ render, children, ...props }: WalletListProps) {
  const { wallets } = useAccount();
  const { setWalletId } = useDialogContext();

  const items: WalletListContextValue['items'] = useMemo(() => {
    return WALLETS.map(([id, wallet]) => {
      const walletState = wallets?.[id];
      const { status, accounts, connect } = walletState || {};

      const accountsCount = accounts?.length ?? 0;
      const accountsLabel = `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`;

      const isConnected = status === 'connected';
      const isEnabled = Boolean(status);

      const normalizedStatus = (() => {
        switch (status as string | undefined) {
          case 'connected':
            return 'connected';
          case 'connecting':
            return 'connecting';
          case 'disconnected':
            return 'disconnected';
          default:
            return 'unknown';
        }
      })();

      const handleConnect = () => {
        if (isConnected) {
          setWalletId(id);
          return;
        }

        return connect?.().catch((error: Error) => {
          console.error(error.message);
        });
      };

      return {
        id,
        wallet,
        status: normalizedStatus,
        isEnabled,
        isConnected,
        accountsCount,
        accountsLabel,
        connect: handleConnect,
      };
    });
  }, [setWalletId, wallets]);

  const contextValue = useMemo<WalletListContextValue>(() => ({ items, onSelect: setWalletId }), [items, setWalletId]);

  const state: WalletListState = useMemo(() => ({ isEmpty: items.length === 0 }), [items.length]);

  const createTemplate = () =>
    Children.map(children, (child) => (isValidElement(child) ? cloneElement(child) : child)) ?? null;

  const renderedItems = items.map((item) => (
    <WalletItemProvider
      key={item.id}
      value={{
        ...item,
        select: () => setWalletId(item.id),
      }}>
      {createTemplate()}
    </WalletItemProvider>
  ));

  const defaultProps: useRender.ElementProps<'ul'> = {
    children: renderedItems,
  };

  const element = useRender<WalletListState, HTMLUListElement>({
    defaultTagName: 'ul',
    render,
    props: mergeProps<'ul'>(defaultProps, props),
    state,
  });

  return <WalletListProvider value={contextValue}>{element}</WalletListProvider>;
}

export { WalletList };
