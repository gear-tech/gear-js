import { useRender, mergeProps } from '@base-ui-components/react';

import { useWalletItemContext } from './context';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function WalletName({ render, ...props }: Props) {
  const { wallet } = useWalletItemContext();

  const defaultProps: ElementProps = {
    children: wallet.name,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  });
}

export { WalletName };
