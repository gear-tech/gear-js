import { useAccountDeriveBalancesAll, useApi, useBalanceFormat } from '@gear-js/react-hooks';
import cx from 'clsx';

import headerStyles from '@/widgets/header/ui/Header.module.scss';

import styles from './balance.module.scss';

const Balance = () => {
  const { isApiReady } = useApi();
  const balances = useAccountDeriveBalancesAll();
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = isApiReady && balances ? getFormattedBalance(balances.freeBalance) : undefined;

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
