import { Button } from '@gear-js/vara-ui';

import { Wallet } from '@/headless';
import { cx } from '@/utils';

import styles from './wallet-list.module.scss';

function WalletList() {
  return (
    <Wallet.WalletList className={styles.list}>
      <Wallet.WalletItem>
        <Wallet.WalletTrigger render={<Button text="" color="plain" size="small" block />} className={styles.button}>
          <span className={styles.wallet}>
            <Wallet.WalletIcon className={styles.walletIcon} />
            <Wallet.WalletName />
          </span>

          <span className={styles.status}>
            <Wallet.WalletStatus className={cx(styles.statusText, styles.vara)} />
            <Wallet.WalletAccountsLabel className={cx(styles.statusAccounts, styles.vara)} />
          </span>
        </Wallet.WalletTrigger>
      </Wallet.WalletItem>
    </Wallet.WalletList>
  );
}

export { WalletList };
