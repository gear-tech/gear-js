import { useRender, mergeProps } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';

import { IS_MOBILE_DEVICE } from '@/consts';

type Props = useRender.ComponentProps<'p'>;
type ElementProps = useRender.ElementProps<'p'>;

function NoWallets({ render, ...props }: Props) {
  const { isAnyWallet } = useAccount();

  const defaultProps: ElementProps = {
    children: (
      <>
        A compatible wallet was not found or is disabled. Install it following the{' '}
        <a href="https://wiki.vara.network/docs/account" target="_blank" rel="noreferrer">
          instructions
        </a>
        .
      </>
    ),
  };

  const element = useRender({
    defaultTagName: 'p',
    props: mergeProps<'p'>(defaultProps, props),
    enabled: !isAnyWallet && !IS_MOBILE_DEVICE,
    render,
  });

  return element;
}

export { NoWallets };
