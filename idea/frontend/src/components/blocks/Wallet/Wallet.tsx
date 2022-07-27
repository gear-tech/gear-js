import clsx from 'clsx';
import Identicon from '@polkadot/react-identicon';
import { useAccount, useAccounts } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';

import styles from './Wallet.module.scss';

import { AccountsModal } from 'components/modals/AccountsModal';
import { useState } from 'react';

const Wallet = () => {
  const { account } = useAccount();
  const { accounts } = useAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const balanceSectionClassName = clsx(styles.section, styles.balance);
  const accButtonClassName = clsx(
    buttonStyles.button,
    buttonStyles.normal,
    buttonStyles.secondary,
    styles.accountButton
  );

  return (
    <>
      <div className={styles.wallet}>
        {account ? (
          <>
            <div className={balanceSectionClassName}>
              <p>
                Balance:{' '}
                <span className={styles.balanceAmount}>
                  {account.balance.value} {account.balance.unit}
                </span>
              </p>
            </div>
            <div className={styles.section}>
              <button type="button" className={accButtonClassName} onClick={openModal}>
                <Identicon value={account.address} size={28} theme="polkadot" className={styles.avatar} />
                {account.meta.name}
              </button>
            </div>
          </>
        ) : (
          <div>
            <Button text="Connect" color="secondary" className={styles.accountButton} onClick={openModal} />
          </div>
        )}
      </div>
      {isModalOpen && <AccountsModal accounts={accounts} onClose={closeModal} />}
    </>
  );
};

export { Wallet };
