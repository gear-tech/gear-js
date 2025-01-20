import { useAccount, useApi, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';
import cx from 'clsx';

import VaraSVG from '../../assets/vara.svg';
import styles from './balance.module.scss';

type Props = {
  theme: 'gear' | 'vara';
};

function Balance({ theme }: Props) {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();

  const { data: balances } = useDeriveBalancesAll({ address: account?.decodedAddress, watch: true });

  const balance =
    isApiReady && balances ? getFormattedBalance(balances.transferable || balances.availableBalance) : undefined;

  if (!balance) return null;

  return (
    <div className={styles.balance}>
      <VaraSVG />

      <p className={cx(styles.text, styles[theme])}>
        <span className={styles.value}>{balance.value}</span>
        <span className={styles.unit}>{balance.unit}</span>
      </p>
    </div>
  );
}

export { Balance };
