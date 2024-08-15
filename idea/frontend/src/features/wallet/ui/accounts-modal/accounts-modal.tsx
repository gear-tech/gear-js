import { useAccount, useAlert } from '@gear-js/react-hooks';
import { Button, Modal, buttonStyles } from '@gear-js/ui';
import cx from 'clsx';

import { copyToClipboard } from '@/shared/helpers';
import LogoutSVG from '@/shared/assets/images/actions/logout.svg?react';
import CopyKeySVG from '@/shared/assets/images/actions/copyKey.svg?react';

import { AccountButton } from '../account-button';
import { useWallet } from '../../hooks';
import { WALLETS } from '../../consts';
import styles from './accounts-modal.module.scss';

type Props = {
  close: () => void;
};

const AccountsModal = ({ close }: Props) => {
  const { wallets, isAnyWallet, account, login, logout } = useAccount();
  const alert = useAlert();

  const { wallet, walletId, setWalletId, resetWalletId } = useWallet();

  const handleLogoutClick = () => {
    logout();
    close();
  };

  const renderWallets = () =>
    WALLETS.map(([id, { SVG, name }]) => {
      const { status, accounts, connect } = wallets?.[id] || {};
      const isEnabled = Boolean(status);
      const isConnected = status === 'connected';

      const accountsCount = accounts?.length;
      const accountsStatus = `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`;

      const buttonClassName = cx(
        buttonStyles.button,
        buttonStyles.large,
        buttonStyles.block,
        styles.button,
        isEnabled && styles.enabled,
      );

      return (
        <li key={id}>
          <button
            type="button"
            className={buttonClassName}
            onClick={() => (isConnected ? setWalletId(id) : connect?.())}>
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

  const walletAccounts = wallets && walletId ? wallets[walletId]?.accounts : undefined;

  const renderAccoounts = () =>
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

  const renderFooter = () =>
    (wallet || account) && (
      <div className={styles.footer}>
        {wallet && <Button icon={wallet.SVG} text={wallet.name} color="transparent" onClick={resetWalletId} />}
        {account && <Button icon={LogoutSVG} text="Logout" color="transparent" onClick={handleLogoutClick} />}
      </div>
    );

  return (
    <Modal heading={wallet ? 'Connect account' : 'Choose Wallet'} close={close} footer={renderFooter()}>
      {isAnyWallet ? (
        <>
          {!wallet && <ul className={styles.list}>{renderWallets()}</ul>}

          {!!wallet &&
            (walletAccounts?.length ? (
              <ul className={styles.list}>{renderAccoounts()}</ul>
            ) : (
              <p>No accounts found. Please open your extension and create a new account or import existing.</p>
            ))}
        </>
      ) : (
        <p>
          Wallet extensions were not found or disconnected. Please check how to install a supported wallet and create an
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
