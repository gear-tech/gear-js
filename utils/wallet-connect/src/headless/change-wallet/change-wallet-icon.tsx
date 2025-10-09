import { useRender, mergeProps } from '@base-ui-components/react';

import { useDialogContext } from '../dialog';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function ChangeWalletIcon({ render, ...props }: Props) {
  const { wallet } = useDialogContext();
  const { SVG } = wallet || {};

  const defaultProps: ElementProps = {
    children: SVG ? <SVG /> : undefined,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
    enabled: Boolean(wallet),
  });
}

export { ChangeWalletIcon };
