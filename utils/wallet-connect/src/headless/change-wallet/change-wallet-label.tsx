import { mergeProps, useRender } from '@base-ui-components/react';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function ChangeWalletLabel({ render, ...props }: Props) {
  const defaultProps: ElementProps = {
    children: 'Change wallet',
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  });
}

export { ChangeWalletLabel };
