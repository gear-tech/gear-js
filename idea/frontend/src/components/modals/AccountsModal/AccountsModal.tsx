import { useAlert, useAccount } from '@gear-js/react-hooks';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { GearKeyring } from '@gear-js/api';
import { Button, Modal } from '@gear-js/ui';

import styles from './AccountsModal.module.scss';
import { AccountsModalProps } from './types';
import { AccountList } from './children/AccountList';

import { LOCAL_STORAGE } from 'consts';
import logoutSVG from 'assets/images/logout.svg';

const AccountsModal = ({ accounts, onClose }: AccountsModalProps) => {
  const alert = useAlert();
  const { logout, switchAccount, account } = useAccount();

  const selectAccount = (newAccount: InjectedAccountWithMeta) => {
    switchAccount(newAccount);

    localStorage.setItem(LOCAL_STORAGE.PUBLIC_KEY_RAW, GearKeyring.decodeAddress(newAccount.address));

    onClose();

    alert.success('Account successfully changed');
  };

  const handleLogout = () => {
    logout();

    localStorage.removeItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

    onClose();
  };

  return (
    <Modal heading="Connect" className={styles.modal} close={onClose}>
      {accounts ? (
        <>
          <AccountList list={accounts} address={account?.address} toggleAccount={selectAccount} />
          <Button
            aria-label="Logout"
            icon={logoutSVG}
            color="transparent"
            className={styles.logoutButton}
            onClick={handleLogout}
          />
        </>
      ) : (
        <p className={styles.message}>
          Polkadot extension was not found or disabled. Please{' '}
          <a href="https://polkadot.js.org/extension/" target="_blank" rel="noreferrer">
            install it
          </a>
        </p>
      )}
    </Modal>
  );
};

export { AccountsModal };
