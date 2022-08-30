import clsx from 'clsx';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import { buttonStyles } from '@gear-js/ui/dist/esm';

import { getShortName } from 'shared/helpers';

import styles from './AccountList.module.scss';

type Props = {
  list: Array<InjectedAccountWithMeta>;
  address?: string;
  toggleAccount: (account: InjectedAccountWithMeta) => void;
};

const AccountList = ({ list, address, toggleAccount }: Props) => {
  const accountBtnClasses = clsx(buttonStyles.button, buttonStyles.secondary, styles.accountButton);

  const getAccounts = () =>
    list.map((account) => (
      <li key={account.address}>
        <button
          type="button"
          className={clsx(accountBtnClasses, address === account.address && styles.active)}
          onClick={() => toggleAccount(account)}>
          <Identicon value={account.address} size={28} theme="polkadot" className={styles.accountIcon} />
          <span className={styles.accountName}>{account.meta.name}</span>
          <span className={styles.accountAddress}>{getShortName(account.address, 13)}</span>
        </button>
      </li>
    ));

  if (!list.length) {
    return (
      <p>
        No accounts found. Please open your Polkadot extension and create a new account or import existing. Then reload
        this page.
      </p>
    );
  }

  return <ul className={styles.accountList}>{getAccounts()}</ul>;
};

export { AccountList };
