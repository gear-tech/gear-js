import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import styles from './AccountList.module.scss';
import { AccountItem } from '../accountItem';

type Props = {
  list: InjectedAccountWithMeta[];
  address?: string;
  toggleAccount: (account: InjectedAccountWithMeta) => void;
};

function AccountList({ list, address, toggleAccount }: Props) {
  if (!list.length) {
    return (
      <p>
        No accounts found. Please open your Polkadot extension and create a new account or import existing. Then reload
        this page.
      </p>
    );
  }

  return (
    <ul className={styles.accountList}>
      {list.map((account) => (
        <AccountItem
          key={account.address}
          account={account}
          isActive={address === account.address}
          onClick={toggleAccount}
        />
      ))}
    </ul>
  );
}

export { AccountList };
