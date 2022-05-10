import React, { FC } from 'react';
import Identicon from '@polkadot/react-identicon';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import clsx from 'clsx';
import { toShortAddress } from 'helpers';
import './AccountList.scss';
import { LOCAL_STORAGE } from 'consts';

type Props = {
  list: Array<InjectedAccountWithMeta>;
  toggleAccount: (index: number) => void;
};

export const AccountList: FC<Props> = ({ list, toggleAccount }: Props) => {
  const getAccounts = () =>
    list.map((account, index) => (
      <li key={account.address}>
        <button
          type="button"
          className={clsx(
            'account-list__item',
            localStorage.getItem(LOCAL_STORAGE.SAVED_ACCOUNT) === account.address && 'active'
          )}
          onClick={() => {
            toggleAccount(index);
          }}
        >
          <span className="account-list__icon">
            <Identicon value={account.address} size={25} theme="polkadot" />
          </span>
          <span className="account-list__name">{account.meta.name}</span>
          <span className="account-list__address">{toShortAddress(account.address)}</span>
        </button>
      </li>
    ));

  return (
    <>
      {list.length > 0 ? (
        <ul className="account-list__wrapper">{getAccounts()}</ul>
      ) : (
        <p>
          No accounts found. Please open your Polkadot extension and create a new account or import existing. Then
          reload this page.
        </p>
      )}
    </>
  );
};
