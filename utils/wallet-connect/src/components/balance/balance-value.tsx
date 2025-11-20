import { useRender, mergeProps } from '@base-ui-components/react';

import { useBalanceContext } from './context';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function BalanceValue({ render, ...props }: Props) {
  const { value } = useBalanceContext();

  const defaultProps: ElementProps = {
    children: value,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  });
}

export { BalanceValue };
