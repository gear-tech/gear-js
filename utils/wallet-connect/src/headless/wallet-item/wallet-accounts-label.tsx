import { useRender, mergeProps } from '@base-ui-components/react';

import { useWalletItemContext } from './context';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function WalletAccountsLabel({ render, ...props }: Props) {
  const { isConnected, accountsLabel } = useWalletItemContext();

  const defaultProps: ElementProps = {
    children: accountsLabel,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    enabled: isConnected,
    render,
  });
}

export { WalletAccountsLabel };
