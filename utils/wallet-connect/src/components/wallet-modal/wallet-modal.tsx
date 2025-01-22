import { useAccount, useAlert } from '@gear-js/react-hooks';
import cx from 'clsx';

import { copyToClipboard } from '../../utils';
import CopySVG from '../../assets/copy.svg?react';
import EditSVG from '../../assets/edit-icon.svg?react';
import ExitSVG from '../../assets/exit.svg?react';
import { IS_MOBILE_DEVICE, WALLETS } from '../../consts';
import { useWallet } from '../../hooks';
import { UI_CONFIG } from '../ui-config';
import styles from './wallet-modal.module.scss';

type Props = {
  theme?: 'gear' | 'vara';
  close: () => void;
};

function WalletModal({ theme = 'vara', close }: Props) {
  const alert = useAlert();
  const { wallets, isAnyWallet, account, login, logout } = useAccount();
  const { wallet, walletAccounts, setWalletId, resetWalletId } = useWallet();

  const themeClassName = styles[theme];
  const { WalletButton, AccountButton, Button, Modal } = UI_CONFIG[theme];

  const getWallets = () =>
    WALLETS.map(([id, { SVG, name }]) => {
      const { status, accounts, connect } = wallets?.[id] || {};
      const isEnabled = Boolean(status);
      const isConnected = status === 'connected';

      const accountsCount = accounts?.length || 0;
      const accountsStatus = `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`;

      return (
        <li key={id}>
          <WalletButton
            SVG={SVG}
            name={name}
            onClick={() => (isConnected ? setWalletId(id) : connect?.())}
            disabled={!isEnabled}>
            <span className={styles.status}>
              <span className={cx(styles.statusText, themeClassName)}>{isConnected ? 'Enabled' : 'Disabled'}</span>

              {isConnected && <span className={cx(styles.statusAccounts, themeClassName)}>{accountsStatus}</span>}
            </span>
          </WalletButton>
        </li>
      );
    });

  const getAccounts = () =>
    walletAccounts?.map((_account) => {
      const { address, meta } = _account;

      const isActive = address === account?.address;
      const color = isActive ? 'primary' : 'plain';

      const handleClick = () => {
        if (isActive) return;

        login(_account);
        close();
      };

      const handleCopyClick = () => {
        copyToClipboard({ value: address, alert });
        close();
      };

      return (
        <li key={address} className={styles.account}>
          <AccountButton.Modal address={address} name={meta.name} color={color} onClick={handleClick} />

          <Button
            icon={CopySVG}
            color="transparent"
            onClick={handleCopyClick}
            className={cx(styles.copyButton, themeClassName)}
          />
        </li>
      );
    });

  const handleLogoutButtonClick = () => {
    logout();
    resetWalletId();
    close();
  };

  const render = () => {
    if (!isAnyWallet)
      return IS_MOBILE_DEVICE ? (
        <p className={cx(styles.text, themeClassName)}>
          To use this application on mobile devices, open this page inside compatible wallets like Nova or SubWallet.
        </p>
      ) : (
        <p className={cx(styles.text, themeClassName)}>
          A compatible wallet was not found or is disabled. Install it following the{' '}
          <a href="https://wiki.vara.network/docs/account" target="_blank" rel="noreferrer">
            instructions
          </a>
          .
        </p>
      );

    if (!walletAccounts) return <ul className={styles.list}>{getWallets()}</ul>;
    if (walletAccounts.length) return <ul className={styles.list}>{getAccounts()}</ul>;

    return (
      <p className={cx(styles.text, themeClassName)}>
        No accounts found. Please open your extension and create a new account or import existing.
      </p>
    );
  };

  const renderFooter = () => {
    if (!wallet) return null;

    return (
      <div className={styles.footer}>
        <WalletButton.Change SVG={wallet.SVG} name={wallet.name} onClick={resetWalletId}>
          <EditSVG className={cx(styles.editIcon, themeClassName)} />
        </WalletButton.Change>

        {account && (
          <Button
            icon={ExitSVG}
            text="Logout"
            color="transparent"
            onClick={handleLogoutButtonClick}
            className={cx(styles.logoutButton, themeClassName)}
          />
        )}
      </div>
    );
  };

  return (
    <Modal heading="Connect Wallet" close={close} footer={renderFooter()}>
      {render()}
    </Modal>
  );
}

export { WalletModal };
