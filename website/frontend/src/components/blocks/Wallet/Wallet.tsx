import React, { useEffect, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import { useAlert } from 'react-alert';
import { useApi } from '../../../hooks/useApi';
import { Modal } from '../Modal';
import { AccountList } from '../AccountList';

import './Wallet.scss';

interface UserAccounts extends InjectedAccountWithMeta {
  isActive?: boolean;
}

export const Wallet = () => {
  const [ingectedAccounts, setIngectedAccounts] = useState<Array<UserAccounts> | null>(null);
  const [currentAccount, setCurrentAccount] = useState<UserAccounts | null>(null);
  const [freeBalance, setFreeBalance] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const alert = useAlert();
  const [api] = useApi();

  useEffect(() => {
    const getAllAccounts = async () => {
      const extensions = await web3Enable('Gear Tech');
      console.log(extensions);

      // if extansion does not exist
      if (extensions.length === 0) {
        console.log('extansion does not exist');
        return;
      }

      const allAccounts = await web3Accounts();

      allAccounts.forEach((acc: UserAccounts) => {
        if (acc.address === localStorage.getItem('savedAccount')) {
          acc.isActive = true;
          setCurrentAccount(acc);
        }
      });
      setIngectedAccounts(allAccounts);
    };

    // TODO: FIND ANOTHER WAY BE SHORE THAT EXTENSION IS READY
    setTimeout(() => {
      getAllAccounts();
    }, 100);
  }, []);

  // Get free balance for the chosen account

  useEffect(() => {
    const getBalance = async (ADDR: string) => {
      const { data: balance } = await api!.query.system.account(ADDR);
      setFreeBalance(balance.free.toHuman());
    };

    if (currentAccount && api) {
      getBalance(currentAccount.address);
    }
  }, [currentAccount, api]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Setting current account and save it into the LocalStage
  const selectAccount = (event: any, index: number) => {
    event.stopPropagation();
    if (ingectedAccounts) {
      ingectedAccounts.forEach((acc: any, i: any) => {
        acc.isActive = false;
        if (i === index) {
          acc.isActive = true;
          localStorage.setItem('savedAccount', acc.address);
          console.log(acc);
        }
      });
      setCurrentAccount(ingectedAccounts[index]);
    }
  };

  // const handleLogout = () => {
  //   setAccount(null);
  //   localStorage.removeItem('savedAccount');
  // };

  return (
    <>
      <div className="user-wallet__wrapper">
        {(currentAccount && (
          <>
            <div className="user-wallet__balance">{freeBalance}</div>
            <button type="button" className="user-wallet__user-info" onClick={toggleModal}>
              <Identicon value={currentAccount.address} size={25} theme="polkadot" />
              <span className="user-wallet__name">{currentAccount.meta.name}</span>
            </button>
          </>
        )) || (
          <button className="user-wallet__connect-button" type="button" onClick={toggleModal}>
            Connect
          </button>
        )}
      </div>
      {isOpen && (
        <Modal
          title="Connect"
          content={
            ingectedAccounts ? (
              <AccountList list={ingectedAccounts} toggleAccount={selectAccount} />
            ) : (
              <div className="user-wallet__msg">
                Polkadot extension was not found or disabled. Please{' '}
                <a href="https://polkadot.js.org/extension/" target="_blank" rel="noreferrer">
                  install it
                </a>
              </div>
            )
          }
          handleClose={toggleModal}
        />
      )}
    </>
  );
};
