import { mergeProps, useRender } from '@base-ui-components/react';

import { useDialogContext } from '../dialog';

type Props = useRender.ComponentProps<'button'>;
type ElementProps = useRender.ElementProps<'button'>;

function ChangeWalletTrigger({ render, ...props }: Props) {
  const { wallet, resetWalletId } = useDialogContext();

  const defaultProps: ElementProps = {
    type: 'button',
    onClick: () => resetWalletId(),
  };

  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
    enabled: Boolean(wallet),
  });

  return element;
}

export { ChangeWalletTrigger };
