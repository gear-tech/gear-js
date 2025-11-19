import { Modal as GearModal, buttonStyles } from '@gear-js/ui';
import { Button as VaraButton, Modal as VaraModal } from '@gear-js/vara-ui';

import { cx } from '@/utils';

import { Wallet } from '../../headless';
import { AccountList } from '../account-list';
import { Balance } from '../balance';
import { GearButton } from '../gear-button';
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
  const renderTriggerConnect = () => (theme === 'vara' ? <VaraButton text="" /> : <GearButton text="" />);

  const renderTriggerConnected = () =>
    theme === 'vara' ? <VaraButton text="" color="contrast" /> : <GearButton text="" color="light" />;

  const Modal = theme === 'vara' ? VaraModal : GearModal;

  return (
    <Wallet.Root className={styles.wallet}>
      {displayBalance && <Balance theme={theme} />}

      <Wallet.TriggerConnect render={renderTriggerConnect()} />

      <Wallet.TriggerConnected render={renderTriggerConnected()} className={accountButtonClassName}>
        <Wallet.ConnectedAccountIcon
          theme="polkadot"
          size={16}
          className={theme === 'gear' ? cx(buttonStyles.icon, styles.accountIcon) : undefined}
        />

        <Wallet.ConnectedAccountLabel />
      </Wallet.TriggerConnected>

      <Wallet.Dialog
        render={(props, state) =>
          state.isOpen ? <Modal footer={<ModalFooter theme={theme} />} {...props} {...state} /> : <></>
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
