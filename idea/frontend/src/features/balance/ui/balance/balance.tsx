import { useBalanceFormat } from '@gear-js/react-hooks';
import { Balance as BalanceType } from '@polkadot/types/interfaces';

import styles from './balance.module.scss';

type Props = {
  value: BalanceType | undefined;
};

function Balance({ value }: Props) {
  const { getFormattedBalance } = useBalanceFormat();

  if (!value) return null;

  const balance = getFormattedBalance(value);

  return (
    <p>
      <span className={styles.value}>{balance.value}</span>
      &nbsp;
      <span className={styles.unit}>{balance.unit}</span>
    </p>
  );
}

export { Balance };
