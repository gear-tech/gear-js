import { useRender } from '@base-ui-components/react';

import { useWallet } from '../../hooks';
import { DefaultDialog } from '../default-dialog';
import { useWalletContext } from '../root';

import { DialogProvider } from './context';

type DialogProps = useRender.ComponentProps<'div'>;

function Dialog({ render, ...props }: DialogProps) {
  const { dialog } = useWalletContext();
  const wallet = useWallet();

  const element = useRender({
    defaultTagName: 'div',
    render: render ?? <DefaultDialog isOpen={dialog.isOpen} close={dialog.close} />,
    enabled: dialog.isOpen,
    props,
  });

  if (!dialog.isOpen) return;

  return <DialogProvider value={wallet}>{element}</DialogProvider>;
}

export { Dialog };
