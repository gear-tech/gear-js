import { buttonStyles } from '@gear-js/ui';

import { cx } from '@/utils';

import { Wallet as HeadlessWallet } from '../../components';
import { AccountList } from '../account-list';
import { Balance } from '../balance';
import { UI_CONFIG } from '../consts';
import { ModalFooter } from '../modal-footer';
import { ThemeProps } from '../types';
import { WalletList } from '../wallet-list';

import styles from './wallet.module.scss';

type Props = Partial<ThemeProps> & {
  displayBalance?: boolean;

  // temp solution to support responsiveness in dApps MenuHandler, until it's supported here
  accountButtonClassName?: string;
};

function Wallet({ theme = 'vara', displayBalance = true, accountButtonClassName }: Props) {
  const { TriggerConnect, TriggerConnected, Dialog } = UI_CONFIG[theme];

  return (
    <HeadlessWallet.Root className={styles.wallet}>
      {displayBalance && <Balance theme={theme} />}

      <HeadlessWallet.TriggerConnect render={TriggerConnect} />

      <HeadlessWallet.TriggerConnected render={TriggerConnected} className={accountButtonClassName}>
        <HeadlessWallet.ConnectedAccountIcon
          theme="polkadot"
          size={16}
          className={theme === 'gear' ? cx(buttonStyles.icon, styles.accountIcon) : undefined}
        />

        <HeadlessWallet.ConnectedAccountLabel />
      </HeadlessWallet.TriggerConnected>

      <HeadlessWallet.Dialog
        render={(props, state) =>
          state.isOpen ? (
            <Dialog footer={state.isWalletSelected && <ModalFooter theme={theme} />} {...props} {...state} />
          ) : (
            <></>
          )
        }>
        <WalletList theme={theme} />
        <AccountList theme={theme} />

        <HeadlessWallet.NoWallets className={cx(styles.text, styles[theme])} />
        <HeadlessWallet.NoMobileWallets className={cx(styles.text, styles[theme])} />
        <HeadlessWallet.NoAccounts className={cx(styles.text, styles[theme])} />
      </HeadlessWallet.Dialog>
    </HeadlessWallet.Root>
  );
}

export { Wallet };
