import { mergeProps, useRender } from '@base-ui-components/react';

import { useAccountItemContext } from './context';

type Props = useRender.ComponentProps<'button'>;

function AccountTrigger({ render, children, ...props }: Props) {
  const { onClick, isActive } = useAccountItemContext();

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    disabled: isActive,
    onClick,
    children,
  };

  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
  });
}

export { AccountTrigger };
