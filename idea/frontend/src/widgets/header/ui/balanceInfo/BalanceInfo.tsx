import clsx from 'clsx';
import { Account } from '@gear-js/react-hooks';

import styles from './BalanceInfo.module.scss';
import headerStyles from '../Header.module.scss';

type Props = {
  balance: Account['balance'];
};

const BalanceInfo = ({ balance }: Props) => {
  const { unit = 'Unit', value } = balance;

  return (
    <section className={styles.balanceSection}>
      <h2 className={clsx(headerStyles.title, styles.title)}>Balance</h2>
      <p className={headerStyles.content}>
        <span className={clsx(headerStyles.value, styles.value)}>{value}</span>
        <span className={styles.unit}>{unit}</span>
      </p>
    </section>
  );
};

export { BalanceInfo };
