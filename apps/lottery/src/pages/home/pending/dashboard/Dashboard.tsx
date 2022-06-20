import clsx from 'clsx';
import { isPending } from 'utils';
import styles from './Dashboard.module.scss';

type Props = {
  startTime: string;
  endTime: string;
  status: string;
  winner: string | undefined;
};

function Dashboard({ startTime, endTime, status, winner }: Props) {
  const statusClassName = clsx(styles.status, isPending(status) && styles.pending);

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
          <span className={styles.key}>Status:</span> <span className={statusClassName}>{status}</span>
        </p>
        <p>
          <span className={styles.key}>Winner:</span> {winner || 'Unknown'}
        </p>
      </div>
    </div>
  );
}

export { Dashboard };
