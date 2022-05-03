import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Identicon from '@polkadot/react-identicon';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Button, buttonStyles } from '@gear-js/ui';

import styles from './Wallet.module.scss';
import { useAccounts } from './hooks';
import { SelectAccountModal } from './SelectAccountModal';

import { LOCAL_STORAGE } from 'consts';
import { useAccount, useApi } from 'hooks';

const Wallet = () => {
  const { api } = useApi();
  const injectedAccounts = useAccounts();
  const { account: currentAccount, setAccount } = useAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [accountBalance, setAccountBalance] = useState('');

  useEffect(() => {
    const isLoggedIn = ({ address }: InjectedAccountWithMeta) => address === localStorage[LOCAL_STORAGE.SAVED_ACCOUNT];

    if (injectedAccounts) {
      setAccount(injectedAccounts.find(isLoggedIn));
    }
  }, [injectedAccounts, setAccount]);

  useEffect(() => {
    if (currentAccount && api) {
      api.balance.findOut(currentAccount.address).then((result) => setAccountBalance(result.toHuman()));
    }
  }, [currentAccount, api]);

  useEffect(() => {
    // TODO: think how to wrap it hook
    let unsub: UnsubscribePromise | undefined;

    if (currentAccount && api) {
      unsub = api.gearEvents.subscribeToBalanceChange(currentAccount.address, (balance) => {
        setAccountBalance(balance.toHuman());
      });
    }

    return () => {
      if (unsub) {
        unsub.then((callback) => callback());
      }
    };
  }, [api, currentAccount]);

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
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
        {currentAccount ? (
          <>
            <div className={balanceSectionClassName}>
              <p>
                Balance: <span className={styles.balanceAmount}>{accountBalance}</span>
              </p>
            </div>
            <div className={styles.section}>
              <button type="button" className={accButtonClassName} onClick={handleModalOpen}>
                <Identicon value={currentAccount.address} size={28} theme="polkadot" className={styles.avatar} />
                {currentAccount.meta.name}
              </button>
            </div>
          </>
        ) : (
          <div>
            <Button text="Connect" color="secondary" className={styles.accountButton} onClick={handleModalOpen} />
          </div>
        )}
      </div>
      <SelectAccountModal isOpen={isOpen} onClose={handleModalClose} />
    </>
  );
};

export { Wallet };
