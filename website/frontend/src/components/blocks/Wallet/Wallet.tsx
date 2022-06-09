import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Identicon from '@polkadot/react-identicon';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Button, buttonStyles } from '@gear-js/ui';

import styles from './Wallet.module.scss';
import { useAccounts } from './hooks';
import { SelectAccountModal } from './SelectAccountModal';

import { useAccount, useApi } from 'hooks';

const Wallet = () => {
  const { api } = useApi();
  const accounts = useAccounts();
  const { account, updateBalance } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // TODO: think how to wrap it hook
    let unsub: UnsubscribePromise | undefined;

    if (account && api) {
      unsub = api.gearEvents.subscribeToBalanceChange(account.address, (balance) => {
        updateBalance(balance);
      });
    }

    return () => {
      if (unsub) {
        unsub.then((callback) => callback());
      }
    };
  }, [api, account, updateBalance]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
                Balance: <span className={styles.balanceAmount}>{account.balance.value}</span>
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
      <SelectAccountModal isOpen={isModalOpen} accounts={accounts} onClose={closeModal} />
    </>
  );
};

export { Wallet };
