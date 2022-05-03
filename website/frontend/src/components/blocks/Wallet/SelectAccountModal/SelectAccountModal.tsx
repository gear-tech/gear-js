import { useAlert } from 'react-alert';
import { GearKeyring } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Button } from '@gear-js/ui';

import styles from './SelectAccountModal.module.scss';
import { useAccounts } from '../hooks';
import { AccountList } from '../AccountList';

import { useAccount } from 'hooks';
import { LOCAL_STORAGE } from 'consts';
import logoutSVG from 'assets/images/logout.svg';
import { Modal } from 'components/blocks/Modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SelectAccountModal = (props: Props) => {
  const alert = useAlert();
  const { setAccount } = useAccount();
  const injectedAccounts = useAccounts();

  const { isOpen, onClose } = props;

  // Setting current account and save it into the LocalStage
  const selectAccount = (account: InjectedAccountWithMeta) => {
    setAccount(account);

    localStorage.setItem(LOCAL_STORAGE.SAVED_ACCOUNT, account.address);
    localStorage.setItem(LOCAL_STORAGE.PUBLIC_KEY_RAW, GearKeyring.decodeAddress(account.address));

    onClose();

    alert.success('Account successfully changed');
  };

  const logout = () => {
    setAccount(undefined);

    localStorage.removeItem(LOCAL_STORAGE.SAVED_ACCOUNT);
    localStorage.removeItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

    onClose();
  };

  return (
    <Modal
      open={isOpen}
      title="Connect"
      content={
        injectedAccounts ? (
          <>
            <AccountList list={injectedAccounts} toggleAccount={selectAccount} />
            <Button
              aria-label="Logout"
              icon={logoutSVG}
              color="transparent"
              className={styles.logoutButton}
              onClick={logout}
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

export { SelectAccountModal };
