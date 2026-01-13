import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';

type Props = useRender.ComponentProps<'span'>;
type ElementProps = useRender.ElementProps<'span'>;

function ConnectedAccountLabel({ render, ...props }: Props) {
  const { account, isAccountReady } = useAccount();

  const defaultProps: ElementProps = {
    children: account?.meta.name ?? account?.address,
  };

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    enabled: isAccountReady && Boolean(account),
    render,
  });
}

export { ConnectedAccountLabel };
