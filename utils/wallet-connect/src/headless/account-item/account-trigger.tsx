import { mergeProps, useRender } from '@base-ui-components/react';

import { useAccountItemContext } from './context';

type Props = useRender.ComponentProps<'button', { isActive: boolean }>;

function AccountTrigger({ render, children, ...props }: Props) {
  const { onClick, isActive } = useAccountItemContext();

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    onClick,
    children,
  };

  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(defaultProps, props),
    state: { isActive },
  });
}

export { AccountTrigger };
