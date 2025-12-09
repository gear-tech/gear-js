import styles from './balance.module.scss';

type Props = {
  value: string | null;
  units: string;
};

const Balance = ({ value, units }: Props) => {
  return (
    <span className={styles.wrapper}>
      <span className={styles.value}>{value === null ? '-' : value}</span> {units}
    </span>
  );
};

export { Balance };
