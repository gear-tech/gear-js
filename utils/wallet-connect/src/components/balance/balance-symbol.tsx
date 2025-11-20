import { useRender, mergeProps } from '@base-ui-components/react';

import { useBalanceContext } from './context';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function BalanceSymbol({ render, ...props }: Props) {
  const { unit } = useBalanceContext();

  const defaultProps: ElementProps = {
    children: unit,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  });
}

export { BalanceSymbol };
