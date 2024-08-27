import { useAccount } from '@gear-js/react-hooks';
import { useSignlessTransactions } from '../../context';
import { ReactComponent as Signless } from '@/assets/icons/signless.svg';
import styles from './signless-active.module.css';

function SignlessActive() {
  const { account } = useAccount();
  const { session, isSessionReady } = useSignlessTransactions();

  return account && isSessionReady && session ? (
    <div className={styles.container}>
      <Signless />
      <span className={styles.text}>Signless Session</span>
    </div>
  ) : null;
}

export { SignlessActive };
