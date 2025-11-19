import { buttonStyles } from '@gear-js/ui';

import { cx } from '@/utils';

import { Wallet } from '../../headless';
import { AccountList } from '../account-list';
import { Balance } from '../balance';
import { UI_CONFIG } from '../consts';
import { ModalFooter } from '../modal-footer';
import { ThemeProps } from '../types';
import { WalletList } from '../wallet-list';

import styles from './styled-wallet.module.scss';

type Props = Partial<ThemeProps> & {
  displayBalance?: boolean;

  // temp solution to support responsiveness in dApps MenuHandler, until it's supported here
  accountButtonClassName?: string;
};

function StyledWallet({ theme = 'vara', displayBalance = true, accountButtonClassName }: Props) {
  const { TriggerConnect, TriggerConnected, Dialog } = UI_CONFIG[theme];

  return (
    <Wallet.Root className={styles.wallet}>
      {displayBalance && <Balance theme={theme} />}

      <Wallet.TriggerConnect render={TriggerConnect} />

      <Wallet.TriggerConnected render={TriggerConnected} className={accountButtonClassName}>
        <Wallet.ConnectedAccountIcon
          theme="polkadot"
          size={16}
          className={theme === 'gear' ? cx(buttonStyles.icon, styles.accountIcon) : undefined}
        />

        <Wallet.ConnectedAccountLabel />
      </Wallet.TriggerConnected>

      <Wallet.Dialog
        render={(props, state) =>
          state.isOpen ? (
            <Dialog footer={state.isWalletSelected && <ModalFooter theme={theme} />} {...props} {...state} />
          ) : (
            <></>
          )
        }>
        <WalletList theme={theme} />
        <AccountList theme={theme} />

        <Wallet.NoWallets className={cx(styles.text, styles[theme])} />
        <Wallet.NoMobileWallets className={cx(styles.text, styles[theme])} />
        <Wallet.NoAccounts className={cx(styles.text, styles[theme])} />
      </Wallet.Dialog>
    </Wallet.Root>
  );
}

export { StyledWallet };
