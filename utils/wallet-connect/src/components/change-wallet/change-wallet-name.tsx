import { useRender, mergeProps } from '@base-ui-components/react';

import { useDialogContext } from '../dialog';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function ChangeWalletName({ render, ...props }: Props) {
  const { wallet } = useDialogContext();

  const defaultProps: ElementProps = {
    children: wallet?.name,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    enabled: Boolean(wallet),
    render,
  });
}

export { ChangeWalletName };
