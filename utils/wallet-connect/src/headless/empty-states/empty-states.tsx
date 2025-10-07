import { mergeProps, useRender } from '@base-ui-components/react';
import { useAccount } from '@gear-js/react-hooks';

import { IS_MOBILE_DEVICE } from '../../consts';
import { useAccountsListContext } from '../accounts-list';
import { useDialogContext } from '../dialog';

function NoWallets(props: useRender.ComponentProps<'p'>) {
  const { isAnyWallet } = useAccount();

  const defaultProps: useRender.ElementProps<'p'> = {
    children: 'A compatible wallet was not found or is disabled. Install it following the instructions.',
  };

  const element = useRender({
    defaultTagName: 'p',
    render: props.render,
    props: mergeProps<'p'>(defaultProps, props),
    enabled: !isAnyWallet,
  });

  return element;
}

function NoMobileWallets(props: useRender.ComponentProps<'p'>) {
  const { isAnyWallet } = useAccount();

  const defaultProps: useRender.ElementProps<'p'> = {
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

function NoAccounts(props: useRender.ComponentProps<'p'>) {
  const { accounts } = useAccountsListContext();
  const { walletAccounts } = useDialogContext();

  const defaultProps: useRender.ElementProps<'p'> = {
    children: 'No accounts found. Please open your extension and create a new account or import existing.',
  };

  const element = useRender({
    defaultTagName: 'p',
    render: props.render,
    props: mergeProps<'p'>(defaultProps, props),
    enabled: !walletAccounts || accounts.length === 0,
  });

  return element;
}

export { NoWallets, NoMobileWallets, NoAccounts };
