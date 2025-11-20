import { useRender, mergeProps } from '@base-ui-components/react';

import { getTruncatedText } from '@/utils';

import { useAccountItemContext } from './context';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function AccountLabel({ render, ...props }: Props) {
  const { account } = useAccountItemContext();
  const { meta, address } = account;

  const defaultProps: ElementProps = {
    children: meta.name ?? getTruncatedText(address),
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

export { AccountLabel };
