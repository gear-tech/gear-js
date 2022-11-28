import clsx from 'clsx';
import { STATUS } from 'consts';
import { DashboardProps } from 'types';
import styles from './Dashboard.module.scss';

function Dashboard({ startTime, endTime, status, winner, countdown }: DashboardProps) {
  const statusClassName = clsx(styles.status, status === STATUS.PENDING && styles.pending);

  return (
    <div>
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
            <span className={styles.key}>Winner:</span> <span className={styles.winner}>{winner || 'Unknown'}</span>
          </p>
        </div>
      </div>
      <p className={styles.countdown}>{countdown}</p>
    </div>
  );
}

export { Dashboard };
