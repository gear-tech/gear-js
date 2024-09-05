import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { Balance as BalanceType } from '@polkadot/types/interfaces';
import cx from 'clsx';

import styles from './balance.module.scss';

type Props = {
  value: BalanceType | string | bigint | undefined;
  variant?: 'primary' | 'secondary';
  hideUnit?: boolean;
};

function Balance({ value, variant = 'primary', hideUnit }: Props) {
  const { isApiReady } = useApi();
  const { getFormattedBalance } = useBalanceFormat();

  if (!value || !isApiReady) return null;

  const balance = getFormattedBalance(value);
  const splittedBalance = balance.value.split('.');

  return (
    // span cuz used inside of button
    <span>
      <span className={cx(styles.value, styles[variant])}>{splittedBalance[0]}</span>
      <span className={cx(styles.unit, styles[variant])}>
        .{splittedBalance[1]} {!hideUnit && balance.unit}
      </span>
    </span>
  );
}

export { Balance };
