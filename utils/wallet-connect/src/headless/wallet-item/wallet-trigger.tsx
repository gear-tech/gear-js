import { useRender, mergeProps } from '@base-ui-components/react';

import { useWalletItemContext } from './context';

type Props = useRender.ComponentProps<'button'>;
type ElementProps = useRender.ElementProps<'button'>;

function WalletTrigger({ render, children, ...props }: Props) {
  const { isEnabled, onClick } = useWalletItemContext();

  const defaultProps: ElementProps = {
    type: 'button',
    disabled: !isEnabled,
    onClick,
    children,
  };

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  });
}

export { WalletTrigger };
