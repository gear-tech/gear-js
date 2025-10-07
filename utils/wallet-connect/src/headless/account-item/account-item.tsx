import { mergeProps, useRender } from '@base-ui-components/react';
import { PropsWithChildren, useMemo } from 'react';

import { useAccountItemContext } from './context';

type AccountItemProps = PropsWithChildren & useRender.ComponentProps<'li'>;

type AccountItemState = {
  isActive: boolean;
};

function AccountItem({ render, children, ...props }: AccountItemProps) {
  const { isActive } = useAccountItemContext();

  const state = useMemo<AccountItemState>(() => ({ isActive }), [isActive]);

  const defaultProps: useRender.ElementProps<'li'> = {
    children,
  };

  return useRender<AccountItemState, HTMLLIElement>({
    defaultTagName: 'li',
    render,
    props: mergeProps<'li'>(defaultProps, props),
    state,
  });
}

export { AccountItem };
