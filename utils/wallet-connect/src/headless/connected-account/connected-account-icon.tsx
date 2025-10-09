import { useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';

type Props = useRender.ComponentProps<typeof Identicon>;

function ConnectedAccountIcon({ render, ...props }: Props) {
  const { account } = useAccount();

  return useRender({
    render: render ?? <Identicon value={account?.decodedAddress} size={20} />,
    enabled: Boolean(account),
    props,
  });
}

export { ConnectedAccountIcon };
