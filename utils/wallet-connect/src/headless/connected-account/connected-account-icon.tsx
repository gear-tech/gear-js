import { mergeProps, useRender } from '@base-ui-components/react';
import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';

type IdenticonType = typeof Identicon;
type Props = useRender.ComponentProps<IdenticonType, { address: HexString }>;
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
    state: { address: account!.decodedAddress },
    props: mergeProps<IdenticonType>(defaultProps, props),
  });
}

export { ConnectedAccountIcon };
