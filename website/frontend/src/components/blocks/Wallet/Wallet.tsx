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

  const accountAddress = account?.address;

  useEffect(() => {
    // TODO: think how to wrap it hook
    let unsub: UnsubscribePromise | undefined;

    if (accountAddress && api) {
      unsub = api.gearEvents.subscribeToBalanceChange(accountAddress, updateBalance);
    }

    return () => {
      if (unsub) {
        unsub.then((callback) => callback());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accountAddress]);

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
                Balance:{' '}
                <span className={styles.balanceAmount}>
                  {account.balance.value} {account.balance.unit}
                </span>
              </p>
            </div>
            <div className={styles.section}>
              <button type="button" className={accButtonClassName} onClick={openModal}>
                <Identicon value={accountAddress} size={28} theme="polkadot" className={styles.avatar} />
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
