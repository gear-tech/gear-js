import { useRender, mergeProps } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';

import { useWalletContext } from '../root';

type Props = useRender.ComponentProps<'button'>;
type ElementProps = useRender.ElementProps<'button'>;

function TriggerConnect({ render, ...props }: Props) {
  const { account, isAccountReady } = useAccount();
  const { dialog } = useWalletContext();

  const defaultProps: ElementProps = {
    type: 'button',
    children: 'Connect Wallet',
    onClick: dialog.open,
  };

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    enabled: isAccountReady && !account,
    render,
  });
}

export { TriggerConnect };
