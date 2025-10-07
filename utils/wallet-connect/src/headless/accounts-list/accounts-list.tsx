import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { Children, PropsWithChildren, cloneElement, isValidElement, useMemo } from 'react';

import { AccountItemProvider } from '../account-item/context';
import { useDialogContext } from '../dialog/context';

import { AccountsListProvider } from './context';

type AccountsListProps = PropsWithChildren & useRender.ComponentProps<'ul'>;

type AccountsListState = {
  isEmpty: boolean;
};

function AccountsList({ render, children, ...props }: AccountsListProps) {
  const { account, login } = useAccount();
  const { walletAccounts } = useDialogContext();

  const accounts = useMemo(() => walletAccounts ?? [], [walletAccounts]);

  const state: AccountsListState = useMemo(() => ({ isEmpty: accounts.length === 0 }), [accounts.length]);

  const renderTemplate = () =>
    Children.map(children, (child) => (isValidElement(child) ? cloneElement(child) : child)) ?? null;

  const renderedItems = accounts.map((item) => {
    const isActive = item.address === account?.address;

    const handleSelect = () => {
      if (isActive) return;

      login(item);
    };

    return (
      <AccountItemProvider key={item.address} value={{ account: item, isActive, onSelect: handleSelect }}>
        {renderTemplate()}
      </AccountItemProvider>
    );
  });

  const defaultProps: useRender.ElementProps<'ul'> = {
    children: renderedItems,
  };

  const element = useRender<AccountsListState, HTMLUListElement>({
    defaultTagName: 'ul',
    render,
    props: mergeProps<'ul'>(defaultProps, props),
    state,
  });

  return <AccountsListProvider value={{ accounts }}>{element}</AccountsListProvider>;
}

export { AccountsList };
