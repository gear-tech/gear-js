import { useCallback } from 'react';
import { useAlert, useAccount } from '@gear-js/react-hooks';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { decodeAddress } from '@gear-js/api';
import { Button, Modal } from '@gear-js/ui';

import { ModalProps } from 'entities/modal';
import { LocalStorage } from 'shared/config';
import logoutSVG from 'shared/assets/images/actions/logout.svg';

import styles from './AccountsModal.module.scss';
import { AccountList } from './accountList';

type Props = ModalProps & {
  accounts?: InjectedAccountWithMeta[];
};

const AccountsModal = ({ accounts, onClose }: Props) => {
  const alert = useAlert();
  const { logout, switchAccount, account } = useAccount();

  const handleLogout = () => {
    logout();

    localStorage.removeItem(LocalStorage.PublicKeyRaw);

    onClose();
  };

  const selectAccount = useCallback(
    (newAccount: InjectedAccountWithMeta) => {
      switchAccount(newAccount);

      localStorage.setItem(LocalStorage.PublicKeyRaw, decodeAddress(newAccount.address));

      onClose();

      alert.success('Account successfully changed');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose],
  );

  return (
    <Modal heading="Connect Account" close={onClose}>
      {accounts ? (
        <>
          <AccountList list={accounts} address={account?.address} toggleAccount={selectAccount} />
          <Button
            icon={logoutSVG}
            text="Logout"
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
