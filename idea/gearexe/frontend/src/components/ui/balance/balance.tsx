import clsx from 'clsx';

import styles from './balance.module.scss';

type Props = {
  value: string | null;
  units: string;
  withDivider?: boolean;
};

const Balance = ({ value, units, withDivider }: Props) => {
  return (
    <span className={clsx(styles.wrapper, withDivider && styles.divider)}>
      <span className={styles.value}>{value === null ? '-' : value}</span> {units}
    </span>
  );
};

export { Balance };
