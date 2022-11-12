import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';
import { AccountsModal } from '../accounts-modal';
import { Button } from '../button';
import styles from './Connect.module.scss';

function Connect() {
  const { accounts } = useAccount();

  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

  const openAccountsModal = () => setIsAccountsModalOpen(true);
  const closeAccountsModal = () => setIsAccountsModalOpen(false);

  return (
    <>
      <div className={styles.overlay}>
        <h2 className={styles.heading}>Welcome to Syndote</h2>
        <p className={styles.subheading}>Connect your wallet to start</p>

        <Button text="Connect wallet" onClick={openAccountsModal} />
      </div>
      {isAccountsModalOpen && <AccountsModal accounts={accounts} close={closeAccountsModal} />}
    </>
  );
}

export { Connect };
