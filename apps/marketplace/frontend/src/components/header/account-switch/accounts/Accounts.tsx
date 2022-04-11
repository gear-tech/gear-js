import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccount } from 'hooks';
import isLoggedIn from '../utils';
import AccountButton from '../account-button';
import styles from './Accounts.module.scss';

type Props = {
  list: InjectedAccountWithMeta[];
  onChange: () => void;
};

function Accounts({ list, onChange }: Props) {
  const { setAccount } = useAccount();
  const isAnyAccount = list.length > 0;

  const switchAccount = (account: InjectedAccountWithMeta) => {
    setAccount(account);
    // TODO: 'account' to consts
    localStorage.setItem('account', account.address);
    onChange();
  };

  const getAccounts = () =>
    list.map((account) => (
      <li key={account.address}>
        <AccountButton
          address={account.address}
          name={account.meta.name}
          isActive={isLoggedIn(account)}
          onClick={() => switchAccount(account)}
        />
      </li>
    ));

  return isAnyAccount ? (
    <ul className={styles.list}>{getAccounts()}</ul>
  ) : (
    <p>
      No accounts found. Please open Polkadot extension, create a new account or import existing one and reload the
      page.
    </p>
  );
}

export default Accounts;
