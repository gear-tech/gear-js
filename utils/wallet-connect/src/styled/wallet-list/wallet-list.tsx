import { Button } from '@gear-js/vara-ui';

import { Wallet } from '@/headless';
import { cx } from '@/utils';

import { GearButton } from '../gear-button';
import { ThemeProps } from '../types';

import styles from './wallet-list.module.scss';

function WalletList({ theme }: ThemeProps) {
  const renderWalletTrigger = () =>
    theme === 'vara' ? (
      <Button text="" color="plain" size="small" block />
    ) : (
      <GearButton text="" size="large" color="light" block />
    );

  return (
    <Wallet.WalletList className={styles.list}>
      <Wallet.WalletItem>
        <Wallet.WalletTrigger render={renderWalletTrigger()} className={styles.button}>
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
