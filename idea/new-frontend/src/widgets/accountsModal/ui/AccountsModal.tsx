import { useAccount } from '@gear-js/react-hooks';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Button, Modal } from '@gear-js/ui';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { ModalProps } from 'entities/modal';
import { LocalStorage } from 'shared/config';
import logoutSVG from 'shared/assets/images/actions/logout.svg';
import arrowSVG from 'shared/assets/images/actions/arrowLeft.svg';

import { useExtensions, useWallet } from '../hooks';
import { AccountList } from './accountList';
import { Wallets } from './wallets';
import { Empty } from './empty';
import styles from './AccountsModal.module.scss';

type Props = ModalProps & {
  accounts?: InjectedAccountWithMeta[];
};

const AccountsModal = ({ accounts, onClose }: Props) => {
  const { logout, switchAccount, account } = useAccount();
  const { wallet, walletId, switchWallet, resetWallet } = useWallet();
  const extensions = useExtensions();

  const [isWalletSelection, setIsWalletSelection] = useState(!wallet);

  const toggleWalletSelection = () => setIsWalletSelection((prevValue) => !prevValue);
  const enableWalletSelection = () => setIsWalletSelection(true);
  const disableWalletSelection = () => setIsWalletSelection(false);

  const handleLogoutClick = () => {
    logout();
    onClose();
  };

  const handleAccountClick = (newAccount: InjectedAccountWithMeta) => {
    if (walletId) {
      switchAccount(newAccount);
      localStorage.setItem(LocalStorage.Wallet, walletId);
      onClose();
    }
  };

  useEffect(() => {
    if (walletId) {
      disableWalletSelection();
    } else {
      enableWalletSelection();
    }
  }, [walletId]);

  useEffect(() => {
    if (extensions) {
      const isChosenExtensionExists = extensions.some((ext) => ext.name === walletId);

      if (!isChosenExtensionExists) resetWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensions]);

  const modalClassName = clsx(styles.modal, !accounts && styles.empty);
  const heading = isWalletSelection ? 'Choose Wallet' : 'Connect account';

  return (
    <Modal heading={heading} close={onClose} className={modalClassName}>
      {extensions ? (
        <>
          {isWalletSelection && (
            <Wallets selectedWalletId={walletId} onWalletClick={switchWallet} extensions={extensions} />
          )}
          {!isWalletSelection && (
            <AccountList
              list={accounts!.filter(({ meta }) => meta.source === walletId)}
              address={account?.address}
              toggleAccount={handleAccountClick}
            />
          )}

          <footer className={styles.footer}>
            {wallet && (
              <Button
                icon={isWalletSelection ? arrowSVG : wallet.icon}
                text={isWalletSelection ? 'Back' : wallet.name}
                color="transparent"
                onClick={toggleWalletSelection}
                disabled={!wallet}
              />
            )}

            <Button
              icon={logoutSVG}
              text="Logout"
              color="transparent"
              className={styles.logoutButton}
              onClick={handleLogoutClick}
            />
          </footer>
        </>
      ) : (
        <Empty />
      )}
    </Modal>
  );
};

export { AccountsModal };
