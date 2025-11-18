import { mergeProps, useRender } from '@base-ui-components/react';
import { Identicon } from '@polkadot/react-identicon';

import { useAccountItemContext } from './context';

type IdenticonType = typeof Identicon;
type AccountIconProps = useRender.ComponentProps<IdenticonType, { address: string }>;
type ElementProps = useRender.ElementProps<IdenticonType>;

function AccountIcon({ render, ...props }: AccountIconProps) {
  const { account } = useAccountItemContext();

  const defaultProps: ElementProps = {
    value: account.address,
    size: 20,
  };

  return useRender({
    render: render ?? <Identicon />,
    props: mergeProps<IdenticonType>(defaultProps, props),
    state: { address: account.address },
  });
}

export { AccountIcon };
