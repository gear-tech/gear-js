import Identicon from '@polkadot/react-identicon';
import clsx from 'clsx';
import { useAccounts, Account } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';

import { useModal } from 'hooks';
import { LocalStorage } from 'shared/config';
import polkadotSVG from 'shared/assets/images/logos/polkadotLogo.svg';

import { useState } from 'react';
import styles from './Wallet.module.scss';
import { AuthorizationTooltip } from '../authorizationTooltip';

type Props = {
  account?: Account;
};

const Wallet = ({ account }: Props) => {
  const { accounts } = useAccounts();
  const { showModal } = useModal();

  const [isTooltipShowing, setIsTooltipShowing] = useState(
    !(account || Number(localStorage.getItem(LocalStorage.NewUser))),
  );

  const handleClick = () => {
    showModal('accounts', { accounts });

    if (isTooltipShowing) {
      setIsTooltipShowing(false);
      localStorage.setItem(LocalStorage.NewUser, '1');
    }
  };

  const accountBtnClasses = clsx(buttonStyles.button, buttonStyles.medium, styles.accountBtn, styles.fixSize);

  return (
    <div className={styles.walletWrapper}>
      {account ? (
        <button type="button" className={accountBtnClasses} onClick={handleClick}>
          <Identicon value={account.address} size={28} theme="polkadot" className={styles.avatar} />
          {account.meta.name}
        </button>
      ) : (
        <Button icon={polkadotSVG} text="Connect" color="primary" className={styles.fixSize} onClick={handleClick} />
      )}
      {isTooltipShowing && <AuthorizationTooltip />}
    </div>
  );
};

export { Wallet };
