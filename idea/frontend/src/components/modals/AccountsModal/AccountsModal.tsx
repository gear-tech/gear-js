import { useAlert, useAccount } from '@gear-js/react-hooks';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { GearKeyring } from '@gear-js/api';
import { Button, Modal } from '@gear-js/ui';

import styles from './AccountsModal.module.scss';
import { AccountList } from './children/AccountList';

import { LOCAL_STORAGE } from 'consts';
import { ModalProps } from 'context/modal/types';
import logoutSVG from 'assets/images/logout.svg';

export type Props = ModalProps & {
  accounts?: InjectedAccountWithMeta[];
};

const AccountsModal = ({ accounts, onClose }: Props) => {
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
            icon={logoutSVG}
            color="transparent"
            aria-label="Logout"
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
