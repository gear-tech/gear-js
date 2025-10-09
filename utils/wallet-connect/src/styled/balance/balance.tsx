import { Wallet } from '@/headless';
import { cx } from '@/utils';

import styles from './balance.module.scss';

function Balance() {
  return (
    <Wallet.Balance className={cx(styles.balance, styles.vara)}>
      <Wallet.BalanceIcon />

      <div className={styles.text}>
        <Wallet.BalanceValue className={styles.value} />
        <Wallet.BalanceSymbol className={styles.symbol} />
      </div>
    </Wallet.Balance>
  );
}

export { Balance };
