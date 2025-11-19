import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import { AccountItemProvider } from '../account-item';
import { useDialogContext } from '../dialog';
import { useWalletContext } from '../root';

type Props = useRender.ComponentProps<'ul'>;
type ElementProps = useRender.ElementProps<'ul'>;

function AccountsList({ render, children, ...props }: Props) {
  const { account, login } = useAccount();
  const { dialog } = useWalletContext();
  const { walletAccounts } = useDialogContext();

  const elements = useMemo(
    () =>
      walletAccounts?.map((item) => {
        const isActive = item.address === account?.address;

        const onClick = () => {
          if (isActive) return;

          login(item);
          dialog.close();
        };

        return (
          <AccountItemProvider key={item.address} value={{ account: item, isActive, onClick }}>
            {children}
          </AccountItemProvider>
        );
      }),
    [account?.address, walletAccounts, children, dialog, login],
  );

  const defaultProps: ElementProps = {
    children: elements,
  };

  return useRender({
    defaultTagName: 'ul',
    props: mergeProps<'ul'>(defaultProps, props),
    render,
  });
}

export { AccountsList };
