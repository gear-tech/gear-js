import clsx from 'clsx';

import styles from './balance.module.scss';

type Props = {
  value: string;
  units: string;
  withDivider?: boolean;
};

const Balance = ({ value, units, withDivider }: Props) => {
  return (
    <span className={clsx(styles.wrapper, withDivider && styles.divider)}>
      <span className={styles.value}>{value}</span> {units}
    </span>
  );
};

export { Balance };
