import { useRender, mergeProps } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';

import { IS_MOBILE_DEVICE } from '@/consts';

type Props = useRender.ComponentProps<'p'>;
type ElementProps = useRender.ElementProps<'p'>;

function NoMobileWallets(props: Props) {
  const { isAnyWallet } = useAccount();

  const defaultProps: ElementProps = {
    children:
      'To use this application on mobile devices, open this page inside compatible wallets like Nova or SubWallet.',
  };

  const element = useRender({
    defaultTagName: 'p',
    render: props.render,
    props: mergeProps<'p'>(defaultProps, props),
    enabled: !isAnyWallet && IS_MOBILE_DEVICE,
  });

  return element;
}

export { NoMobileWallets };
