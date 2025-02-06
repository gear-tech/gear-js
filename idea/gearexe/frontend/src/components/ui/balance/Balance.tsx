import styles from './Balance.module.scss';

type Props = {
  balances: { value: string; units: string }[];
};

const Balance = ({ balances }: Props) => {
  return (
    <div className={styles.container}>
      {balances.map(({ value, units }, index) => {
        const isLast = index === balances.length - 1;

        return (
          <>
            <span>
              <span className={styles.value}>{value}</span> {units}
            </span>
            {!isLast && <div className={styles.divider} />}
          </>
        );
      })}
    </div>
  );
};

export { Balance };
