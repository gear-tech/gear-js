import { useAccount, useApi, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';
import cx from 'clsx';

import headerStyles from '@/widgets/header/ui/Header.module.scss';

import styles from './balance.module.scss';

const Balance = () => {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { data: balance } = useDeriveBalancesAll({ address: account?.address });
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = isApiReady && balance ? getFormattedBalance(balance.freeBalance) : undefined;

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
