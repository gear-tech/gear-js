import { decodeAddress } from '@gear-js/api';
import { useAccount, useAlert } from '@gear-js/react-hooks';
import { Button, Modal, buttonStyles } from '@gear-js/ui';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';

import { LocalStorage } from '@/shared/config';
import { copyToClipboard } from '@/shared/helpers';
import LogoutSVG from '@/shared/assets/images/actions/logout.svg?react';
import ArrowSVG from '@/shared/assets/images/actions/arrowLeft.svg?react';
import CopyKeySVG from '@/shared/assets/images/actions/copyKey.svg?react';
import ConnectSVG from '@/shared/assets/images/actions/plus.svg?react';

import { AccountButton } from '../account-button';
import { useWallet } from '../../hooks';
import { WALLETS, WALLET } from '../../consts';
import { WalletId } from '../../types';
import styles from './accounts-modal.module.scss';

type Props = {
  close: () => void;
};

const AccountsModal = ({ close }: Props) => {
  const { account, accounts, extensions, login, logout } = useAccount();
  const alert = useAlert();

  const { wallet, walletId, switchWallet, resetWallet } = useWallet();
  const [isWalletSelection, setIsWalletSelection] = useState(!wallet);

  const toggleWalletSelection = () => setIsWalletSelection((prevValue) => !prevValue);
  const enableWalletSelection = () => setIsWalletSelection(true);
  const disableWalletSelection = () => setIsWalletSelection(false);

  const handleLogoutClick = () => {
    logout();
    close();
  };

  const handleAccountClick = (newAccount: InjectedAccountWithMeta) => {
    if (walletId) {
      login(newAccount);
      localStorage.setItem(LocalStorage.Wallet, walletId);
      close();
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
    const isChosenExtensionExists = extensions?.some((ext) => ext.name === walletId);

    if (!isChosenExtensionExists) resetWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensions]);

  const modalClassName = clsx(styles.modal, !isWeb3Injected && styles.empty);
  const heading = isWalletSelection ? 'Choose Wallet' : 'Connect account';

  const getWallets = () =>
    WALLETS.map((_id) => {
      const id = _id as WalletId;
      const { name, icon: Icon } = WALLET[id];

      const isActive = walletId === id;
      const isConnected = !!extensions?.some(({ name }) => name === id);

      return (
        <li key={id}>
          <button
            type="button"
            className={clsx(
              buttonStyles.button,
              buttonStyles.large,
              buttonStyles.block,
              styles.button,
              isConnected && styles.connected,
              isActive && styles.active,
            )}
            onClick={() => switchWallet(id)}>
            <span>
              <Icon className={buttonStyles.icon} /> {name}
            </span>
            <span className={styles.text}>
              {isConnected ? 'Connected' : 'Not connected'}
              <ConnectSVG className={styles.connectIcon} />
            </span>
          </button>
        </li>
      );
    });

  const getAccounts = () =>
    (accounts?.filter(({ meta }) => meta.source === walletId) || []).map((_account) => {
      const isActive = _account.address === account?.address;

      const handleClick = () => {
        if (isActive) return;

        handleAccountClick(_account);
      };

      const handleCopy = () => {
        const decodedAddress = decodeAddress(_account.address);

        copyToClipboard(decodedAddress, alert);
      };

      const accountBtnClasses = clsx(
        buttonStyles.large,
        styles.accountButton,
        isActive ? styles.active : buttonStyles.light,
      );

      return (
        <li key={_account.address} className={styles.accountItem}>
          <AccountButton
            name={_account.meta.name}
            address={_account.address}
            className={accountBtnClasses}
            onClick={handleClick}
          />

          <Button icon={CopyKeySVG} color="transparent" onClick={handleCopy} />
        </li>
      );
    });

  return (
    <Modal heading={heading} close={close} className={modalClassName}>
      {isWeb3Injected ? (
        <>
          <SimpleBar className={styles.simplebar}>
            {isWalletSelection && <ul className={styles.wallets}>{getWallets()}</ul>}

            {!isWalletSelection &&
              ((accounts?.filter(({ meta }) => meta.source === walletId) || []).length ? (
                <ul className={styles.accountList}>{getAccounts()}</ul>
              ) : (
                <p>
                  No accounts found. Please open your Polkadot extension and create a new account or import existing.
                  Then reload this page.
                </p>
              ))}
          </SimpleBar>

          <footer className={styles.footer}>
            {wallet && (
              <Button
                icon={isWalletSelection ? ArrowSVG : wallet.icon}
                text={isWalletSelection ? 'Back' : wallet.name}
                color="transparent"
                onClick={toggleWalletSelection}
                disabled={!wallet}
              />
            )}

            <Button
              icon={LogoutSVG}
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
