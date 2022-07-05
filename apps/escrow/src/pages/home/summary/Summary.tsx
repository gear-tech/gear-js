import { Hex } from '@gear-js/api';
import styles from './Summary.module.scss';

type Props = {
  programId: Hex;
  walletId: string;
};

function Summary({ programId, walletId }: Props) {
  return (
    <div className={styles.summary}>
      {programId && (
        <p className={styles.text}>
          <span className={styles.key}>Program ID:</span> <span className={styles.value}>{programId}</span>
        </p>
      )}
      {walletId && (
        <p className={styles.text}>
          <span className={styles.key}>Wallet ID:</span> <span className={styles.value}>{walletId}</span>
        </p>
      )}
    </div>
  );
}

export { Summary };
