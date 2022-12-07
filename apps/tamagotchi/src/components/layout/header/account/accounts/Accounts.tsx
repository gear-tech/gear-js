import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccount } from '@gear-js/react-hooks';
import { isLoggedIn } from 'utils';
import { LOCAL_STORAGE } from 'consts';
import { AccountButton } from '../account-button';

type Props = {
  list: InjectedAccountWithMeta[];
  onChange: () => void;
};

export const Accounts = ({ list, onChange }: Props) => {
  const { switchAccount } = useAccount();

  const handleAccountButtonClick = async (account: InjectedAccountWithMeta) => {
    await switchAccount(account);
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, account.address);
    onChange();
  };

  return list.length > 0 ? (
    <ul className="space-y-4">
      {list.map((account) => (
        <li key={account.address}>
          <AccountButton
            address={account.address}
            name={account.meta.name}
            isActive={isLoggedIn(account)}
            onClick={() => handleAccountButtonClick(account)}
          />
        </li>
      ))}
    </ul>
  ) : (
    <p>
      No accounts found. Please open Polkadot extension, create a new account or import existing one and reload the
      page.
    </p>
  );
};
