import styles from './Dashboard.module.scss';

type Props = {
  startTime: string;
  endTime: string;
  status: string;
  winner: string | undefined;
};

function Dashboard({ startTime, endTime, status, winner }: Props) {
  return (
    <div className={styles.dashboard}>
      <div className={styles.row}>
        <p>
          <span className={styles.key}>Start time:</span> {startTime}
        </p>
        <p>
          <span className={styles.key}>End time:</span> {endTime}
        </p>
      </div>
      <div className={styles.row}>
        <p>
          <span className={styles.key}>Status:</span> {status}
        </p>
        <p>
          <span className={styles.key}>Winner:</span> {winner || 'Unknown'}
        </p>
      </div>
    </div>
  );
}

export { Dashboard };
