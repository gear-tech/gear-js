import { mergeProps, useRender } from '@base-ui-components/react';
import { PropsWithChildren, useMemo } from 'react';

import { useWallet } from '../../hooks';
import { useWalletContext } from '../root';

import { DialogProvider } from './context';
import { DefaultDialog } from './default-dialog';

type DialogProps = PropsWithChildren & useRender.ComponentProps<'div'>;
type DialogState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

function Dialog({ render: renderProp, children, ...props }: DialogProps) {
  const { isModalOpen, openModal, closeModal } = useWalletContext();
  const { wallet, walletId, walletAccounts, setWalletId, resetWalletId } = useWallet();

  const contextValue = useMemo(
    () => ({ wallet, walletId, walletAccounts, setWalletId, resetWalletId }),
    [resetWalletId, setWalletId, wallet, walletAccounts, walletId],
  );

  const defaultProps: useRender.ElementProps<'div'> = {
    children,
  };

  const defaultRender: useRender.RenderProp<DialogState> = (renderProps, state) => (
    <DefaultDialog isOpen={state.isOpen} close={state.close}>
      {renderProps.children}
    </DefaultDialog>
  );

  const render = renderProp ?? defaultRender;

  const body = useRender<DialogState, HTMLDivElement, boolean>({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, props),
    state: { isOpen: isModalOpen, open: openModal, close: closeModal },
    enabled: isModalOpen,
  });

  if (!isModalOpen || !body) {
    return null;
  }

  return <DialogProvider value={contextValue}>{body}</DialogProvider>;
}

export { Dialog };
