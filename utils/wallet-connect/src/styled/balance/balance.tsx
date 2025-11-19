import { Wallet } from '@/headless';
import { cx } from '@/utils';

import { ThemeProps } from '../types';

import styles from './balance.module.scss';

function Balance({ theme }: ThemeProps) {
  return (
    <Wallet.Balance className={styles.balance}>
      <Wallet.BalanceIcon />

      <div className={cx(styles.text, styles[theme])}>
        <Wallet.BalanceValue className={styles.value} />
        <Wallet.BalanceSymbol className={styles.symbol} />
      </div>
    </Wallet.Balance>
  );
}

export { Balance };
