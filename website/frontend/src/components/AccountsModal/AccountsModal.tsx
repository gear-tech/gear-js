import { Account, useAlert, useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './AccountsModal.module.scss';
import { AccountList } from './children/AccountList';

import { LOCAL_STORAGE } from 'consts';
import { ModalProps } from 'context/modal/types';
import { Modal } from 'components/common/Modal';
import logoutSVG from 'assets/images/logout.svg';

type Props = ModalProps & {
  accounts: Account[];
};

const AccountsModal = ({ accounts, onClose }: Props) => {
  const alert = useAlert();
  const { logout, switchAccount } = useAccount();

  const selectAccount = (account: Account) => {
    switchAccount(account);

    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, account.address);
    localStorage.setItem(LOCAL_STORAGE.PUBLIC_KEY_RAW, account.decodeAddress);

    onClose();

    alert.success('Account successfully changed');
  };

  const handleLogout = () => {
    logout();

    localStorage.removeItem(LOCAL_STORAGE.ACCOUNT);
    localStorage.removeItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

    onClose();
  };

  return (
    <Modal
      title="Connect"
      content={
        accounts ? (
          <>
            <AccountList list={accounts} toggleAccount={selectAccount} />
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
        )
      }
      handleClose={onClose}
    />
  );
};

export { AccountsModal };
