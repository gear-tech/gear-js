import { useRender, mergeProps } from '@base-ui-components/react';

import { useWalletItemContext } from './context';

type Props = useRender.ComponentProps<'span'>;

function WalletIcon({ render, ...props }: Props) {
  const { wallet } = useWalletItemContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: <wallet.SVG aria-hidden />,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  });
}

export { WalletIcon };
