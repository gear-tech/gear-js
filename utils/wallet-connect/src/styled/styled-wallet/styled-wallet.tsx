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

      {/* TODO: remove global dialog context */}
      {/* @ts-expect-error -- no props */}
      <Wallet.Dialog render={<Modal footer={<ModalFooter />} />}>
        <WalletList />
        <AccountList />

        {/* TODO: if consumer would like to wrap all of empty texts into single container, how to control it's conditional rendering? */}
        {/* is it valid case? */}
        <Wallet.NoWallets className={cx(styles.text, styles.vara)} />
        <Wallet.NoMobileWallets className={cx(styles.text, styles.vara)} />
        <Wallet.NoAccounts className={cx(styles.text, styles.vara)} />
      </Wallet.Dialog>
    </Wallet.Root>
  );
}

export { StyledWallet };
