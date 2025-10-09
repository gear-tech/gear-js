import { useRender } from '@base-ui-components/react';
import { Identicon } from '@polkadot/react-identicon';

import { useAccountItemContext } from './context';

type AccountIconProps = useRender.ComponentProps<'span'>;

function AccountIcon({ render, ...props }: AccountIconProps) {
  const { account } = useAccountItemContext();

  return useRender({
    render: render ?? <Identicon value={account.address} />,
    props,
  });
}

export { AccountIcon };
