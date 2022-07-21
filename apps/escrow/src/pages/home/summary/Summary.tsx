import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import styles from './Summary.module.scss';

type Props = {
  programId: Hex;
  walletId: string;
  role: string | undefined;
  state: string | undefined;
  amount: string | undefined;
  onProgramReset: () => void;
  onWalletReset: () => void;
};

function Summary({ programId, walletId, role, state, amount, onProgramReset, onWalletReset }: Props) {
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
        <div>
          <p className={styles.text}>
            <span className={styles.key}>Program ID:</span> <span className={styles.value}>{programId}</span>
          </p>
          <Button text="Reset" color="secondary" size="small" className={styles.button} onClick={onProgramReset} />
        </div>
      )}
      {walletId && (
        <div>
          <p className={styles.text}>
            <span className={styles.key}>Wallet ID:</span> <span className={styles.value}>{walletId}</span>
          </p>
          <Button text="Reset" color="secondary" size="small" className={styles.button} onClick={onWalletReset} />
        </div>
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
