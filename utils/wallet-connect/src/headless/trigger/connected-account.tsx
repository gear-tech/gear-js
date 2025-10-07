import { mergeProps, useRender } from '@base-ui-components/react';
import { Identicon } from '@polkadot/react-identicon';

import { useConnectedAccountContext } from './connected-account-context';

type IconProps = useRender.ComponentProps<'span'>;

type IconElementProps = useRender.ElementProps<'span'>;

type LabelProps = useRender.ComponentProps<'span'>;

type LabelElementProps = useRender.ElementProps<'span'>;

function ConnectedAccountIcon({ render, ...props }: IconProps) {
  const { decodedAddress } = useConnectedAccountContext();

  const defaultProps: IconElementProps = {
    children: <Identicon value={decodedAddress} size={20} theme="polkadot" />,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

function ConnectedAccountLabel({ render, ...props }: LabelProps) {
  const { name, address } = useConnectedAccountContext();

  const defaultProps: LabelElementProps = {
    children: name ?? address,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

export { ConnectedAccountIcon, ConnectedAccountLabel };
