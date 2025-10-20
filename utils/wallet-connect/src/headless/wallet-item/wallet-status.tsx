import { useRender, mergeProps } from '@base-ui-components/react';

import { useWalletItemContext } from './context';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function WalletStatus({ render, ...props }: Props) {
  const { isConnected } = useWalletItemContext();

  const defaultProps: ElementProps = {
    children: isConnected ? 'Enabled' : 'Disabled',
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  });
}

export { WalletStatus };
