import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';

import { useDialogContext } from '../dialog';
import { useWalletContext } from '../root';

type Props = useRender.ComponentProps<'button'>;
type ElementProps = useRender.ElementProps<'button'>;

function LogoutTrigger({ render, ...props }: Props) {
  const { account, logout } = useAccount();
  const { dialog } = useWalletContext();
  const { resetWalletId } = useDialogContext();

  const handleClick = () => {
    logout();
    resetWalletId();
    dialog.close();
  };

  const defaultProps: ElementProps = {
    type: 'button',
    onClick: handleClick,
    children: 'Logout',
  };

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    enabled: Boolean(account),
    render,
  });
}

export { LogoutTrigger };
