import { useAlert } from '@gear-js/react-hooks';
import { Button, Modal, buttonStyles } from '@gear-js/ui';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import cx from 'clsx';
import SimpleBar from 'simplebar-react';

import { copyToClipboard } from '@/shared/helpers';
import LogoutSVG from '@/shared/assets/images/actions/logout.svg?react';
import CopyKeySVG from '@/shared/assets/images/actions/copyKey.svg?react';

import { AccountButton } from '../account-button';
import { useWallet } from '../../hooks';
import { WALLETS } from '../../consts';
import styles from './accounts-modal.module.scss';
import { useNewAccount } from '@/app/providers/account';

type Props = {
  close: () => void;
};

const AccountsModal = ({ close }: Props) => {
  const { wallets, account, login, logout } = useNewAccount();

  const alert = useAlert();

  const { wallet, walletId, setWalletId, resetWalletId } = useWallet();

  const handleLogoutClick = () => {
    logout();
    close();
  };

  const modalClassName = cx(styles.modal, !isWeb3Injected && styles.empty);
  const heading = wallet ? 'Connect account' : 'Choose Wallet';

  const getWallets = () =>
    WALLETS.map(([id, { SVG, name }]) => {
      const _wallet = wallets?.[id];
      const isConnected = _wallet?.status === 'connected';

      const accountsCount = _wallet?.accounts?.length;
      const accountsStatus = `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`;

      const buttonClassName = cx(
        buttonStyles.button,
        buttonStyles.large,
        buttonStyles.block,
        styles.button,
        styles.enabled,
      );

      return (
        <li key={id}>
          <button
            type="button"
            className={buttonClassName}
            onClick={() => (isConnected ? setWalletId(id) : _wallet?.connect())}>
            <span>
              <SVG className={buttonStyles.icon} /> {name}
            </span>

            <div className={styles.status}>
              <p className={styles.statusText}>{isConnected ? 'Enabled' : 'Disabled'}</p>

              {isConnected && <p className={styles.statusAccounts}>{accountsStatus}</p>}
            </div>
          </button>
        </li>
      );
    });

  const walletAccounts = wallets && walletId ? wallets[walletId].accounts : undefined;

  const getAccounts = () =>
    walletAccounts?.map((_account) => {
      const { address, meta } = _account;
      const isActive = address === account?.address;

      const handleClick = () => {
        if (isActive) return;

        login(_account);
        close();
      };

      const accountBtnClasses = cx(
        buttonStyles.large,
        styles.accountButton,
        isActive ? styles.active : buttonStyles.light,
      );

      return (
        <li key={address} className={styles.accountItem}>
          <AccountButton name={meta.name} address={address} className={accountBtnClasses} onClick={handleClick} />
          <Button icon={CopyKeySVG} color="transparent" onClick={() => copyToClipboard(address, alert)} />
        </li>
      );
    });

  return (
    <Modal heading={heading} close={close} className={modalClassName}>
      {isWeb3Injected ? (
        <>
          <SimpleBar className={styles.simplebar}>
            {!wallet && <ul className={styles.list}>{getWallets()}</ul>}

            {!!wallet &&
              (walletAccounts?.length ? (
                <ul className={styles.list}>{getAccounts()}</ul>
              ) : (
                <p>
                  No accounts found. Please open your Polkadot extension and create a new account or import existing.
                  Then reload this page.
                </p>
              ))}
          </SimpleBar>

          <footer className={styles.footer}>
            {wallet && <Button icon={wallet.SVG} text={wallet.name} color="transparent" onClick={resetWalletId} />}

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
