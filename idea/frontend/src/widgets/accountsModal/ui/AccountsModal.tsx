import { useAccount } from '@gear-js/react-hooks';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Button, Modal } from '@gear-js/ui';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';

import { ModalProps } from 'entities/modal';
import { LocalStorage } from 'shared/config';
import { ReactComponent as logoutSVG } from 'shared/assets/images/actions/logout.svg';
import { ReactComponent as arrowSVG } from 'shared/assets/images/actions/arrowLeft.svg';

import { isWeb3Injected } from '@polkadot/extension-dapp';
import { useWallet } from '../hooks';
import { AccountList } from './accountList';
import { Wallets } from './wallets';
import styles from './AccountsModal.module.scss';

type Props = ModalProps & {
  accounts?: InjectedAccountWithMeta[];
};

const AccountsModal = ({ accounts, onClose }: Props) => {
  const { account, extensions, login, logout } = useAccount();
  const { wallet, walletId, switchWallet, resetWallet } = useWallet();

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
      login(newAccount);
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
    const isChosenExtensionExists = extensions.some((ext) => ext.name === walletId);

    if (!isChosenExtensionExists) resetWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensions]);

  const modalClassName = clsx(styles.modal, !isWeb3Injected && styles.empty);
  const heading = isWalletSelection ? 'Choose Wallet' : 'Connect account';

  return (
    <Modal heading={heading} close={onClose} className={modalClassName}>
      {isWeb3Injected ? (
        <>
          <SimpleBar className={styles.simplebar}>
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
          </SimpleBar>

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
        <p>
          Wallet extension was not found or disconnected. Please check how to install a supported wallet and create an
          account{' '}
          <a
            href="https://wiki.gear-tech.io/docs/idea/account/create-account"
            target="_blank"
            rel="noreferrer"
            className="link-text">
            here
          </a>
          .
        </p>
      )}
    </Modal>
  );
};

export { AccountsModal };
