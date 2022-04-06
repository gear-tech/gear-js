import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Modal } from '@gear-js/ui';
import AccountButton from 'shared/ui';
import { useAccount } from 'entities/account';
import isLoggedIn from '../../lib';
import styles from './AccountsModal.module.scss';

type Props = {
  accounts: InjectedAccountWithMeta[] | undefined;
  close: () => void;
};

function AccountsModal({ accounts, close }: Props) {
  const { setAccount } = useAccount();

  const switchAccount = (account: InjectedAccountWithMeta) => {
    setAccount(account);
    // TODO: 'account' to consts
    localStorage.setItem('account', account.address);
    close();
  };

  const getAccounts = () =>
    accounts?.map((account) => (
      <AccountButton
        key={account.address}
        address={account.address}
        name={account.meta.name}
        isActive={isLoggedIn(account)}
        onClick={() => switchAccount(account)}
      />
    ));

  return (
    <Modal heading="Connect" close={close} className={styles.modal}>
      {accounts ? (
        getAccounts()
      ) : (
        <p>
          Polkadot extension was not found or disabled. Please,{' '}
          <a
            href="https://polkadot.js.org/extension/"
            target="_blank"
            rel="noreferrer"
          >
            install it
          </a>
          .
        </p>
      )}
    </Modal>
  );
}

export default AccountsModal;
