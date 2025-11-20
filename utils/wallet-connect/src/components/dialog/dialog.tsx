import { useRender } from '@base-ui-components/react';
import { PropsWithChildren, ReactElement } from 'react';

import { useWallet } from '../../hooks';
import { DefaultDialog } from '../default-dialog';
import { useWalletContext } from '../root';

import { DialogProvider } from './context';

type DialogState = ReturnType<typeof useWalletContext>['dialog'] & {
  // probably should be passed as a props and not state,
  // but useRender's render doesn't use useRender.ComponentProps 3rd generic (RenderFunctionProps)
  heading: string;
  isWalletSelected: boolean;
};

type Props = PropsWithChildren & {
  render?:
    | ((props: PropsWithChildren, state: DialogState) => ReactElement<unknown>)
    | ReactElement<Record<string, unknown>>;
};

function Dialog({ render, ...props }: Props) {
  const { dialog } = useWalletContext();
  const wallet = useWallet(dialog.isOpen);

  const element = useRender({
    render: render ?? ((renderProps, state) => <DefaultDialog {...renderProps} {...state} />),
    state: { heading: 'Connect Wallet', isWalletSelected: Boolean(wallet.wallet), ...dialog },
    props,
  });

  return <DialogProvider value={wallet}>{element}</DialogProvider>;
}

export { Dialog };
