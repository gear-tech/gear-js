import { Hex } from '@gear-js/api';
import clsx from 'clsx';
import styles from './Players.module.scss';

type Props = {
  list: Hex[];
  balance: string;
};

function Players({ list, balance }: Props) {
  const isAnyPlayer = list.length > 0;

  const headerClassName = clsx(styles.row, styles.header);
  const addressClassName = clsx(styles.cell, styles.address);
  const textClassName = clsx(styles.cell, styles.text);

  const getPlayers = () =>
    list.map((playerId, index) => (
      <li key={playerId} className={styles.row}>
        <span className={styles.cell}>{index}</span>
        <span className={addressClassName}>{playerId}</span>
        <span className={styles.cell}>{balance}</span>
      </li>
    ));

  return (
    <div>
      <h3 className={styles.heading}>Player list</h3>
      <header className={headerClassName}>
        <span className={styles.cell}>Player Index</span>
        <span className={styles.cell}>Address</span>
        <span className={styles.cell}>Amount</span>
      </header>
      {isAnyPlayer ? (
        <ul>{getPlayers()}</ul>
      ) : (
        <p className={textClassName}>There aren&apos;t any players at the moment.</p>
      )}
    </div>
  );
}

export { Players };
