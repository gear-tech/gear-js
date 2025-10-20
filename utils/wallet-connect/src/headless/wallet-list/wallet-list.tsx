import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import { WALLETS } from '../../consts';
import { useDialogContext } from '../dialog';
import { WalletItemProvider } from '../wallet-item';

type Props = useRender.ComponentProps<'ul'>;
type ElementProps = useRender.ElementProps<'ul'>;

function WalletList({ render, children, ...props }: Props) {
  const { isAnyWallet, wallets } = useAccount();
  const { walletAccounts, setWalletId } = useDialogContext();

  const elements = useMemo(
    () =>
      WALLETS.map(([id, wallet]) => {
        const { status, accounts, connect } = wallets?.[id] || {};

        const isEnabled = Boolean(status);
        const isConnected = status === 'connected';

        const accountsCount = accounts?.length ?? 0;
        const accountsLabel = `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`;

        const onClick = () => {
          if (isConnected) return setWalletId(id);

          connect?.().catch((error: Error) => console.error(error.message));
        };

        const contextValue = { id, wallet, isEnabled, isConnected, accountsLabel, onClick };

        return (
          <WalletItemProvider key={id} value={contextValue}>
            {children}
          </WalletItemProvider>
        );
      }),
    [children, setWalletId, wallets],
  );

  const defaultProps: ElementProps = {
    children: elements,
  };

  return useRender({
    defaultTagName: 'ul',
    props: mergeProps<'ul'>(defaultProps, props),
    enabled: isAnyWallet && !walletAccounts,
    render,
  });
}

export { WalletList };
