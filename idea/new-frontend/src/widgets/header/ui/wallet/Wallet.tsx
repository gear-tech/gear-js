import Identicon from '@polkadot/react-identicon';
import clsx from 'clsx';
import { useAccounts, Account } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui/dist/esm';

import { useModal } from 'hooks';
import polkadotSVG from 'shared/assets/images/logos/polkadotLogo.svg';

import styles from './Wallet.module.scss';

type Props = {
  account?: Account;
};

const Wallet = ({ account }: Props) => {
  const { accounts } = useAccounts();
  const { showModal } = useModal();

  const openModal = () => showModal('accounts', { accounts });

  const accountBtnClasses = clsx(buttonStyles.button, buttonStyles.medium, styles.accountBtn, styles.fixSize);

  return (
    <div className={styles.walletWrapper}>
      {account ? (
        <button type="button" className={accountBtnClasses} onClick={openModal}>
          <Identicon value={account.address} size={28} theme="polkadot" className={styles.avatar} />
          {account.meta.name}
        </button>
      ) : (
        <Button icon={polkadotSVG} text="Connect" color="primary" className={styles.fixSize} onClick={openModal} />
      )}
    </div>
  );
};

export { Wallet };
