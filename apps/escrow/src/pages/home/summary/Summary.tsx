import { Hex } from '@gear-js/api';
import clsx from 'clsx';
import styles from './Summary.module.scss';

type Props = {
  programId: Hex;
  walletId: string;
  role: string | undefined;
  state: string | undefined;
  amount: string | undefined;
};

function Summary({ programId, walletId, role, state, amount }: Props) {
  const roleClassName = clsx(styles.value, styles.role);
  const stateClassName = clsx(styles.value, styles.state);

  return (
    <div className={styles.summary}>
      {role && (
        <p className={styles.text}>
          <span className={styles.key}>Role:</span> <span className={roleClassName}>{role}</span>
        </p>
      )}
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
      {state && (
        <p className={styles.text}>
          <span className={styles.key}>State:</span> <span className={stateClassName}>{state}</span>
        </p>
      )}
      {amount && (
        <p className={styles.text}>
          <span className={styles.key}>Amount:</span> <span className={styles.value}>{amount}</span>
        </p>
      )}
    </div>
  );
}

export { Summary };
