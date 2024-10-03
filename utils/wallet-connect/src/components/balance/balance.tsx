import { useAccount, useApi, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';
import cx from 'clsx';

import { ReactComponent as VaraSVG } from '../../assets/vara.svg';
import styles from './balance.module.scss';

type Props = {
  variant: 'gear' | 'vara';
};

function Balance({ variant }: Props) {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();

  const { data: balances } = useDeriveBalancesAll({ address: account?.decodedAddress, watch: true });
  const balance = isApiReady && balances ? getFormattedBalance(balances.freeBalance) : undefined;

  if (!balance) return null;

  return (
    <div className={styles.balance}>
      <VaraSVG />

      <p className={cx(styles.text, styles[variant])}>
        <span className={styles.value}>{balance.value}</span>
        <span className={styles.unit}>{balance.unit}</span>
      </p>
    </div>
  );
}

export { Balance };
