import { useAccount, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import cx from 'clsx';

import headerStyles from '../Header.module.scss';
import styles from './balance.module.scss';

const Balance = () => {
  const { account } = useAccount();
  const { balance } = useBalance(account?.address);
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;

  return formattedBalance ? (
    <section className={styles.balanceSection}>
      <h2 className={cx(headerStyles.title, styles.title)}>Balance:</h2>

      <p className={headerStyles.content}>
        <span className={cx(headerStyles.value, styles.value)}>{formattedBalance.value}</span>
        <span className={styles.unit}>{formattedBalance.unit}</span>
      </p>
    </section>
  ) : null;
};

export { Balance };
