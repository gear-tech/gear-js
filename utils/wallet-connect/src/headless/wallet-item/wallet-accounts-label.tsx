import { useRender, mergeProps } from '@base-ui-components/react';

import { useWalletItemContext } from './context';

type Props = useRender.ComponentProps<'span', { accountsCount: number }>;
type ElementProps = useRender.ElementProps<'span'>;

function WalletAccountsLabel({ render, ...props }: Props) {
  const { isConnected, accountsCount } = useWalletItemContext();

  const defaultProps: ElementProps = {
    children: `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    state: { accountsCount },
    enabled: isConnected,
    render,
  });
}

export { WalletAccountsLabel };
