import React, { useCallback, useEffect, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useDispatch, useSelector } from 'react-redux';
import Identicon from '@polkadot/react-identicon';
import { GearKeyring } from '@gear-js/api';
import { useAlert } from 'react-alert';
import { LogoutIcon } from 'assets/Icons';
import { RootState } from 'store/reducers';
import { setCurrentAccount, resetCurrentAccount } from 'store/actions/actions';
import { UserAccount } from '../../../types/account';
import { useApi } from '../../../hooks/useApi';
import { Modal } from '../Modal';
import { AccountList } from '../AccountList';

import './Wallet.scss';

export const Wallet = () => {
  const [injectedAccounts, setInjectedAccounts] = useState<Array<UserAccount> | null>(null);
  const [accountBalance, setAccountBalance] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const alert = useAlert();
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);

  const getAllAccounts = useCallback(async () => {
    const extensions = await web3Enable('Gear Tech');

    // if extansion does not exist
    if (extensions.length === 0) {
      return null;
    }
    const accounts = await web3Accounts();

    return accounts;
  }, []);

  useEffect(() => {
    getAllAccounts()
      .then((allAccounts) => {
        if (allAccounts) {
          allAccounts.forEach((acc: UserAccount) => {
            if (acc.address === localStorage.getItem('savedAccount')) {
              acc.isActive = true;
              dispatch(setCurrentAccount(acc));
            }
          });
          setInjectedAccounts(allAccounts);
        }
      })
      .catch((err) => console.error(err));
  }, [dispatch, getAllAccounts]);

  // Get free balance for the chosen account

  useEffect(() => {
    const getBalance = async (address: string) => {
      const freeBalance = await api!.balance.findOut(address);
      setAccountBalance(freeBalance.toHuman());
    };

    if (currentAccount && api) {
      getBalance(currentAccount.address);
    }
  }, [currentAccount, api, dispatch]);

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
          localStorage.setItem('savedAccount', acc.address);
          localStorage.setItem('public_key_raw', GearKeyring.decodeAddress(acc.address));
        }
      });
      dispatch(setCurrentAccount(injectedAccounts[index]));
      toggleModal();
      alert.success('Account successfully changed');
    }
  };

  const handleLogout = () => {
    dispatch(resetCurrentAccount());
    localStorage.removeItem('savedAccount');
    localStorage.removeItem('public_key_raw');
  };

  return (
    <>
      <div className="user-wallet__wrapper">
        {(currentAccount && (
          <>
            <div className="user-wallet__balance">{accountBalance}</div>
            <button type="button" className="user-wallet__user-info" onClick={toggleModal}>
              <Identicon value={currentAccount.address} size={25} theme="polkadot" />
              <span className="user-wallet__name">{currentAccount.meta.name}</span>
            </button>
            <button type="button" className="user-wallet__logout" aria-label="menuLink" onClick={handleLogout}>
              <LogoutIcon color="#ffffff" />
            </button>
          </>
        )) || (
          <button className="user-wallet__connect-button" type="button" onClick={toggleModal}>
            Connect
          </button>
        )}
      </div>
      <Modal
        open={isOpen}
        title="Connect"
        content={
          injectedAccounts ? (
            <AccountList list={injectedAccounts} toggleAccount={selectAccount} />
          ) : (
            <div className="user-wallet__msg">
              Polkadot extension was not found or disabled. Please{' '}
              <a
                className="user-wallet__msg-link"
                href="https://polkadot.js.org/extension/"
                target="_blank"
                rel="noreferrer"
              >
                install it
              </a>
            </div>
          )
        }
        handleClose={toggleModal}
      />
    </>
  );
};
