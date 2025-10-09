import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';

type IdenticonType = typeof Identicon;
type Props = useRender.ComponentProps<IdenticonType>;
type ElementProps = useRender.ElementProps<IdenticonType>;

function ConnectedAccountIcon({ render, ...props }: Props) {
  const { account } = useAccount();

  const defaultProps: ElementProps = {
    value: account?.decodedAddress,
    size: 20,
  };

  return useRender({
    render: render ?? <Identicon />,
    enabled: Boolean(account),
    props: mergeProps<IdenticonType>(defaultProps, props),
  });
}

export { ConnectedAccountIcon };
