import { Button, Modal } from '@gear-js/vara-ui';

import { cx } from '@/utils';

import { Wallet } from '../../headless';
import { AccountList } from '../account-list';
import { Balance } from '../balance';
import { ModalFooter } from '../modal-footer';
import { WalletList } from '../wallet-list';

import styles from './styled-wallet.module.scss';

function StyledWallet() {
  return (
    <Wallet.Root className={styles.wallet}>
      <Balance />

      <Wallet.TriggerConnect render={<Button text="" />} />

      <Wallet.TriggerConnected render={<Button text="" color="contrast" />}>
        <Wallet.ConnectedAccountIcon theme="polkadot" size={16} />
        <Wallet.ConnectedAccountLabel />
      </Wallet.TriggerConnected>

      <Wallet.Dialog
        render={(props, state) => (state.isOpen ? <Modal footer={<ModalFooter />} {...props} {...state} /> : <></>)}>
        <WalletList />
        <AccountList />

        <Wallet.NoWallets className={cx(styles.text, styles.vara)} />
        <Wallet.NoMobileWallets className={cx(styles.text, styles.vara)} />
        <Wallet.NoAccounts className={cx(styles.text, styles.vara)} />
      </Wallet.Dialog>
    </Wallet.Root>
  );
}

export { StyledWallet };
