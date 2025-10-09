import { mergeProps, useRender } from '@base-ui-components/react';

import { useWallet } from '../../hooks';
import { DefaultDialog } from '../default-dialog';
import { useWalletContext } from '../root';

import { DialogProvider } from './context';

type DialogProps = useRender.ComponentProps<'div'>;

// TODO: types
function Dialog({ render, ...props }: DialogProps) {
  const { dialog } = useWalletContext();
  const wallet = useWallet();

  // TODO: types
  const defaultProps = {
    heading: 'Connect Wallet',
    isOpen: dialog.isOpen,
    close: dialog.close,
  };

  const element = useRender({
    // @ts-expect-error -- no props
    render: render ?? <DefaultDialog />,
    enabled: dialog.isOpen,
    props: mergeProps(defaultProps, props),
  });

  if (!dialog.isOpen) return;

  return <DialogProvider value={wallet}>{element}</DialogProvider>;
}

export { Dialog };
