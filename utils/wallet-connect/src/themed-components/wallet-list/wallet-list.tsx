import { Wallet } from '@/components';
import { cx } from '@/utils';

import { UI_CONFIG } from '../consts';
import { ThemeProps } from '../types';

import styles from './wallet-list.module.scss';

function WalletList({ theme }: ThemeProps) {
  const { WalletTrigger } = UI_CONFIG[theme];

  return (
    <Wallet.WalletList className={styles.list}>
      <Wallet.WalletItem>
        <Wallet.WalletTrigger render={WalletTrigger} className={styles.button}>
          <span className={styles.wallet}>
            <Wallet.WalletIcon className={styles.walletIcon} />
            <Wallet.WalletName />
          </span>

          <span className={styles.status}>
            <Wallet.WalletStatus className={cx(styles.statusText, styles[theme])} />
            <Wallet.WalletAccountsLabel className={cx(styles.statusAccounts, styles[theme])} />
          </span>
        </Wallet.WalletTrigger>
      </Wallet.WalletItem>
    </Wallet.WalletList>
  );
}

export { WalletList };
