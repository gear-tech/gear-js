import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Identicon from '@polkadot/react-identicon';
import { GearKeyring } from '@gear-js/api';
import { useAlert } from 'react-alert';
import { LogoutIcon } from 'assets/Icons';
import { UserAccount } from '../../../types/account';
import { useApi } from 'hooks';
import { Modal } from '../Modal';
import { AccountList } from './AccountList';
import { nodeApi } from '../../../api/initApi';
import { LOCAL_STORAGE } from 'consts';
import { useAccount } from 'hooks';
import styles from './Wallet.module.scss';

export const Wallet = () => {
  const [injectedAccounts, setInjectedAccounts] = useState<Array<UserAccount> | null>(null);
  const [accountBalance, setAccountBalance] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const alert = useAlert();
  const { api } = useApi();
  const { account: currentAccount, setAccount } = useAccount();

  const getAllAccounts = useCallback(async () => {
    if (typeof window !== `undefined`) {
      const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');

      const extensions = await web3Enable('Gear App');

      if (extensions.length === 0) {
        return null;
      }

      const accounts: UserAccount[] = await web3Accounts();

      return accounts;
    }

    return null;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getAllAccounts()
        .then((allAccounts) => {
          if (allAccounts) {
            allAccounts.forEach((acc: UserAccount) => {
              if (acc.address === localStorage.getItem(LOCAL_STORAGE.SAVED_ACCOUNT)) {
                acc.isActive = true;
                setAccount(acc);
              }
            });
            setInjectedAccounts(allAccounts);
          }
        })
        .catch((err) => console.error(err));
    }, 300);
  }, [setAccount, getAllAccounts]);

  const getBalance = useCallback(
    async (address: string) => {
      const freeBalance = await api.balance.findOut(address);
      return freeBalance;
    },
    [api]
  );

  useEffect(() => {
    if (currentAccount && api) {
      getBalance(currentAccount.address).then((result) => {
        setAccountBalance(result.toHuman());
      });
    }
  }, [currentAccount, api, getBalance]);

  const subscriptionRef = useRef<VoidFunction | null>(null);

  useEffect(() => {
    // TODO: think how to wrap it hook
    if (currentAccount) {
      nodeApi.api?.gearEvents
        .subscribeToBalanceChange(currentAccount.address, (balance) => {
          setAccountBalance(balance.toHuman());
        })
        .then((sub) => {
          subscriptionRef.current = sub;
        })
        .catch((err) => console.error(err));
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, [currentAccount]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  // Setting current account and save it into the LocalStage
  const selectAccount = (index: number) => {
    if (injectedAccounts) {
      injectedAccounts.forEach((acc: UserAccount, i: number) => {
        acc.isActive = false;
        if (i === index) {
          acc.isActive = true;
          localStorage.setItem(LOCAL_STORAGE.SAVED_ACCOUNT, acc.address);
          localStorage.setItem(LOCAL_STORAGE.PUBLIC_KEY_RAW, GearKeyring.decodeAddress(acc.address));
        }
      });
      setAccount(injectedAccounts[index]);
      toggleModal();
      alert.success('Account successfully changed');
    }
  };

  const handleLogout = () => {
    setAccount(undefined);
    localStorage.removeItem(LOCAL_STORAGE.SAVED_ACCOUNT);
    localStorage.removeItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);
    toggleModal();
  };

  const accButtonClassName = clsx(styles.button, styles.accountButton);
  const balanceSectionClassName = clsx(styles.section, styles.balance);

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
              <button type="button" className={accButtonClassName} onClick={toggleModal}>
                <Identicon value={currentAccount.address} size={28} theme="polkadot" className={styles.avatar} />
                {currentAccount.meta.name}
              </button>
            </div>
          </>
        ) : (
          <div>
            <button className={styles.button} type="button" onClick={toggleModal}>
              Connect
            </button>
          </div>
        )}
      </div>
      <Modal
        open={isOpen}
        title="Connect"
        content={
          injectedAccounts ? (
            <>
              <AccountList list={injectedAccounts} toggleAccount={selectAccount} />
              <button type="button" className={styles.logoutButton} aria-label="menuLink" onClick={handleLogout}>
                <LogoutIcon color="#fff" />
              </button>
            </>
          ) : (
            <p className={styles.message}>
              Polkadot extension was not found or disabled. Please{' '}
              <a href="https://polkadot.js.org/extension/" target="_blank" rel="noreferrer">
                install it
              </a>
            </p>
          )
        }
        handleClose={toggleModal}
      />
    </>
  );
};
