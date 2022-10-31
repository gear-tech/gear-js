import clsx from 'clsx';
import { Account, useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';
import { useState } from 'react';

import { useModal } from 'hooks';
import { LocalStorage } from 'shared/config';
import { AccountButton } from 'shared/ui/accountButton';
import polkadotSVG from 'shared/assets/images/logos/polkadotLogo.svg';

import styles from './Wallet.module.scss';
import { AuthorizationTooltip } from '../authorizationTooltip';

type Props = {
  account?: Account;
  isApiReady: boolean;
};

const Wallet = ({ account, isApiReady }: Props) => {
  const { accounts } = useAccount();
  const { showModal } = useModal();

  const [isTooltipShowing, setIsTooltipShowing] = useState(!localStorage.getItem(LocalStorage.NewUser));

  const hideTooltip = () => {
    setIsTooltipShowing(false);
    localStorage.setItem(LocalStorage.NewUser, 'false');
  };

  const handleClick = () => {
    showModal('accounts', { accounts });

    if (isTooltipShowing) hideTooltip();
  };

  const accountBtnClasses = clsx(buttonStyles.medium, styles.accountBtn, styles.fixSize);

  return (
    <div className={styles.walletWrapper}>
      {account ? (
        <AccountButton
          name={account.meta.name}
          address={account.address}
          className={accountBtnClasses}
          onClick={handleClick}
        />
      ) : (
        <Button icon={polkadotSVG} text="Connect" color="primary" className={styles.fixSize} onClick={handleClick} />
      )}
      {isApiReady && isTooltipShowing && <AuthorizationTooltip onCloseButtonClick={hideTooltip} />}
    </div>
  );
};

export { Wallet };
