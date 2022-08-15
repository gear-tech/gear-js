import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccount } from '@gear-js/react-hooks';
import { isLoggedIn } from 'utils';
import { AccountButton } from '../account-button';
import styles from './Accounts.module.scss';

type Props = {
  list: InjectedAccountWithMeta[];
  onChange: () => void;
};

function Accounts({ list, onChange }: Props) {
  const { switchAccount } = useAccount();
  const isAnyAccount = list.length > 0;

  const handleAccountButtonClick = (account: InjectedAccountWithMeta) => {
    switchAccount(account);
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
          onClick={() => handleAccountButtonClick(account)}
          block
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

export { Accounts };
